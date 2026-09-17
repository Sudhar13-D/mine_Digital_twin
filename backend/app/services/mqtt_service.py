import asyncio
import json
import math
import logging
import datetime
from typing import Dict, Any, Optional, Union
from sqlalchemy import select, update, or_
from app.db.database import AsyncSessionLocal
from app.models.models import SensorNode, SensorReading, Alert
from app.schemas.schemas import SensorNodeBase, AlertSchema
from app.services.anomaly import anomaly_detector
from app.services.connection_manager import manager
from app.core.config import settings

logger = logging.getLogger(__name__)

async def process_sensor_payload(node_identifier: Union[str, int], payload: Dict[str, Any]):
    """
    Real hardware telemetry ingestion pipeline for ESP32/LoRa nodes:
    - Parses tilt_x/tilt_y into magnitude sqrt(x^2 + y^2)
    - Passes vibration digital flag / value through as-is
    - Converts soil_raw ADC into percentage: 100 - (soil_raw / 4095 * 100)
    - Maps temperature_c to temp and humidity_percent to humidity
    - Preserves ae, displacement, crack, uwb as NULL (unmeasured sensors)
    - Stores link metadata (rssi, snr)
    - Flips node status from 'offline' to 'online'
    - Runs AI/ML anomaly detection with dynamic feature scaling
    - Broadcasts live update over /ws/live WebSocket
    """
    async with AsyncSessionLocal() as session:
        try:
            # 1. Fetch sensor node by string label (e.g. "NODE01") or integer ID
            node = None
            ident_str = str(node_identifier).strip()
            
            # Try matching by label (e.g. "NODE01")
            res = await session.execute(select(SensorNode).where(SensorNode.label == ident_str))
            node = res.scalars().first()

            # If not found and identifier is numeric, try matching by id
            if not node and ident_str.isdigit():
                res = await session.execute(select(SensorNode).where(SensorNode.id == int(ident_str)))
                node = res.scalars().first()

            # If still not found and only single node exists, match that node
            if not node:
                res = await session.execute(select(SensorNode))
                all_nodes = res.scalars().all()
                if len(all_nodes) == 1:
                    node = all_nodes[0]

            if not node:
                logger.warning(f"Sensor node '{node_identifier}' not found in database. Skipping.")
                return

            # 2. Extract & calculate real hardware telemetry fields
            
            # Tilt: compute magnitude from tilt_x and tilt_y if present
            tilt_x = payload.get("tilt_x")
            tilt_y = payload.get("tilt_y")
            if tilt_x is not None and tilt_y is not None:
                tilt = round(math.sqrt(float(tilt_x) ** 2 + float(tilt_y) ** 2), 2)
            elif payload.get("tilt") is not None:
                tilt = round(float(payload.get("tilt")), 2)
            else:
                tilt = node.tilt

            # Vibration: pass through as-is (e.g. 0/1 digital flag or float)
            vib_in = payload.get("vibration")
            vibration = float(vib_in) if vib_in is not None else node.vibration

            # Soil moisture: convert raw 12-bit ADC value (4095 dry -> 0%, 0 wet -> 100%)
            # NOTE: Needs calibration against actual sensor's wet/dry voltage range.
            soil_raw = payload.get("soil_raw")
            if soil_raw is not None:
                soil_moisture = round(max(0.0, min(100.0, 100.0 - (float(soil_raw) / 4095.0 * 100.0))), 1)
            elif payload.get("soilMoisture") is not None or payload.get("soil_moisture") is not None:
                soil_moisture = float(payload.get("soilMoisture") or payload.get("soil_moisture"))
            else:
                soil_moisture = node.soil_moisture

            # Temperature
            temp_in = payload.get("temperature_c") if payload.get("temperature_c") is not None else payload.get("temp")
            temp = round(float(temp_in), 1) if temp_in is not None else node.temp

            # Humidity
            hum_in = payload.get("humidity_percent") if payload.get("humidity_percent") is not None else payload.get("humidity")
            humidity = round(float(hum_in), 1) if hum_in is not None else node.humidity

            # Link quality metadata
            rssi = float(payload.get("rssi")) if payload.get("rssi") is not None else node.rssi
            snr = float(payload.get("snr")) if payload.get("snr") is not None else node.snr

            # Unmeasured sensors: explicitly preserve as NULL (None in Python), DO NOT coerce to zero
            ae = float(payload["ae"]) if payload.get("ae") is not None else None
            displacement = float(payload["displacement"]) if payload.get("displacement") is not None else None
            crack = float(payload["crack"]) if payload.get("crack") is not None else None
            uwb = float(payload["uwb"]) if payload.get("uwb") is not None else None

            last_update = 0

            # 3. Save reading history
            reading = SensorReading(
                node_id=node.id,
                tilt=tilt,
                vibration=vibration,
                soil_moisture=soil_moisture,
                temp=temp,
                humidity=humidity,
                rssi=rssi,
                snr=snr,
                ae=ae,
                displacement=displacement,
                crack=crack,
                uwb=uwb,
                raw_json=payload,
                timestamp=datetime.datetime.utcnow(),
            )
            session.add(reading)

            # 4. Run AI Anomaly Detection (only with measured signals)
            current_dict = {
                "tilt": tilt,
                "vibration": vibration,
                "soil_moisture": soil_moisture,
                "ae": ae,
                "displacement": displacement,
                "crack": crack,
            }
            anomaly_res = anomaly_detector.analyze_node_readings(current_dict)

            # 5. Update Node Current State (flip to 'online')
            node.status = "online"
            node.tilt = tilt
            node.vibration = vibration
            node.soil_moisture = soil_moisture
            node.temp = temp
            node.humidity = humidity
            node.rssi = rssi
            node.snr = snr
            node.ae = ae
            node.displacement = displacement
            node.crack = crack
            node.uwb = uwb
            node.last_update = last_update
            node.risk = anomaly_res.risk_level
            node.anomaly_score = anomaly_res.anomaly_score
            node.confidence = anomaly_res.confidence
            node.prediction_days = anomaly_res.prediction_days
            node.updated_at = datetime.datetime.utcnow()

            new_alert_obj = None

            # 6. Check if alert should be triggered
            if anomaly_res.is_anomaly and anomaly_res.risk_level in ["HIGH", "MEDIUM"]:
                alert_query = await session.execute(
                    select(Alert).where(Alert.panel == node.panel, Alert.status == "active")
                )
                existing_alert = alert_query.scalars().first()
                now_str = datetime.datetime.now().strftime("%H:%M")

                if existing_alert:
                    node_ids = list(existing_alert.node_ids) if existing_alert.node_ids else []
                    if node.id not in node_ids:
                        node_ids.append(node.id)
                        existing_alert.node_ids = node_ids
                    if anomaly_res.risk_level == "HIGH":
                        existing_alert.level = "HIGH"
                        existing_alert.message = (
                            f"Critical {anomaly_res.trigger_reason or 'strata deformation'}. "
                            f"Anomaly score {anomaly_res.anomaly_score:.2f} (Conf: {anomaly_res.confidence}%). "
                            f"Pillar failure risk elevated within {anomaly_res.prediction_days} days."
                        )
                    new_alert_obj = existing_alert
                else:
                    alert_count_res = await session.execute(select(Alert))
                    total_alerts = len(alert_count_res.scalars().all()) + 1
                    alert_id = f"ALT-{str(total_alerts).zfill(3)}"
                    
                    msg = (
                        f"Critical {anomaly_res.trigger_reason or 'spike detected'}. "
                        f"Anomaly {anomaly_res.anomaly_score:.2f} on {node.label}. "
                        f"Pillar failure risk elevated within {anomaly_res.prediction_days} days. Immediate escalation recommended."
                        if anomaly_res.risk_level == "HIGH"
                        else f"Moderate deformation trend on {node.label} (Tilt {tilt:.2f}°). Monitoring interval reduced."
                    )

                    new_alert_obj = Alert(
                        id=alert_id,
                        level=anomaly_res.risk_level,
                        panel=node.panel,
                        node_ids=[node.id],
                        timestamp=now_str,
                        status="active",
                        message=msg
                    )
                    session.add(new_alert_obj)

            await session.commit()
            await session.refresh(node)

            # Build serialized schema representations for WebSocket broadcast
            node_schema = SensorNodeBase.model_validate(node)
            alert_schema = AlertSchema.model_validate(new_alert_obj) if new_alert_obj else None

            # 7. Broadcast over WebSocket
            broadcast_msg = {
                "type": "NODE_UPDATE",
                "node": node_schema.model_dump(),
                "alert": alert_schema.model_dump() if alert_schema else None,
                "timestamp": datetime.datetime.utcnow().isoformat(),
            }
            await manager.broadcast(broadcast_msg)
            logger.info(f"Ingested real reading for {node.label}: Tilt={tilt}°, Vib={vibration}, Soil={soil_moisture}%, Temp={temp}°C, Status=online")

        except Exception as e:
            logger.error(f"Error processing sensor payload for '{node_identifier}': {e}", exc_info=True)
            await session.rollback()

async def start_mqtt_listener():
    """
    Background worker that connects to MQTT broker and processes telemetry topics.
    Subscribes with wildcard to support NODE01 and any future nodes: mine/+/node/+/reading
    """
    import aiomqtt
    
    broker = settings.MQTT_BROKER_HOST
    port = settings.MQTT_BROKER_PORT
    topic = "mine/+/node/+/reading"

    logger.info(f"Connecting MQTT listener to {broker}:{port} on topic '{topic}'...")
    
    while True:
        try:
            async with aiomqtt.Client(hostname=broker, port=port) as client:
                logger.info(f"Successfully connected to MQTT broker at {broker}:{port}")
                await client.subscribe(topic)
                async for message in client.messages:
                    try:
                        topic_str = message.topic.value
                        # Topic format: mine/{panel}/node/{node_id}/reading
                        parts = topic_str.split("/")
                        if len(parts) >= 4 and parts[2] == "node":
                            node_id_str = parts[3]
                            payload = json.loads(message.payload.decode())
                            # If payload includes node_id, use that, otherwise use topic part
                            ident = payload.get("node_id", node_id_str)
                            await process_sensor_payload(ident, payload)
                    except Exception as parse_err:
                        logger.error(f"Error parsing MQTT message: {parse_err}")
        except Exception as conn_err:
            logger.debug(f"MQTT Broker at {broker}:{port} not available yet: {conn_err}. Retrying in 5 seconds...")
            await asyncio.sleep(5)
