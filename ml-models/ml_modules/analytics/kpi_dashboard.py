import pandas as pd
from ml_modules.base_processor import BaseMLProcessor


class KPIDashboardProcessor(BaseMLProcessor):
    module_name = "analytics"
    required_columns = []

    def run(self, df: pd.DataFrame, options: dict | None = None) -> dict:
        df = df.copy()
        kpis = {}

        if "amount" in df.columns:
            kpis["total_amount"] = round(float(df["amount"].sum()), 2)
        if "revenue" in df.columns:
            kpis["total_revenue"] = round(float(df["revenue"].sum()), 2)
        if "quantity" in df.columns:
            kpis["total_quantity"] = int(df["quantity"].sum())

        kpis["record_count"] = len(df)

        return {
            "operation": "kpi_dashboard",
            "summary": kpis,
            "rows": [kpis],
        }
