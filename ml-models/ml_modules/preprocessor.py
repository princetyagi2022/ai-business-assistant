import pandas as pd


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = df.columns.str.strip().str.lower().str.replace(r"\s+", "_", regex=True)
    return df


def clean_numeric(df: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    df = df.copy()
    for col in columns:
        if col in df.columns:
            df[col] = pd.to_numeric(
                df[col].astype(str).str.replace(",", "").str.replace("$", ""),
                errors="coerce",
            )
    return df


def clean_dates(df: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    df = df.copy()
    for col in columns:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce")
    return df


def preprocess_dataset(rows: list[dict], module: str) -> pd.DataFrame:
    df = normalize_columns(pd.DataFrame(rows))

    numeric_map = {
        "sales": ["amount", "quantity", "price"],
        "finance": ["amount", "revenue", "expense"],
        "inventory": ["quantity", "reorder_level", "price"],
        "customers": ["total_spent", "order_count"],
        "marketing": ["budget", "clicks", "conversions", "revenue"],
        "fraud": ["amount", "quantity"],
    }

    date_map = {
        "sales": ["date"],
        "finance": ["date"],
        "marketing": ["start_date", "end_date"],
    }

    if module in numeric_map:
        df = clean_numeric(df, numeric_map[module])
    if module in date_map:
        df = clean_dates(df, date_map[module])

    return df.dropna(how="all")
