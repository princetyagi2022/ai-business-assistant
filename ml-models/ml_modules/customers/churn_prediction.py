import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from ml_modules.base_processor import BaseMLProcessor


class ChurnPredictionProcessor(BaseMLProcessor):
    module_name = "customers"
    required_columns = ["email"]

    def run(self, df: pd.DataFrame, options: dict | None = None) -> dict:
        df = df.copy()

        for col, default in [("days_since_last_order", 30), ("order_count", 1), ("total_spent", 0)]:
            if col not in df.columns:
                df[col] = default

        df["churn_risk_score"] = (
            (df["days_since_last_order"] / 100) * 0.5
            + (1 / (df["order_count"] + 1)) * 0.3
            + (1 / (df["total_spent"] + 1)) * 0.2
        ).clip(0, 1)

        df["churn_risk"] = pd.cut(
            df["churn_risk_score"],
            bins=[0, 0.4, 0.7, 1.0],
            labels=["low", "medium", "high"],
        )

        if "churned" in df.columns and df["churned"].nunique() > 1:
            features = df[["days_since_last_order", "order_count", "total_spent"]]
            model = RandomForestClassifier(n_estimators=50, random_state=42)
            model.fit(features, df["churned"])
            df["churn_probability"] = model.predict_proba(features)[:, 1]
        else:
            df["churn_probability"] = df["churn_risk_score"]

        high_risk = df[df["churn_risk"] == "high"]

        return {
            "operation": "churn_prediction",
            "summary": {
                "total_customers": len(df),
                "high_risk_count": len(high_risk),
            },
            "rows": df.to_dict(orient="records"),
        }
