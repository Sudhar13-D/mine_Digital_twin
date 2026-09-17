import datetime
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), default="Mine Manager")
    role = Column(String(50), default="Admin")  # Admin, Supervisor, Planner, Regulator
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Panel(Base):
    __tablename__ = "panels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    coalfield = Column(String(100), default="Demo Coalfield")
    status = Column(String(50), default="Active")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Pillar(Base):
    __tablename__ = "pillars"

    id = Column(Integer, primary_key=True, index=True)
    pillar_number = Column(Integer, nullable=False)
    panel_name = Column(String(100), nullable=False)
    failure_mode = Column(String(100), default="Shear failure")
    mining_date = Column(String(50), default="2024-Q1")
    cs_x = Column(Float, default=0.0)

class SensorNode(Base):
    __tablename__ = "sensor_nodes"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(100), nullable=False, unique=True)
    panel = Column(String(100), nullable=False, index=True)
    risk = Column(String(20), default="LOW")  # LOW, MEDIUM, HIGH
    status = Column(String(20), default="offline")  # online, offline
    tilt = Column(Float, nullable=True, default=None)
    vibration = Column(Float, nullable=True, default=None)
    ae = Column(Float, nullable=True, default=None)
    displacement = Column(Float, nullable=True, default=None)
    soil_moisture = Column(Float, nullable=True, default=None)
    temp = Column(Float, nullable=True, default=None)
    humidity = Column(Float, nullable=True, default=None)
    uwb = Column(Float, nullable=True, default=None)
    crack = Column(Float, nullable=True, default=None)
    rssi = Column(Float, nullable=True, default=None)
    snr = Column(Float, nullable=True, default=None)
    last_update = Column(Integer, default=0)
    gis_x = Column(Float, default=200.0)  # placeholder coordinates
    gis_y = Column(Float, default=200.0)  # placeholder coordinates
    cs_x = Column(Float, default=0.35)    # placeholder position
    pillar_id = Column(Integer, default=1) # placeholder pillar
    anomaly_score = Column(Float, default=0.0)
    confidence = Column(Float, default=60.0)
    prediction_days = Column(Integer, default=30)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    readings = relationship("SensorReading", back_populates="node", cascade="all, delete-orphan")

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(Integer, ForeignKey("sensor_nodes.id", ondelete="CASCADE"), nullable=False, index=True)
    tilt = Column(Float, nullable=True)
    vibration = Column(Float, nullable=True)
    ae = Column(Float, nullable=True, default=None)
    displacement = Column(Float, nullable=True, default=None)
    soil_moisture = Column(Float, nullable=True, default=None)
    temp = Column(Float, nullable=True, default=None)
    humidity = Column(Float, nullable=True, default=None)
    uwb = Column(Float, nullable=True, default=None)
    crack = Column(Float, nullable=True, default=None)
    rssi = Column(Float, nullable=True, default=None)
    snr = Column(Float, nullable=True, default=None)
    raw_json = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    node = relationship("SensorNode", back_populates="readings")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(50), primary_key=True, index=True)
    level = Column(String(20), nullable=False)  # LOW, MEDIUM, HIGH
    panel = Column(String(100), nullable=False, index=True)
    node_ids = Column(JSON, nullable=False)  # list of int e.g. [1]
    timestamp = Column(String(50), nullable=False)
    status = Column(String(20), default="active")  # active, acknowledged, resolved
    acknowledged_by = Column(String(100), nullable=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SystemSetting(Base):
    __tablename__ = "system_settings"

    key = Column(String(100), primary_key=True, index=True)
    value = Column(JSON, nullable=False)
    category = Column(String(50), default="general")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
