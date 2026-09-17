from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_db
from app.models.models import SystemSetting
from app.schemas.schemas import SystemSettingsUpdate

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("")
async def get_settings(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    res = await db.execute(select(SystemSetting))
    settings_rows = res.scalars().all()
    result = {}
    for s in settings_rows:
        result[s.key] = s.value
    return result

@router.post("/update")
async def update_settings(data: SystemSettingsUpdate, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(SystemSetting).where(SystemSetting.key == data.key))
    setting = res.scalars().first()
    if setting:
        setting.value = data.value
        setting.category = data.category or setting.category
    else:
        setting = SystemSetting(key=data.key, value=data.value, category=data.category or "general")
        db.add(setting)
    
    await db.commit()
    await db.refresh(setting)
    return {"status": "success", "key": setting.key, "value": setting.value}
