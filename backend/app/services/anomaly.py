import numpy as np
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass

@dataclass
class AnomalyResult:
    anomaly_score: float
    confidence: float
    prediction_days: int
    risk_level: str  # 'LOW' | 'MEDIUM' | 'HIGH'
    is_anomaly: bool
    trigger_reason: Optional[str] = None

class GeotechnicalAnomalyDetector:
    """
    SubsideAI Geotechnical Strata & Pillar Failure Anomaly Predictor.
    Evaluates multi-sensor telemetry with dynamic feature availability support.
    Missing signals (null/None) are dynamically excluded from weighting rather than treated as zero/safe,
    and confidence is scaled accordingly to reflect reduced instrument certainty.
    """
    def __init__(self):
        # Geotechnical alert thresholds for Indian coal mining conditions (DGMS standards)
        self.tilt_warning = 3.0       # degrees (Medium risk)
        self.tilt_critical = 6.5      # degrees (High risk)
        self.ae_warning = 50.0        # counts/min
        self.ae_critical = 100.0      # counts/min
        self.disp_warning = 20.0      # mm
        self.disp_critical = 35.0     # mm
        self.crack_warning = 1.0      # mm
        self.crack_critical = 2.0     # mm
        self.soil_moisture_sat = 80.0 # % RH saturation

        # Nominal relative weights across full instrument suite
        self.feature_weights = {
            "tilt": 0.40,
            "vibration": 0.20,
            "soil_moisture": 0.15,
            "ae": 0.15,
            "displacement": 0.05,
            "crack": 0.05,
        }

    def analyze_node_readings(
        self, 
        current_reading: Dict[str, Optional[float]], 
        history: Optional[List[Dict[str, Optional[float]]]] = None
    ) -> AnomalyResult:
        """
        Calculates anomaly score, risk level, confidence, and prediction horizon.
        Handles nodes with partial sensor suites (e.g. ESP32 tilt + vib + soil without AE/crack).
        """
        # Extract available signals (None represents unmeasured hardware sensor)
        tilt_raw = current_reading.get("tilt")
        vib_raw = current_reading.get("vibration")
        soil_raw = current_reading.get("soilMoisture") if current_reading.get("soilMoisture") is not None else current_reading.get("soil_moisture")
        ae_raw = current_reading.get("ae")
        disp_raw = current_reading.get("displacement")
        crack_raw = current_reading.get("crack")

        active_features = {}

        if tilt_raw is not None:
            tilt = abs(float(tilt_raw))
            active_features["tilt"] = min(1.0, tilt / 10.0)
        else:
            tilt = 0.0

        if vib_raw is not None:
            vib = abs(float(vib_raw))
            # If vibration is a binary 0/1 sensor flag, map 1 -> 0.70 normalized risk
            if vib <= 1.0 and isinstance(vib_raw, int):
                active_features["vibration"] = 0.70 if vib == 1 else 0.05
            else:
                active_features["vibration"] = min(1.0, vib / 3.0)
        else:
            vib = 0.0

        if soil_raw is not None:
            soil = max(0.0, min(100.0, float(soil_raw)))
            active_features["soil_moisture"] = min(1.0, soil / 90.0)

        if ae_raw is not None:
            ae = abs(float(ae_raw))
            active_features["ae"] = min(1.0, ae / 160.0)
        else:
            ae = 0.0

        if disp_raw is not None:
            disp = abs(float(disp_raw))
            active_features["displacement"] = min(1.0, disp / 50.0)
        else:
            disp = 0.0

        if crack_raw is not None:
            crack = abs(float(crack_raw))
            active_features["crack"] = min(1.0, crack / 3.0)
        else:
            crack = 0.0

        # Dynamic re-normalization of weights across available signals:
        # If hardware only provides tilt, vibration, and soil moisture, weights are re-scaled to sum to 1.0
        # so that missing AE/displacement sensors do not silently zero out or dilute the calculation.
        if active_features:
            total_active_weight = sum(self.feature_weights[k] for k in active_features)
            weighted_sum = sum(active_features[k] * (self.feature_weights[k] / total_active_weight) for k in active_features)
            raw_score = weighted_sum
        else:
            raw_score = 0.0

        # Rate-of-change bonus if history is available
        rate_bonus = 0.0
        if history and len(history) >= 2:
            prev = history[-1]
            prev_tilt = prev.get("tilt")
            if tilt_raw is not None and prev_tilt is not None:
                dtilt = abs(tilt) - abs(float(prev_tilt))
                if dtilt > 0.4:
                    rate_bonus = 0.10

        anomaly_score = float(np.clip(raw_score + rate_bonus, 0.05, 0.98))
        anomaly_score = round(anomaly_score, 2)

        # Confidence calculation:
        # Scaled by the fraction of monitored parameters available.
        # Nodes with 3 signals (e.g. ESP32 tilt+vib+soil) have a base confidence range of 62-76%
        # whereas a fully instrumented 6-sensor node achieves 90-96% confidence.
        instrumentation_ratio = len(active_features) / len(self.feature_weights)
        base_conf = 50.0 + (instrumentation_ratio * 42.0)
        confidence = round(float(np.clip(base_conf + np.random.uniform(-2.0, 3.0), 45.0, 96.0)), 1)

        # Determine Risk Level & Days to Potential Strata/Pillar Failure
        reasons = []
        if tilt >= self.tilt_critical:
            reasons.append(f"Critical tilt ({tilt:.2f}°)")
        if ae >= self.ae_critical:
            reasons.append(f"Critical AE ({int(ae)}/min)")
        if disp >= self.disp_critical:
            reasons.append(f"Severe displacement ({disp:.1f}mm)")
        if vib_raw is not None and vib_raw >= 1 and tilt >= self.tilt_warning:
            reasons.append(f"Vibration shock detected with tilt ({tilt:.2f}°)")

        if anomaly_score >= 0.70 or tilt >= self.tilt_critical or (ae_raw is not None and ae >= self.ae_critical):
            risk_level = "HIGH"
            prediction_days = max(1, min(6, int(round((1.0 - anomaly_score) * 15) + 1)))
            is_anomaly = True
            trigger_reason = " & ".join(reasons) if reasons else "Geotechnical risk threshold exceeded"
        elif anomaly_score >= 0.35 or tilt >= self.tilt_warning or (ae_raw is not None and ae >= self.ae_warning):
            risk_level = "MEDIUM"
            prediction_days = max(7, min(21, int(round((1.0 - anomaly_score) * 30))))
            is_anomaly = True
            trigger_reason = f"Moderate deformation trend (Tilt {tilt:.2f}°)" if not reasons else " & ".join(reasons)
        else:
            risk_level = "LOW"
            prediction_days = max(25, min(45, int(round((1.0 - anomaly_score) * 35))))
            is_anomaly = False
            trigger_reason = None

        return AnomalyResult(
            anomaly_score=anomaly_score,
            confidence=confidence,
            prediction_days=prediction_days,
            risk_level=risk_level,
            is_anomaly=is_anomaly,
            trigger_reason=trigger_reason
        )

anomaly_detector = GeotechnicalAnomalyDetector()
