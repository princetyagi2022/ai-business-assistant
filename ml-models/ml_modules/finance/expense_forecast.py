import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from ml_modules.base_processor import BaseMLProcessor


class ExpenseForecastProcessor(BaseMLProcessor):
    module_name = "finance"
    required_columns = ["date", "amount", "type"]

    def run(self, df: pd.DataFrame, options: dict | None = None) -> dict:
        options = options or {}
        periods = int(options.get("forecast_periods", 3))

        df = df.copy()
        df["date"] = pd.to_datetime(df["date"])
        expenses = df[df["type"].str.lower() == "expense"]

        monthly = expenses.groupby(expenses["date"].dt.to_period("M"))["amount"].sum().reset_index()
        monthly["date"] = monthly["date"].dt.to_timestamp()

        X = np.arange(len(monthly)).reshape(-1, 1)
        y = monthly["amount"].values

        model = LinearRegression()
        model.fit(X, y)

        future = model.predict(np.arange(len(monthly), len(monthly) + periods).reshape(-1, 1))

        return {
            "operation": "expense_forecast",
            "summary": {
                "avg_monthly_expense": round(float(y.mean()), 2) if len(y) else 0,
                "forecast_total": round(float(future.sum()), 2),
            },
            "rows": [
                {"period": f"month_{i+1}", "predicted_expense": round(float(v), 2)}
                for i, v in enumerate(future)
            ],
        }
