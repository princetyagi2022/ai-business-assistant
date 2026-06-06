import pandas as pd
from ml_modules.base_processor import BaseMLProcessor


class ReorderSuggestionsProcessor(BaseMLProcessor):
    module_name = "inventory"
    required_columns = ["sku", "quantity"]

    def run(self, df: pd.DataFrame, options: dict | None = None) -> dict:
        options = options or {}
        target_stock = int(options.get("target_stock", 100))

        df = df.copy()
        if "reorder_level" not in df.columns:
            df["reorder_level"] = 20

        df["suggested_reorder_qty"] = (target_stock - df["quantity"]).clip(lower=0)
        suggestions = df[df["suggested_reorder_qty"] > 0]

        return {
            "operation": "reorder_suggestions",
            "summary": {
                "items_to_reorder": len(suggestions),
                "total_units": int(suggestions["suggested_reorder_qty"].sum()),
            },
            "rows": suggestions.to_dict(orient="records"),
        }
