from pathlib import Path
from typing import Any

import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ml_modules.preprocessor import preprocess_dataset
from ml_modules.registry import ML_REGISTRY, get_processor

router = APIRouter(prefix="/api/datasets", tags=["datasets"])

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
DATASET_CONFIG = {
    "sales": {"file": "sales.csv", "label": "Sales", "default_operation": "forecast"},
    "finance": {"file": "finance.csv", "label": "Finance", "default_operation": "profit_analysis"},
    "inventory": {"file": "inventory.csv", "label": "Inventory", "default_operation": "low_stock_alerts"},
    "customers": {"file": "customers.csv", "label": "Customers", "default_operation": "segment_analysis"},
    "marketing": {"file": "marketing.csv", "label": "Marketing", "default_operation": "campaign_analytics"},
    "fraud": {"file": "fraud_transactions.csv", "label": "Fraud", "default_operation": "detect"},
    "analytics": {"file": "analytics_mixed.csv", "label": "Analytics", "default_operation": "kpi_dashboard"},
}


class DatasetOperationRequest(BaseModel):
    rows: list[dict]
    options: dict | None = None


def _read_dataset(module: str) -> pd.DataFrame:
    config = DATASET_CONFIG.get(module)
    if not config:
        raise ValueError(f"Unknown dataset module: {module}")

    dataset_path = DATA_DIR / config["file"]
    if not dataset_path.exists():
        raise ValueError(f"Dataset file not found: {config['file']}")

    return pd.read_csv(dataset_path)


def _records(df: pd.DataFrame) -> list[dict[str, Any]]:
    if df.empty:
        return []
    return df.where(pd.notnull(df), None).to_dict(orient="records")


def _split_dataset(df: pd.DataFrame, train_ratio: float = 0.8) -> tuple[pd.DataFrame, pd.DataFrame]:
    if df.empty:
        return df.copy(), df.copy()

    train = df.sample(frac=train_ratio, random_state=42).sort_index()
    test = df.drop(train.index).sort_index()
    return train, test


def _clean_for_json(value: Any) -> Any:
    if isinstance(value, dict):
        return {key: _clean_for_json(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_clean_for_json(item) for item in value]
    if isinstance(value, pd.Timestamp):
        return value.isoformat()
    try:
        if pd.isna(value):
            return None
    except TypeError:
        pass
    return value


def _dataset_response(module: str, operation: str | None = None, options: dict | None = None) -> dict:
    config = DATASET_CONFIG[module]
    df = _read_dataset(module)
    train, test = _split_dataset(df)
    selected_operation = operation or config["default_operation"]
    processor = get_processor(module, selected_operation)
    prepared = preprocess_dataset(df.to_dict(orient="records"), module)
    result = processor.execute(prepared.to_dict(orient="records"), options)

    return _clean_for_json({
        "module": module,
        "label": config["label"],
        "source_file": config["file"],
        "columns": list(df.columns),
        "operations": list(ML_REGISTRY.get(module, {}).keys()),
        "selected_operation": selected_operation,
        "split": {
            "train_ratio": 0.8,
            "train_count": len(train),
            "test_count": len(test),
            "total_count": len(df),
        },
        "data": {
            "all": _records(df),
            "train": _records(train),
            "test": _records(test),
        },
        "analysis": result,
    })


@router.get("/catalog")
def list_dataset_catalog():
    catalog = []
    for module, config in DATASET_CONFIG.items():
        df = _read_dataset(module)
        catalog.append({
            "module": module,
            "label": config["label"],
            "source_file": config["file"],
            "row_count": len(df),
            "columns": list(df.columns),
            "operations": list(ML_REGISTRY.get(module, {}).keys()),
            "default_operation": config["default_operation"],
        })
    return {"datasets": catalog}


@router.get("/{module}")
def get_dataset(module: str):
    try:
        return _dataset_response(module)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{module}/{operation}/sample")
def run_sample_dataset_operation(module: str, operation: str):
    try:
        return _dataset_response(module, operation)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{module}/{operation}")
def run_dataset_operation(module: str, operation: str, body: DatasetOperationRequest):
    try:
        df = preprocess_dataset(body.rows, module)
        processor = get_processor(module, operation)
        result = processor.execute(df.to_dict(orient="records"), body.options)
        return _clean_for_json(result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
