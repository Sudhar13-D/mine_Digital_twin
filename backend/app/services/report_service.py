import os
import io
import datetime
import pandas as pd
from typing import List, Optional
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from sqlalchemy import select
from app.models.models import SensorNode, SensorReading, Alert

def generate_csv_report(
    report_type: str,
    panel: str,
    date_from: str,
    date_to: str,
    nodes: List[SensorNode],
    alerts: List[Alert]
) -> bytes:
    output = io.StringIO()
    
    # Header metadata
    output.write(f"# SubsideAI Mine Subsidence Compliance Report\n")
    output.write(f"# Report Type: {report_type}\n")
    output.write(f"# Target Panel: {panel}\n")
    output.write(f"# Timeframe: {date_from} to {date_to}\n")
    output.write(f"# Generated At: {datetime.datetime.utcnow().isoformat()} UTC\n\n")

    # Section 1: Sensor Nodes Summary
    output.write("[CURRENT SENSOR TELEMETRY & RISK STATUS]\n")
    nodes_data = []
    for n in nodes:
        nodes_data.append({
            "Node ID": n.id,
            "Label": n.label,
            "Panel": n.panel,
            "Risk Level": n.risk,
            "Status": n.status,
            "Tilt (deg)": n.tilt,
            "Vibration (mm/s)": n.vibration,
            "AE (cnt/min)": n.ae,
            "Displacement (mm)": n.displacement,
            "Soil Moisture (%)": n.soil_moisture,
            "Temp (C)": n.temp,
            "Crack (mm)": n.crack,
            "Anomaly Score": n.anomaly_score,
            "Failure Prediction (Days)": n.prediction_days,
        })
    df_nodes = pd.DataFrame(nodes_data)
    df_nodes.to_csv(output, index=False)
    output.write("\n\n")

    # Section 2: Alert Log
    output.write("[GEOTECHNICAL ALERT LOG]\n")
    alerts_data = []
    for a in alerts:
        alerts_data.append({
            "Alert ID": a.id,
            "Level": a.level,
            "Panel": a.panel,
            "Nodes": ",".join(str(nid) for nid in (a.node_ids or [])),
            "Timestamp": a.timestamp,
            "Status": a.status,
            "Acknowledged By": a.acknowledged_by or "N/A",
            "Message": a.message,
        })
    df_alerts = pd.DataFrame(alerts_data)
    df_alerts.to_csv(output, index=False)

    return output.getvalue().encode('utf-8')

def generate_pdf_report(
    report_type: str,
    panel: str,
    date_from: str,
    date_to: str,
    nodes: List[SensorNode],
    alerts: List[Alert]
) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#1A1714')
    )
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#5A5248')
    )
    section_style = ParagraphStyle(
        'Section',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#C9A66B'),
        spaceBefore=12,
        spaceAfter=6
    )
    cell_style = ParagraphStyle(
        'Cell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#211E18')
    )

    elements = []

    # Title & Header
    elements.append(Paragraph(f"SubsideAI — {report_type}", title_style))
    elements.append(Paragraph(f"Mine Subsidence Compliance & Geotechnical Risk Report | Panel: {panel}", subtitle_style))
    elements.append(Paragraph(f"Period: {date_from} to {date_to} | Generated: {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#C9A66B'), spaceBefore=8, spaceAfter=12))

    # Executive Summary Card
    high_count = sum(1 for n in nodes if n.risk == 'HIGH')
    avg_tilt = sum(abs(n.tilt) for n in nodes) / len(nodes) if nodes else 0.0
    active_alerts = sum(1 for a in alerts if a.status == 'active')

    summary_data = [
        ["Total Monitored Nodes", f"{len(nodes)} Active", "HIGH Risk Sensors", f"{high_count} Nodes"],
        ["Average Strata Tilt", f"{avg_tilt:.2f}°", "Pending Active Alerts", f"{active_alerts} Alerts"],
    ]
    summary_table = Table(summary_data, colWidths=[140, 120, 140, 120])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F5F2EB')),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.HexColor('#1A1714')),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('PADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D9D2C5')),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 14))

    # Table 1: Sensor Readings
    elements.append(Paragraph("Live Sensor Node Telemetry & Anomaly Analysis", section_style))
    node_table_data = [
        ["Node", "Panel", "Risk", "Tilt", "Vib.", "AE", "Disp.", "Anomaly", "Pred. Days"]
    ]
    for n in nodes:
        node_table_data.append([
            n.label,
            n.panel,
            n.risk,
            f"{n.tilt:.2f}°",
            f"{n.vibration:.2f}",
            f"{int(n.ae)}/m",
            f"{n.displacement:.1f}mm",
            f"{n.anomaly_score:.2f}",
            f"{n.prediction_days}d"
        ])
    
    node_table = Table(node_table_data, colWidths=[60, 60, 50, 55, 50, 55, 55, 65, 70])
    node_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#211E18')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#EDE6DA')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8),
        ('BOTTOMPADDING', (0,0), (-1,0), 5),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#FAF9F6')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E0DCD3')),
        ('FONTSIZE', (0,1), (-1,-1), 8),
    ]))
    elements.append(node_table)
    elements.append(Spacer(1, 14))

    # Table 2: Alerts
    elements.append(Paragraph("Geotechnical Alert & Hazard Records", section_style))
    alert_table_data = [
        ["Alert ID", "Level", "Panel", "Time", "Status", "Message"]
    ]
    for a in alerts:
        alert_table_data.append([
            a.id,
            a.level,
            a.panel,
            a.timestamp,
            a.status.capitalize(),
            Paragraph(a.message, cell_style)
        ])
    
    alert_table = Table(alert_table_data, colWidths=[55, 45, 55, 45, 65, 255])
    alert_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#211E18')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#EDE6DA')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8),
        ('BOTTOMPADDING', (0,0), (-1,0), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E0DCD3')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(alert_table)

    # Footer note
    elements.append(Spacer(1, 16))
    elements.append(Paragraph(
        "Confidential — Prepared automatically by SubsideAI Real-Time Geotechnical Monitoring System under DGMS mine safety guidelines.",
        subtitle_style
    ))

    doc.build(elements)
    buffer.seek(0)
    return buffer.read()
