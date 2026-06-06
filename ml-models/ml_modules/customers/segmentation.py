import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from ml_modules.base_processor import BaseMLProcessor


class CustomerSegmentationProcessor(BaseMLProcessor):
    module_name = "customers"
    required_columns = ["email"]

    def run(self, df: pd.DataFrame, options: dict | None = None) -> dict:
        options = options or {}
        n_clusters = int(options.get("clusters", 3))

        df = df.copy()
        if "total_spent" not in df.columns:
            df["total_spent"] = 0
        if "order_count" not in df.columns:
            df["order_count"] = 1

        features = df[["total_spent", "order_count"]].fillna(0)
        scaler = StandardScaler()
        scaled = scaler.fit_transform(features)

        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        df["segment"] = kmeans.fit_predict(scaled)

        segment_labels = {0: "Low Value", 1: "Mid Value", 2: "High Value"}
        df["segment_label"] = df["segment"].map(segment_labels).fillna("Other")

        summary = (
            df.groupby("segment_label")
            .agg(customers=("email", "count"), avg_spent=("total_spent", "mean"))
            .reset_index()
            .to_dict(orient="records")
        )

        return {
            "operation": "segment_analysis",
            "summary": {"segments": summary},
            "rows": df.to_dict(orient="records"),
        }
