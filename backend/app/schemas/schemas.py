from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, ConfigDict, Field
import datetime

RiskLevel = Literal['LOW', 'MEDIUM', 'HIGH']
NodeStatus = Literal['online', 'offline']
AlertStatus = Literal['active', 'acknowledged', 'resolved']

# --- SensorNode schema mirroring types.ts with exact camelCase JSON ---
class SensorNodeBase(BaseModel):
    id: int
    label: str
    panel: str
    risk: RiskLevel = 'LOW'
    status: NodeStatus = 'offline'
    tilt: Optional[float] = None
    vibration: Optional[float] = None
    ae: Optional[float] = None
    displacement: Optional[float] = None
    soilMoisture: Optional[float] = Field(default=None, validation_alias="soil_moisture")
    temp: Optional[float] = None
    humidity: Optional[float] = None
    uwb: Optional[float] = None
    crack: Optional[float] = None
    rssi: Optional[float] = None
    snr: Optional[float] = None
    lastUpdate: int = Field(default=0, validation_alias="last_update")
    gisX: float = Field(default=200.0, validation_alias="gis_x")
    gisY: float = Field(default=200.0, validation_alias="gis_y")
    csX: float = Field(default=0.35, validation_alias="cs_x")
    pillarId: int = Field(default=1, validation_alias="pillar_id")
    anomalyScore: float = Field(default=0.0, validation_alias="anomaly_score")
    confidence: float = 60.0
    predictionDays: int = Field(default=30, validation_alias="prediction_days")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

class SensorNodeCreate(BaseModel):
    label: str
    panel: str
    gisX: float = 200.0
    gisY: float = 200.0
    csX: float = 0.35
    pillarId: int = 1

class SensorReadingSchema(BaseModel):
    id: int
    node_id: int
    tilt: Optional[float] = None
    vibration: Optional[float] = None
    ae: Optional[float] = None
    displacement: Optional[float] = None
    soil_moisture: Optional[float] = None
    temp: Optional[float] = None
    humidity: Optional[float] = None
    uwb: Optional[float] = None
    crack: Optional[float] = None
    rssi: Optional[float] = None
    snr: Optional[float] = None
    timestamp: datetime.datetime

    model_config = ConfigDict(from_attributes=True)

class SensorReadingInput(BaseModel):
    node_id: Optional[str] = None
    tilt: Optional[float] = None
    tilt_x: Optional[float] = None
    tilt_y: Optional[float] = None
    vibration: Optional[float] = None
    soil_raw: Optional[float] = None
    soilMoisture: Optional[float] = None
    temperature_c: Optional[float] = None
    temp: Optional[float] = None
    humidity_percent: Optional[float] = None
    humidity: Optional[float] = None
    rssi: Optional[float] = None
    snr: Optional[float] = None
    ae: Optional[float] = None
    displacement: Optional[float] = None
    uwb: Optional[float] = None
    crack: Optional[float] = None
    accel: Optional[Dict[str, float]] = None
    gyro: Optional[Dict[str, float]] = None

# --- Alert schema mirroring types.ts ---
class AlertSchema(BaseModel):
    id: str
    level: RiskLevel
    panel: str
    nodeIds: List[int] = Field(default_factory=list, validation_alias="node_ids")
    timestamp: str
    status: AlertStatus
    acknowledgedBy: Optional[str] = Field(None, validation_alias="acknowledged_by")
    message: str

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

class AlertAcknowledgeRequest(BaseModel):
    acknowledgedBy: Optional[str] = "Mine Manager"

# --- Panel & Pillar schemas ---
class PanelSchema(BaseModel):
    id: int
    name: str
    coalfield: str
    status: str

    model_config = ConfigDict(from_attributes=True)

class PillarSchema(BaseModel):
    id: int
    pillar_number: int
    panel_name: str
    failure_mode: str
    mining_date: str
    cs_x: float

    model_config = ConfigDict(from_attributes=True)

# --- User & Auth schemas ---
class UserLogin(BaseModel):
    email: str
    password: str

class UserSchema(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserSchema

# --- Settings & Reports ---
class SystemSettingsUpdate(BaseModel):
    key: str
    value: Dict[str, Any]
    category: Optional[str] = "general"

class ReportGenerateRequest(BaseModel):
    reportType: str
    dateFrom: str
    dateTo: str
    panel: str
    format: Literal['PDF', 'CSV', 'Excel'] = 'PDF'

class ReportItem(BaseModel):
    id: str
    type: str
    panel: str
    date: str
    size: str
    status: str
    download_url: Optional[str] = None
