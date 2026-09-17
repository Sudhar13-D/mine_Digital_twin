from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.db.database import get_db
from app.models.models import SensorNode, SensorReading
from app.schemas.schemas import SensorNodeBase, SensorNodeCreate, SensorReadingSchema, SensorReadingInput
from app.services.mqtt_service import process_sensor_payload

router = APIRouter(prefix="/nodes", tags=["Sensor Nodes"])

@router.get("", response_model=List[SensorNodeBase])
async def list_sensor_nodes(
    panel: Optional[str] = Query(None, description="Filter by panel name"),
    db: AsyncSession = Depends(get_db)
):
    query = select(SensorNode).order_by(SensorNode.id)
    if panel and panel != "All":
        query = query.where(SensorNode.panel == panel)
    res = await db.execute(query)
    nodes = res.scalars().all()
    return [SensorNodeBase.model_validate(n) for n in nodes]

@router.get("/{node_id}", response_model=SensorNodeBase)
async def get_sensor_node(node_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(SensorNode).where(SensorNode.id == node_id))
    node = res.scalars().first()
    if not node:
        raise HTTPException(status_code=404, detail="Sensor node not found")
    return SensorNodeBase.model_validate(node)

@router.post("", response_model=SensorNodeBase)
async def create_sensor_node(data: SensorNodeCreate, db: AsyncSession = Depends(get_db)):
    # Find next available ID
    count_res = await db.execute(select(SensorNode))
    existing = count_res.scalars().all()
    next_id = max([n.id for n in existing], default=0) + 1
    
    new_node = SensorNode(
        id=next_id,
        label=data.label or f"Node {next_id}",
        panel=data.panel,
        gis_x=data.gisX,
        gis_y=data.gisY,
        cs_x=data.csX,
        pillar_id=data.pillarId,
        risk="LOW",
        status="online",
        confidence=90.0,
        prediction_days=30
    )
    db.add(new_node)
    await db.commit()
    await db.refresh(new_node)
    return SensorNodeBase.model_validate(new_node)

@router.get("/{node_id}/history", response_model=List[SensorReadingSchema])
async def get_node_history(
    node_id: int, 
    limit: int = Query(50, le=500), 
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(SensorReading)
        .where(SensorReading.node_id == node_id)
        .order_by(desc(SensorReading.timestamp))
        .limit(limit)
    )
    res = await db.execute(query)
    readings = res.scalars().all()
    return [SensorReadingSchema.model_validate(r) for r in readings]

@router.post("/{node_id}/telemetry")
async def ingest_telemetry(node_id: int, reading: SensorReadingInput):
    """
    Direct HTTP telemetry ingestion endpoint (useful for fallback or testing).
    Triggers database persistence, anomaly detection, and WebSocket broadcasting.
    """
    payload = reading.model_dump(exclude_unset=True)
    await process_sensor_payload(node_id, payload)
    return {"status": "success", "node_id": node_id}
