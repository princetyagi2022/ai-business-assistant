import pandas as pd
from ml_modules.base_processor import BaseMLProcessor


class CampaignAnalyticsProcessor(BaseMLProcessor):
    module_name = "marketing"
    required_columns = ["campaign_name", "budget"]

    def run(self, df: pd.DataFrame, options: dict | None = None) -> dict:
        df = df.copy()

        for col in ["clicks", "conversions", "revenue"]:
            if col not in df.columns:
                df[col] = 0

        df["roi"] = ((df["revenue"] - df["budget"]) / df["budget"].replace(0, 1)) * 100
        df["conversion_rate"] = (df["conversions"] / df["clicks"].replace(0, 1)) * 100

        top = df.sort_values("roi", ascending=False)

        return {
            "operation": "campaign_analytics",
            "summary": {
                "total_campaigns": len(df),
                "total_budget": round(float(df["budget"].sum()), 2),
                "total_revenue": round(float(df["revenue"].sum()), 2),
                "avg_roi_pct": round(float(df["roi"].mean()), 2),
            },
            "rows": top.to_dict(orient="records"),
            "chart_data": top[["campaign_name", "roi"]].to_dict(orient="records"),
        }
