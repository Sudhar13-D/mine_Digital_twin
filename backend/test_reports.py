import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.models.models import SensorNode, Alert
from app.services.report_service import generate_pdf_report, generate_csv_report

def test_reports():
    nodes = [
        SensorNode(id=1, label="Node 1", panel="Panel 1", risk="LOW", status="online", tilt=-0.95, vibration=0.12, ae=2, displacement=1, soil_moisture=42, temp=23, uwb=0, crack=0, last_update=3, gis_x=162, gis_y=185, cs_x=0.15, pillar_id=3, anomaly_score=0.12, confidence=88, prediction_days=30),
        SensorNode(id=5, label="Node 5", panel="Panel 2", risk="HIGH", status="online", tilt=8.73, vibration=2.48, ae=142, displacement=47, soil_moisture=65, temp=24, uwb=-2, crack=2.4, last_update=2, gis_x=452, gis_y=158, cs_x=0.43, pillar_id=12, anomaly_score=0.87, confidence=94, prediction_days=3),
    ]
    alerts = [
        Alert(id="ALT-001", level="HIGH", panel="Panel 2", node_ids=[5], timestamp="14:23", status="active", message="Critical tilt and AE spike detected."),
    ]
    
    pdf_bytes = generate_pdf_report("Daily Summary", "Panel 2", "2026-08-27", "2026-09-03", nodes, alerts)
    print(f"Generated PDF report size: {len(pdf_bytes)} bytes")
    assert len(pdf_bytes) > 1000, "PDF report too small"

    csv_bytes = generate_csv_report("Daily Summary", "Panel 2", "2026-08-27", "2026-09-03", nodes, alerts)
    print(f"Generated CSV report size: {len(csv_bytes)} bytes")
    assert len(csv_bytes) > 200, "CSV report too small"

    print("ALL REPORT GENERATION TESTS PASSED!")

if __name__ == "__main__":
    test_reports()
