import asyncio
import sys
import os
import math

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.init_db import init_db
from app.db.database import AsyncSessionLocal
from app.models.models import SensorNode, SensorReading, Alert, User
from app.services.anomaly import anomaly_detector
from app.services.mqtt_service import process_sensor_payload
from sqlalchemy import select

async def run_tests():
    print("1. Initializing DB with real hardware seed...")
    await init_db()
    
    async with AsyncSessionLocal() as session:
        print("2. Verifying seeded node...")
        n_res = await session.execute(select(SensorNode))
        nodes = n_res.scalars().all()
        print(f"Found {len(nodes)} sensor node(s): {[n.label for n in nodes]}")
        assert len(nodes) == 1, f"Expected exactly 1 sensor node, found {len(nodes)}"
        node01 = nodes[0]
        assert node01.label == "NODE01", f"Expected label NODE01, got {node01.label}"
        assert node01.status == "offline", f"Expected initial status offline, got {node01.status}"
        assert node01.ae is None, "Expected ae to be None"
        assert node01.displacement is None, "Expected displacement to be None"

        print("3. Verifying admin user...")
        u_res = await session.execute(select(User).where(User.email == "manager@subside.ai"))
        user = u_res.scalars().first()
        assert user is not None, "Admin user not found"
        print(f"Admin user verified: {user.email} ({user.role})")

    print("\n4. Ingesting sample Real Hardware payload (ESP32/LoRa format)...")
    hardware_payload = {
        "node_id": "NODE01",
        "timestamp": "2026-09-05T14:23:09",
        "tilt_x": 71.83,
        "tilt_y": -2.27,
        "vibration": 1,
        "soil_raw": 4095,
        "temperature_c": 30.9,
        "humidity_percent": 69.7,
        "accel": { "x": 0.04, "y": 0.949, "z": -0.309 },
        "gyro": { "x": -1.73, "y": 1.74, "z": 0.56 },
        "rssi": -63,
        "snr": 10.5,
        "ae": None,
        "displacement": None,
        "crack": None,
        "uwb": None
    }
    await process_sensor_payload("NODE01", hardware_payload)

    async with AsyncSessionLocal() as session:
        n_res = await session.execute(select(SensorNode).where(SensorNode.label == "NODE01"))
        updated_node = n_res.scalars().first()
        
        expected_tilt = round(math.sqrt(71.83**2 + (-2.27)**2), 2)
        expected_soil = round(100.0 - (4095.0 / 4095.0 * 100.0), 1)
        
        print(f"Post-ingestion Node status: {updated_node.status}")
        print(f"Calculated Tilt: {updated_node.tilt}° (Expected: {expected_tilt}°)")
        print(f"Calculated Soil: {updated_node.soil_moisture}% (Expected: {expected_soil}%)")
        print(f"Stored Temp: {updated_node.temp}°C")
        print(f"Stored Humidity: {updated_node.humidity}%")
        print(f"Stored RSSI: {updated_node.rssi} dBm, SNR: {updated_node.snr}")
        print(f"AE sensor status: {updated_node.ae} (NULL verified)")
        print(f"Displacement sensor status: {updated_node.displacement} (NULL verified)")
        print(f"AI Anomaly Score: {updated_node.anomaly_score}, Confidence: {updated_node.confidence}%, Risk: {updated_node.risk}")

        assert updated_node.status == "online", "Node should flip to 'online'"
        assert updated_node.tilt == expected_tilt, f"Tilt mismatch: {updated_node.tilt} vs {expected_tilt}"
        assert updated_node.soil_moisture == expected_soil, f"Soil mismatch: {updated_node.soil_moisture} vs {expected_soil}"
        assert updated_node.temp == 30.9, f"Temp mismatch: {updated_node.temp}"
        assert updated_node.humidity == 69.7, f"Humidity mismatch: {updated_node.humidity}"
        assert updated_node.rssi == -63.0, f"RSSI mismatch: {updated_node.rssi}"
        assert updated_node.ae is None, "AE must remain None/NULL"
        assert updated_node.displacement is None, "Displacement must remain None/NULL"

        # Check reading row was inserted
        r_res = await session.execute(select(SensorReading).where(SensorReading.node_id == updated_node.id))
        readings = r_res.scalars().all()
        assert len(readings) >= 1, "Expected at least 1 reading in history"
        print(f"Verified sensor_readings row inserted: ID={readings[-1].id}")

    print("\n5. Testing Anomaly Detector with partial sensor suite (tilt + vib + soil only)...")
    partial_reading = {
        "tilt": 4.5,
        "vibration": 0,
        "soil_moisture": 45.0,
        "ae": None,
        "displacement": None,
        "crack": None
    }
    res = anomaly_detector.analyze_node_readings(partial_reading)
    print(f"Partial sensor anomaly result: score={res.anomaly_score}, risk={res.risk_level}, confidence={res.confidence}%, pred_days={res.prediction_days}")
    assert res.anomaly_score > 0.0, "Anomaly score should not be zeroed by null sensors"
    assert res.confidence < 85.0, f"Confidence should be reduced for 3-sensor node (got {res.confidence}%)"

    print("\n========================================================")
    print("ALL REAL HARDWARE BACKEND INTEGRATION TESTS PASSED 100%!")
    print("========================================================")

if __name__ == "__main__":
    asyncio.run(run_tests())
