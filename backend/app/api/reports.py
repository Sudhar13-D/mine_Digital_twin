from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import io
import datetime
from app.db.database import get_db
from app.models.models import SensorNode, Alert
from app.schemas.schemas import ReportGenerateRequest, ReportItem
from app.services.report_service import generate_pdf_report, generate_csv_report

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/recent", response_model=List[ReportItem])
async def get_recent_reports():
    return [
        ReportItem(id="RPT-2026-091", type="Daily Summary", panel="Panel 2", date="2026-09-05", size="1.2 MB", status="ready"),
        ReportItem(id="RPT-2026-090", type="Incident Report", panel="Panel 2", date="2026-09-04", size="3.4 MB", status="ready"),
        ReportItem(id="RPT-2026-088", type="Compliance Audit", panel="All Panels", date="2026-09-01", size="8.1 MB", status="ready"),
        ReportItem(id="RPT-2026-085", type="Daily Summary", panel="Panel 1", date="2026-08-28", size="0.9 MB", status="ready"),
        ReportItem(id="RPT-2026-082", type="Incident Report", panel="Panel 1", date="2026-08-22", size="2.7 MB", status="ready"),
    ]

@router.post("/generate")
async def generate_report(
    req: ReportGenerateRequest,
    db: AsyncSession = Depends(get_db)
):
    # Fetch relevant nodes
    node_query = select(SensorNode)
    if req.panel and req.panel != "All":
        node_query = node_query.where(SensorNode.panel == req.panel)
    n_res = await db.execute(node_query)
    nodes = n_res.scalars().all()

    # Fetch alerts
    alert_query = select(Alert)
    if req.panel and req.panel != "All":
        alert_query = alert_query.where(Alert.panel == req.panel)
    a_res = await db.execute(alert_query)
    alerts = a_res.scalars().all()

    filename_slug = req.reportType.lower().replace(" ", "_")
    clean_panel = req.panel.lower().replace(" ", "_")
    timestamp_str = datetime.datetime.now().strftime("%Y%m%d_%H%M")

    if req.format == "CSV":
        csv_bytes = generate_csv_report(
            report_type=req.reportType,
            panel=req.panel,
            date_from=req.dateFrom,
            date_to=req.dateTo,
            nodes=nodes,
            alerts=alerts
        )
        filename = f"subsideai_{filename_slug}_{clean_panel}_{timestamp_str}.csv"
        return StreamingResponse(
            io.BytesIO(csv_bytes),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    else:
        # Default PDF
        pdf_bytes = generate_pdf_report(
            report_type=req.reportType,
            panel=req.panel,
            date_from=req.dateFrom,
            date_to=req.dateTo,
            nodes=nodes,
            alerts=alerts
        )
        filename = f"subsideai_{filename_slug}_{clean_panel}_{timestamp_str}.pdf"
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
