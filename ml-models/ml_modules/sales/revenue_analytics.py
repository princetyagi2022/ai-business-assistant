import pandas as pd
from ml_modules.base_processor import BaseMLProcessor


class RevenueAnalyticsProcessor(BaseMLProcessor):
    module_name = "sales"
    required_columns = ["amount"]

    def run(self, df: pd.DataFrame, options: dict | None = None) -> dict:
        df = df.copy()
        total_revenue = float(df["amount"].sum())
        order_count = len(df)
        avg_order = total_revenue / order_count if order_count else 0

        by_product = []
        if "product_sku" in df.columns:
            by_product = df.groupby("product_sku")["amount"].sum().reset_index().to_dict(orient="records")

        monthly_trend = []
        if "date" in df.columns:
            df["date"] = pd.to_datetime(df["date"])
            monthly = df.groupby(df["date"].dt.to_period("M"))["amount"].sum()
            monthly_trend = [{"month": str(k), "revenue": round(float(v), 2)} for k, v in monthly.items()]

        return {
            "operation": "revenue_report",
            "summary": {
                "total_revenue": round(total_revenue, 2),
                "order_count": order_count,
                "avg_order_value": round(avg_order, 2),
            },
            "rows": by_product or df.head(100).to_dict(orient="records"),
            "chart_data": monthly_trend,
        }
