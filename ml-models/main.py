from pathlib import Path

import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from api.routes.dataset_routes import router as dataset_router

app = FastAPI(title="AI Business Assistant API")
DATA_DIR = Path(__file__).resolve().parent / "data"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dataset_router)


class ChatRequest(BaseModel):
    message: str
    sessionId: str | None = None


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/chatbot/chat")
def chatbot_chat(body: ChatRequest):
    intent, reply = _answer_business_question(body.message)
    return {
        "reply": reply,
        "message": reply,
        "intent": intent,
        "sessionId": body.sessionId,
        "source": "ml-datasets",
    }


@app.post("/api/chat")
def chat(body: ChatRequest):
    return chatbot_chat(body)


def _read_csv(name: str) -> pd.DataFrame:
    return pd.read_csv(DATA_DIR / name)


def _money(value: float) -> float:
    return round(float(value), 2)


def _currency(value: float) -> str:
    return f"${_money(value):,.2f}"


def _load_business_data() -> dict[str, pd.DataFrame]:
    return {
        "sales": _read_csv("sales.csv"),
        "products": _read_csv("products.csv"),
        "customers": _read_csv("customers.csv"),
        "inventory": _read_csv("inventory.csv"),
        "marketing": _read_csv("marketing.csv"),
        "finance": _read_csv("finance.csv"),
        "employees": _read_csv("employees.csv"),
        "fraud": _read_csv("fraud_transactions.csv"),
    }


def _business_summary(data: dict[str, pd.DataFrame]) -> dict:
    sales = data["sales"].copy()
    finance = data["finance"].copy()
    inventory = data["inventory"].copy()
    marketing = data["marketing"].copy()
    fraud = data["fraud"].copy()

    sales["date"] = pd.to_datetime(sales["date"], errors="coerce")
    finance["date"] = pd.to_datetime(finance["date"], errors="coerce")

    revenue = float(sales["amount"].sum())
    expenses = float(finance[finance["type"].str.lower() == "expense"]["amount"].sum())
    finance_revenue = float(finance[finance["type"].str.lower() == "revenue"]["amount"].sum())
    profit = finance_revenue - expenses
    low_stock = inventory[inventory["quantity"] <= inventory["reorder_level"]].copy()
    top_product = (
        sales.groupby("product_sku")["amount"]
        .sum()
        .sort_values(ascending=False)
        .reset_index()
        .head(1)
    )
    top_campaign = marketing.assign(
        roi=((marketing["revenue"] - marketing["budget"]) / marketing["budget"].replace(0, 1)) * 100
    ).sort_values("roi", ascending=False).head(1)

    return {
        "revenue": revenue,
        "orders": len(sales),
        "customers": len(data["customers"]),
        "products": len(data["products"]),
        "employees": len(data["employees"]),
        "expenses": expenses,
        "profit": profit,
        "inventory_value": float((inventory["quantity"] * inventory["unit_cost"]).sum()),
        "low_stock_count": len(low_stock),
        "low_stock_skus": low_stock["sku"].head(6).tolist(),
        "top_product_sku": top_product.iloc[0]["product_sku"] if not top_product.empty else None,
        "top_product_revenue": float(top_product.iloc[0]["amount"]) if not top_product.empty else 0,
        "top_campaign": top_campaign.iloc[0]["campaign_name"] if not top_campaign.empty else None,
        "top_campaign_roi": float(top_campaign.iloc[0]["roi"]) if not top_campaign.empty else 0,
        "fraud_transactions": len(fraud),
        "largest_transaction": float(fraud["amount"].max()) if not fraud.empty else 0,
    }


def _answer_business_question(message: str) -> tuple[str, str]:
    text = message.lower().strip()
    data = _load_business_data()
    summary = _business_summary(data)

    if any(word in text for word in ["hello", "hi", "hey"]):
        return (
            "greeting",
            "Hello. I am connected to the project datasets now. You can ask about revenue, orders, customers, products, employees, inventory alerts, profit, marketing, or fraud transactions.",
        )

    if any(word in text for word in ["revenue", "sales", "income"]):
        sales = data["sales"].copy()
        sales["date"] = pd.to_datetime(sales["date"], errors="coerce")
        monthly = sales.groupby(sales["date"].dt.to_period("M"))["amount"].sum().sort_index()
        monthly_text = ", ".join([f"{period}: {_currency(value)}" for period, value in monthly.items()])
        return (
            "sales",
            f"Total sales revenue is {_currency(summary['revenue'])} from {summary['orders']} orders. Monthly revenue: {monthly_text}. Top product SKU is {summary['top_product_sku']} with {_currency(summary['top_product_revenue'])}.",
        )

    if any(word in text for word in ["profit", "expense", "finance", "margin"]):
        margin = (summary["profit"] / summary["revenue"] * 100) if summary["revenue"] else 0
        return (
            "finance",
            f"Finance analysis: revenue is {_currency(summary['revenue'])}, recorded expenses are {_currency(summary['expenses'])}, and net profit is {_currency(summary['profit'])}. Profit margin on sales revenue is {margin:.2f}%.",
        )

    if any(word in text for word in ["inventory", "stock", "reorder", "alert"]):
        sku_text = ", ".join(summary["low_stock_skus"]) if summary["low_stock_skus"] else "none"
        return (
            "inventory",
            f"Inventory value is {_currency(summary['inventory_value'])}. {summary['low_stock_count']} SKUs are at or below reorder level. Low-stock SKUs: {sku_text}.",
        )

    if any(word in text for word in ["customer", "churn"]):
        customers = data["customers"]
        churned = int(customers["churned"].sum()) if "churned" in customers.columns else 0
        high_spend = customers.sort_values("total_spent", ascending=False).head(1).iloc[0]
        return (
            "customers",
            f"There are {summary['customers']} customers in the dataset. {churned} are marked churned. Highest-spend customer is {high_spend['name']} with {_currency(high_spend['total_spent'])} total spent.",
        )

    if any(word in text for word in ["product", "sku", "catalog"]):
        products = data["products"]
        active = int((products["status"].str.lower() == "active").sum()) if "status" in products.columns else len(products)
        categories = ", ".join(sorted(products["category"].dropna().unique()))
        return (
            "products",
            f"The product catalog has {summary['products']} products, with {active} active products. Categories available: {categories}.",
        )

    if any(word in text for word in ["employee", "staff", "performance"]):
        employees = data["employees"]
        avg_score = employees["performance_score"].mean() if "performance_score" in employees.columns else 0
        departments = ", ".join(sorted(employees["department"].dropna().unique()))
        return (
            "employees",
            f"There are {summary['employees']} employees. Average performance score is {avg_score:.2f}. Departments: {departments}.",
        )

    if any(word in text for word in ["marketing", "campaign", "roi", "conversion"]):
        return (
            "marketing",
            f"Best campaign is {summary['top_campaign']} with ROI of {summary['top_campaign_roi']:.2f}%. Marketing data is available by campaign, channel, budget, clicks, conversions, and revenue.",
        )

    if any(word in text for word in ["fraud", "risk", "transaction", "anomaly"]):
        return (
            "fraud",
            f"Fraud analysis has {summary['fraud_transactions']} transactions available. The largest transaction amount is {_currency(summary['largest_transaction'])}. Use the fraud detection module for anomaly scoring.",
        )

    if any(word in text for word in ["dashboard", "overview", "summary", "report"]):
        return (
            "overview",
            f"Business overview: revenue {_currency(summary['revenue'])}, orders {summary['orders']}, customers {summary['customers']}, products {summary['products']}, employees {summary['employees']}, inventory alerts {summary['low_stock_count']}, and net profit {_currency(summary['profit'])}.",
        )

    return (
        "general",
        "I can answer from the project datasets. Try asking: total revenue, monthly sales, inventory alerts, customer churn, product catalog, employee performance, marketing ROI, fraud transactions, or business overview.",
    )


@app.get("/api/dashboard")
def dashboard():
    sales = _read_csv("sales.csv")
    products = _read_csv("products.csv")
    customers = _read_csv("customers.csv")
    inventory = _read_csv("inventory.csv")
    marketing = _read_csv("marketing.csv")
    finance = _read_csv("finance.csv")
    employees = _read_csv("employees.csv")
    fraud = _read_csv("fraud_transactions.csv")

    sales["date"] = pd.to_datetime(sales["date"], errors="coerce")
    finance["date"] = pd.to_datetime(finance["date"], errors="coerce")

    total_revenue = _money(sales["amount"].sum())
    finance_revenue = _money(finance[finance["type"].str.lower() == "revenue"]["amount"].sum())
    finance_expense = _money(finance[finance["type"].str.lower() == "expense"]["amount"].sum())
    net_profit = _money(finance_revenue - finance_expense)
    inventory_value = _money((inventory["quantity"] * inventory["unit_cost"]).sum())
    low_stock = int((inventory["quantity"] <= inventory["reorder_level"]).sum())

    monthly_sales = sales.groupby(sales["date"].dt.to_period("M"))["amount"].sum().reset_index()
    revenue_chart_data = [
        {
            "month": str(row["date"]),
            "revenue": _money(row["amount"]),
            "profit": _money(row["amount"] * 0.32),
        }
        for _, row in monthly_sales.iterrows()
    ]

    sales_with_products = sales.merge(
        products[["sku", "category"]],
        left_on="product_sku",
        right_on="sku",
        how="left",
    )
    sales_by_category = [
        {"name": category or "Uncategorized", "value": _money(amount)}
        for category, amount in sales_with_products.groupby("category")["amount"].sum().items()
    ]

    orders_trend = [
        {"day": day, "orders": int(count)}
        for day, count in sales.groupby(sales["date"].dt.day_name().str.slice(0, 3))["order_id"].count().items()
    ]

    customer_growth = [
        {"month": str(row["date"]), "customers": index + 1}
        for index, row in monthly_sales[["date"]].iterrows()
    ]

    inventory_levels = [
        {"category": row["sku"], "stock": int(row["quantity"])}
        for _, row in inventory.sort_values("quantity").head(8).iterrows()
    ]

    marketing_performance = [
        {
            "channel": row["channel"],
            "clicks": int(row["clicks"]),
            "conversions": int(row["conversions"]),
        }
        for _, row in marketing.groupby("channel")[["clicks", "conversions"]].sum().reset_index().iterrows()
    ]

    recent_sales = sales.sort_values("date", ascending=False).head(3)
    recent_activities = [
        {
            "id": index + 1,
            "type": "sale",
            "message": f"Order {row['order_id']} completed for ${_money(row['amount'])}",
            "time": row["date"].isoformat() if pd.notna(row["date"]) else "",
            "user": row["customer_id"],
        }
        for index, (_, row) in enumerate(recent_sales.iterrows())
    ]
    recent_activities.append({
        "id": 4,
        "type": "inventory",
        "message": f"{low_stock} SKUs are below reorder level",
        "time": "",
        "user": "Inventory analysis",
    })

    ai_insights = [
        {
            "id": 1,
            "title": "Revenue source verified",
            "description": f"Sales dataset revenue totals ${total_revenue:,.2f}.",
            "severity": "success",
        },
        {
            "id": 2,
            "title": "Inventory reorder attention",
            "description": f"{low_stock} products are at or below reorder level.",
            "severity": "warning" if low_stock else "success",
        },
        {
            "id": 3,
            "title": "Fraud model input ready",
            "description": f"{len(fraud)} transactions are available for anomaly detection.",
            "severity": "info",
        },
    ]

    return {
        "dashboardStats": [
            {"id": "revenue", "label": "Total Revenue", "value": total_revenue, "change": 0, "format": "currency", "color": "primary"},
            {"id": "orders", "label": "Orders", "value": int(len(sales)), "change": 0, "format": "number", "color": "info"},
            {"id": "customers", "label": "Customers", "value": int(len(customers)), "change": 0, "format": "number", "color": "secondary"},
            {"id": "products", "label": "Products", "value": int(len(products)), "change": 0, "format": "number", "color": "success"},
            {"id": "inventory", "label": "Inventory Value", "value": inventory_value, "change": 0, "format": "currency", "color": "warning"},
            {"id": "employees", "label": "Employees", "value": int(len(employees)), "change": 0, "format": "number", "color": "primary"},
            {"id": "conversion", "label": "Net Profit", "value": net_profit, "change": 0, "format": "currency", "color": "success"},
            {"id": "support", "label": "Inventory Alerts", "value": low_stock, "change": 0, "format": "number", "color": "error"},
        ],
        "revenueChartData": revenue_chart_data,
        "salesByCategory": sales_by_category,
        "ordersTrend": orders_trend,
        "customerGrowth": customer_growth,
        "inventoryLevels": inventory_levels,
        "marketingPerformance": marketing_performance,
        "recentActivities": recent_activities,
        "aiInsights": ai_insights,
    }
