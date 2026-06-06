from ml_modules.sales.forecast import SalesForecastProcessor
from ml_modules.sales.revenue_analytics import RevenueAnalyticsProcessor
from ml_modules.finance.profit_analysis import ProfitAnalysisProcessor
from ml_modules.finance.expense_forecast import ExpenseForecastProcessor
from ml_modules.inventory.stock_alerts import StockAlertsProcessor
from ml_modules.inventory.reorder_suggestions import ReorderSuggestionsProcessor
from ml_modules.customers.segmentation import CustomerSegmentationProcessor
from ml_modules.customers.churn_prediction import ChurnPredictionProcessor
from ml_modules.marketing.campaign_analytics import CampaignAnalyticsProcessor
from ml_modules.fraud.fraud_detection import FraudDetectionProcessor
from ml_modules.analytics.kpi_dashboard import KPIDashboardProcessor

ML_REGISTRY: dict[str, dict[str, type]] = {
    "sales": {
        "forecast": SalesForecastProcessor,
        "revenue_report": RevenueAnalyticsProcessor,
        "ai_insights": RevenueAnalyticsProcessor,
    },
    "finance": {
        "profit_analysis": ProfitAnalysisProcessor,
        "expense_report": ExpenseForecastProcessor,
        "revenue_forecast": ExpenseForecastProcessor,
    },
    "inventory": {
        "low_stock_alerts": StockAlertsProcessor,
        "reorder_suggestions": ReorderSuggestionsProcessor,
        "inventory_sync": StockAlertsProcessor,
    },
    "customers": {
        "segment_analysis": CustomerSegmentationProcessor,
        "churn_prediction": ChurnPredictionProcessor,
    },
    "marketing": {
        "campaign_analytics": CampaignAnalyticsProcessor,
    },
    "fraud": {
        "detect": FraudDetectionProcessor,
    },
    "analytics": {
        "kpi_dashboard": KPIDashboardProcessor,
    },
}


def get_processor(module: str, operation: str):
    if module not in ML_REGISTRY:
        raise ValueError(f"Unknown module: {module}")
    if operation not in ML_REGISTRY[module]:
        raise ValueError(f"Unknown operation '{operation}' for module '{module}'")
    return ML_REGISTRY[module][operation]()
