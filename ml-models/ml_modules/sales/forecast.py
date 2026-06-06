import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from ml_modules.base_processor import BaseMLProcessor


class SalesForecastProcessor(BaseMLProcessor):
    module_name = "sales"
    required_columns = ["date", "amount"]

    def run(self, df: pd.DataFrame, options: dict | None = None) -> dict:
        options = options or {}
        periods = int(options.get("forecast_periods", 6))

        df = df.copy()
        df["date"] = pd.to_datetime(df["date"])
        monthly = df.groupby(df["date"].dt.to_period("M"))["amount"].sum().reset_index()
        monthly["date"] = monthly["date"].dt.to_timestamp()
        monthly = monthly.sort_values("date")

        X = np.arange(len(monthly)).reshape(-1, 1)
        y = monthly["amount"].values

        model = LinearRegression()
        model.fit(X, y)

        future_X = np.arange(len(monthly), len(monthly) + periods).reshape(-1, 1)
        predictions = model.predict(future_X)

        last_date = monthly["date"].max()
        forecast_dates = pd.date_range(
            start=last_date + pd.offsets.MonthBegin(1),
            periods=periods,
            freq="MS",
        )

        forecast_rows = [
            {"month": d.strftime("%Y-%m"), "predicted_sales": round(float(p), 2), "type": "forecast"}
            for d, p in zip(forecast_dates, predictions)
        ]
        historical_rows = [
            {"month": row["date"].strftime("%Y-%m"), "predicted_sales": round(float(row["amount"]), 2), "type": "historical"}
            for _, row in monthly.iterrows()
        ]

        return {
            "operation": "forecast",
            "summary": {
                "total_historical_revenue": round(float(y.sum()), 2),
                "avg_monthly_revenue": round(float(y.mean()), 2),
                "next_month_prediction": round(float(predictions[0]), 2),
                "trend": "up" if model.coef_[0] > 0 else "down",
            },
            "rows": historical_rows + forecast_rows,
            "chart_data": historical_rows + forecast_rows,
        }
