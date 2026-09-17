from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
import logging
from sqlalchemy import select
from app.services.connection_manager import manager
from app.db.database import AsyncSessionLocal
from app.models.models import SensorNode, Alert
from app.schemas.schemas import SensorNodeBase, AlertSchema

logger = logging.getLogger(__name__)

router = APIRouter(tags=["WebSocket"])

@router.websocket("/ws/live")
async def websocket_live_telemetry(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial snapshot upon connection
        async with AsyncSessionLocal() as session:
            n_res = await session.execute(select(SensorNode).order_by(SensorNode.id))
            nodes = n_res.scalars().all()
            
            a_res = await session.execute(select(Alert).order_by(Alert.created_at.desc()))
            alerts = a_res.scalars().all()

            snapshot_msg = {
                "type": "INITIAL_SNAPSHOT",
                "nodes": [SensorNodeBase.model_validate(n).model_dump(by_alias=True) for n in nodes],
                "alerts": [AlertSchema.model_validate(a).model_dump(by_alias=True) for a in alerts],
            }
            await websocket.send_json(snapshot_msg)

        # Keep connection open and listen for client heartbeats or messages
        while True:
            data = await websocket.receive_text()
            # If client sends ping, respond with pong
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)
