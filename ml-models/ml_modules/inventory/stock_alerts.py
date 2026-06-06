import pandas as pd
from ml_modules.base_processor import BaseMLProcessor


class StockAlertsProcessor(BaseMLProcessor):
    module_name = "inventory"
    required_columns = ["sku", "quantity"]

    def run(self, df: pd.DataFrame, options: dict | None = None) -> dict:
        options = options or {}
        default_threshold = int(options.get("threshold", 10))

        df = df.copy()
        if "reorder_level" not in df.columns:
            df["reorder_level"] = default_threshold

        alerts = df[df["quantity"] <= df["reorder_level"]].copy()
        alerts["alert_level"] = alerts.apply(
            lambda r: "critical" if r["quantity"] <= r["reorder_level"] * 0.5 else "warning",
            axis=1,
        )

        return {
            "operation": "low_stock_alerts",
            "summary": {
                "total_skus": len(df),
                "alert_count": len(alerts),
                "critical_count": int((alerts["alert_level"] == "critical").sum()),
            },
            "rows": alerts.to_dict(orient="records"),
        }
