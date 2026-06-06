import pandas as pd
from sklearn.ensemble import IsolationForest
from ml_modules.base_processor import BaseMLProcessor


class FraudDetectionProcessor(BaseMLProcessor):
    module_name = "fraud"
    required_columns = ["amount"]

    def run(self, df: pd.DataFrame, options: dict | None = None) -> dict:
        options = options or {}
        contamination = float(options.get("contamination", 0.05))

        df = df.copy()
        features = ["amount"]
        if "quantity" in df.columns:
            features.append("quantity")

        X = df[features].fillna(0)

        model = IsolationForest(contamination=contamination, random_state=42)
        preds = model.fit_predict(X)

        df["fraud_flag"] = preds == -1
        df["fraud_score"] = model.decision_function(X)

        flagged = df[df["fraud_flag"]].sort_values("fraud_score")

        return {
            "operation": "fraud_detection",
            "summary": {
                "total_transactions": len(df),
                "fraud_alerts": int(df["fraud_flag"].sum()),
                "fraud_rate_pct": round(float(df["fraud_flag"].mean() * 100), 2),
            },
            "rows": flagged.to_dict(orient="records"),
        }
