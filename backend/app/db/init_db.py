import datetime
import logging
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import engine, Base, AsyncSessionLocal
from app.models.models import User, Panel, Pillar, SensorNode, Alert, SystemSetting
from app.core.security import get_password_hash

logger = logging.getLogger(__name__)

INITIAL_PANELS = [
    {"name": "Panel 1", "coalfield": "Demo Coalfield", "status": "Active"},
    {"name": "Panel 2", "coalfield": "Demo Coalfield", "status": "Active"},
    {"name": "Panel 3", "coalfield": "Demo Coalfield", "status": "Planned"},
]

INITIAL_PILLARS = [
    {"pillar_number": 1, "panel_name": "Panel 1", "failure_mode": "Stable", "mining_date": "2024-Q1", "cs_x": 0.35},
    {"pillar_number": 2, "panel_name": "Panel 1", "failure_mode": "Stable", "mining_date": "2024-Q1", "cs_x": 0.50},
    {"pillar_number": 3, "panel_name": "Panel 1", "failure_mode": "Yielding", "mining_date": "2024-Q1", "cs_x": 0.65},
    {"pillar_number": 4, "panel_name": "Panel 1", "failure_mode": "Stable", "mining_date": "2024-Q1", "cs_x": 0.80},
]

# Only single real hardware node NODE01 initially seeded in offline state
INITIAL_NODES = [
    {
        "id": 1,
        "label": "NODE01",
        "panel": "Panel 1",  # Physically installed panel
        "risk": "LOW",
        "status": "offline",  # Flips to 'online' on first real reading
        "tilt": None,
        "vibration": None,
        "ae": None,           # Hardware does not have AE sensor -> NULL
        "displacement": None, # Hardware does not have displacement sensor -> NULL
        "soil_moisture": None,
        "temp": None,
        "humidity": None,
        "uwb": None,          # NULL
        "crack": None,        # NULL
        "rssi": None,
        "snr": None,
        "last_update": 0,
        "gis_x": 200.0,       # Placeholder coordinate
        "gis_y": 200.0,       # Placeholder coordinate
        "cs_x": 0.35,         # Placeholder cross-section position
        "pillar_id": 1,       # Placeholder pillar ID
        "anomaly_score": 0.0,
        "confidence": 60.0,   # Baseline confidence for 3-sensor hardware
        "prediction_days": 30,
    },
]

DEFAULT_SETTINGS = [
    {
        "key": "thresholds",
        "category": "thresholds",
        "value": {
            "tilt": {"low": 1.5, "medium": 4.0, "high": 7.0},
            "vibration": {"low": 0.3, "medium": 1.0, "high": 2.0},
            "ae": {"low": 20, "medium": 60, "high": 100},
            "displacement": {"low": 5, "medium": 20, "high": 35},
            "crack": {"low": 0.5, "medium": 1.2, "high": 2.0},
            "soilMoisture": {"low": 30, "medium": 50, "high": 70},
        }
    },
    {
        "key": "notifications",
        "category": "notifications",
        "value": {
            "emailAlerts": True,
            "smsCritical": True,
            "soundAlerts": True,
            "autoAcknowledgeLow": False
        }
    }
]

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # 1. Clean out any obsolete mock nodes if present
        mock_nodes_res = await session.execute(select(SensorNode).where(SensorNode.label != "NODE01"))
        mock_nodes = mock_nodes_res.scalars().all()
        for mn in mock_nodes:
            await session.delete(mn)

        # 2. Seed User
        user_res = await session.execute(select(User).where(User.email == "manager@subside.ai"))
        if not user_res.scalars().first():
            admin_user = User(
                email="manager@subside.ai",
                hashed_password=get_password_hash("password123"),
                full_name="Mine Manager",
                role="Admin",
                is_active=True
            )
            session.add(admin_user)

        # 3. Seed Panels
        for p_data in INITIAL_PANELS:
            p_res = await session.execute(select(Panel).where(Panel.name == p_data["name"]))
            if not p_res.scalars().first():
                session.add(Panel(**p_data))

        # 4. Seed Pillars
        for pil_data in INITIAL_PILLARS:
            pil_res = await session.execute(
                select(Pillar).where(
                    Pillar.pillar_number == pil_data["pillar_number"],
                    Pillar.panel_name == pil_data["panel_name"]
                )
            )
            if not pil_res.scalars().first():
                session.add(Pillar(**pil_data))

        # 5. Seed NODE01
        for n_data in INITIAL_NODES:
            n_res = await session.execute(select(SensorNode).where(SensorNode.label == n_data["label"]))
            if not n_res.scalars().first():
                session.add(SensorNode(**n_data))

        # 6. Seed System Settings
        for s_data in DEFAULT_SETTINGS:
            s_res = await session.execute(select(SystemSetting).where(SystemSetting.key == s_data["key"]))
            if not s_res.scalars().first():
                session.add(SystemSetting(**s_data))

        await session.commit()
        logger.info("Database initialized with single real hardware node NODE01.")
