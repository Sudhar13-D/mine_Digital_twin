from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.db.database import get_db
from app.models.models import Alert
from app.schemas.schemas import AlertSchema, AlertAcknowledgeRequest
from app.services.connection_manager import manager

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertSchema])
async def list_alerts(
    panel: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    query = select(Alert).order_by(desc(Alert.created_at))
    if panel and panel != "All":
        query = query.where(Alert.panel == panel)
    if status:
        query = query.where(Alert.status == status)
    
    res = await db.execute(query)
    alerts = res.scalars().all()
    return [AlertSchema.model_validate(a) for a in alerts]

@router.post("/{alert_id}/acknowledge", response_model=AlertSchema)
async def acknowledge_alert(
    alert_id: str,
    data: Optional[AlertAcknowledgeRequest] = None,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = res.scalars().first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.status = "acknowledged"
    alert.acknowledged_by = data.acknowledgedBy if data and data.acknowledgedBy else "Mine Manager"
    await db.commit()
    await db.refresh(alert)
    
    alert_schema = AlertSchema.model_validate(alert)
    # Broadcast alert acknowledgment event to all WebSocket clients
    await manager.broadcast({
        "type": "ALERT_UPDATE",
        "alert": alert_schema.model_dump(by_alias=True)
    })
    
    return alert_schema

@router.post("/{alert_id}/resolve", response_model=AlertSchema)
async def resolve_alert(
    alert_id: str,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = res.scalars().first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.status = "resolved"
    await db.commit()
    await db.refresh(alert)
    
    alert_schema = AlertSchema.model_validate(alert)
    await manager.broadcast({
        "type": "ALERT_UPDATE",
        "alert": alert_schema.model_dump(by_alias=True)
    })
    
    return alert_schema
