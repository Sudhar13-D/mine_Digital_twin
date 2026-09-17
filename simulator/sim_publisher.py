import os
import time
import json
import random
import logging
import paho.mqtt.client as mqtt

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [SensorSimulator]: %(message)s"
)
logger = logging.getLogger("Simulator")

MQTT_BROKER_HOST = os.getenv("MQTT_BROKER_HOST", "localhost")
MQTT_BROKER_PORT = int(os.getenv("MQTT_BROKER_PORT", "1883"))

# Initial baseline states for sensors across panels
NODES_CONFIG = [
    {
        "id": 1, "panel": "Panel 1", "risk": "LOW",
        "tilt": -0.95, "vibration": 0.12, "ae": 2, "displacement": 1.0,
        "soilMoisture": 42, "temp": 23, "uwb": 0.0, "crack": 0.0
    },
    {
        "id": 2, "panel": "Panel 1", "risk": "LOW",
        "tilt": 1.20, "vibration": 0.18, "ae": 5, "displacement": 2.0,
        "soilMoisture": 44, "temp": 23, "uwb": -0.5, "crack": 0.1
    },
    {
        "id": 5, "panel": "Panel 2", "risk": "HIGH",
        "tilt": 8.73, "vibration": 2.48, "ae": 142, "displacement": 47.0,
        "soilMoisture": 65, "temp": 24, "uwb": -2.0, "crack": 2.4
    },
    {
        "id": 6, "panel": "Panel 2", "risk": "HIGH",
        "tilt": 8.02, "vibration": 2.15, "ae": 127, "displacement": 42.0,
        "soilMoisture": 68, "temp": 24, "uwb": -1.0, "crack": 2.1
    },
    {
        "id": 7, "panel": "Panel 2", "risk": "HIGH",
        "tilt": 7.01, "vibration": 1.89, "ae": 118, "displacement": 38.0,
        "soilMoisture": 61, "temp": 24, "uwb": -1.5, "crack": 1.8
    },
    {
        "id": 8, "panel": "Panel 2", "risk": "HIGH",
        "tilt": 7.76, "vibration": 2.02, "ae": 131, "displacement": 44.0,
        "soilMoisture": 67, "temp": 25, "uwb": -1.8, "crack": 2.2
    },
]

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        logger.info(f"Connected to MQTT broker at {MQTT_BROKER_HOST}:{MQTT_BROKER_PORT}")
    else:
        logger.error(f"Failed to connect, return code {rc}")

def main():
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect

    while True:
        try:
            logger.info(f"Attempting connection to MQTT broker {MQTT_BROKER_HOST}:{MQTT_BROKER_PORT}...")
            client.connect(MQTT_BROKER_HOST, MQTT_BROKER_PORT, 60)
            client.loop_start()
            break
        except Exception as e:
            logger.warning(f"Could not connect to MQTT broker: {e}. Retrying in 4 seconds...")
            time.sleep(4)

    logger.info("Starting telemetry simulation loop...")
    
    current_states = {n["id"]: dict(n) for n in NODES_CONFIG}

    try:
        while True:
            for node_id, state in current_states.items():
                panel = state["panel"]
                risk = state["risk"]

                # Fluctuation logic
                if risk == "HIGH":
                    # Drift and micro-seismic acoustic emission spikes
                    state["tilt"] = round(state["tilt"] + random.uniform(-0.08, 0.10), 2)
                    state["vibration"] = round(max(0.1, state["vibration"] + random.uniform(-0.06, 0.08)), 2)
                    state["ae"] = max(80, state["ae"] + random.randint(-8, 12))
                    state["displacement"] = round(state["displacement"] + random.uniform(-0.1, 0.3), 1)
                    state["crack"] = round(min(5.0, state["crack"] + random.uniform(-0.01, 0.03)), 2)
                    last_update = random.randint(1, 3)
                else:
                    # Low risk gentle random walk
                    state["tilt"] = round(state["tilt"] + random.uniform(-0.02, 0.02), 2)
                    state["vibration"] = round(max(0.05, state["vibration"] + random.uniform(-0.01, 0.01)), 2)
                    state["ae"] = max(1, min(10, state["ae"] + random.randint(-1, 1)))
                    state["displacement"] = round(max(0.5, state["displacement"] + random.uniform(-0.05, 0.05)), 1)
                    last_update = random.randint(2, 6)

                payload = {
                    "nodeId": node_id,
                    "panel": panel,
                    "tilt": state["tilt"],
                    "vibration": state["vibration"],
                    "ae": state["ae"],
                    "displacement": state["displacement"],
                    "soilMoisture": state["soilMoisture"],
                    "temp": state["temp"],
                    "uwb": state["uwb"],
                    "crack": state["crack"],
                    "lastUpdate": last_update,
                    "timestamp": time.time()
                }

                topic = f"mine/{panel.replace(' ', '_')}/node/{node_id}/reading"
                client.publish(topic, json.dumps(payload))

            time.sleep(3.0)
    except KeyboardInterrupt:
        logger.info("Stopping sensor simulator.")
    finally:
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    main()
