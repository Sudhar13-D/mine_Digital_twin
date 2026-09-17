from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_db
from app.models.models import Panel, Pillar
from app.schemas.schemas import PanelSchema, PillarSchema

router = APIRouter(prefix="", tags=["Panels & Pillars"])

@router.get("/panels", response_model=List[PanelSchema])
async def list_panels(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Panel).order_by(Panel.id))
    panels = res.scalars().all()
    return [PanelSchema.model_validate(p) for p in panels]

@router.get("/pillars", response_model=List[PillarSchema])
async def list_pillars(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Pillar).order_by(Pillar.id))
    pillars = res.scalars().all()
    return [PillarSchema.model_validate(p) for p in pillars]
