from abc import ABC, abstractmethod
from typing import Any
import pandas as pd


class BaseMLProcessor(ABC):
    module_name: str = "base"
    required_columns: list[str] = []

    def validate(self, df: pd.DataFrame) -> None:
        missing = [c for c in self.required_columns if c not in df.columns]
        if missing:
            raise ValueError(f"Missing required columns: {', '.join(missing)}")
        if df.empty:
            raise ValueError("Dataset is empty")

    @abstractmethod
    def run(self, df: pd.DataFrame, options: dict | None = None) -> dict[str, Any]:
        pass

    def execute(self, rows: list[dict], options: dict | None = None) -> dict[str, Any]:
        df = pd.DataFrame(rows)
        self.validate(df)
        result = self.run(df, options or {})
        return {
            "module": self.module_name,
            "success": True,
            "row_count": len(df),
            **result,
        }
