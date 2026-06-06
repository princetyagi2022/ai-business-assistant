import pandas as pd
from ml_modules.base_processor import BaseMLProcessor


class ProfitAnalysisProcessor(BaseMLProcessor):
    module_name = "finance"
    required_columns = ["amount", "type"]

    def run(self, df: pd.DataFrame, options: dict | None = None) -> dict:
        df = df.copy()
        df["type"] = df["type"].str.lower()

        revenue = float(df[df["type"] == "revenue"]["amount"].sum())
        expense = float(df[df["type"] == "expense"]["amount"].sum())
        profit = revenue - expense
        margin = (profit / revenue * 100) if revenue else 0

        by_category = []
        if "category" in df.columns:
            by_category = df.groupby(["category", "type"])["amount"].sum().reset_index().to_dict(orient="records")

        return {
            "operation": "profit_analysis",
            "summary": {
                "total_revenue": round(revenue, 2),
                "total_expense": round(expense, 2),
                "net_profit": round(profit, 2),
                "profit_margin_pct": round(margin, 2),
            },
            "rows": by_category,
            "chart_data": [
                {"label": "Revenue", "value": round(revenue, 2)},
                {"label": "Expense", "value": round(expense, 2)},
                {"label": "Profit", "value": round(profit, 2)},
            ],
        }
