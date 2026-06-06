import { useEffect, useState } from "react";
import { Grid, CircularProgress, Alert } from "@mui/material";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import BadgeIcon from "@mui/icons-material/Badge";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import ChartCard from "@/components/common/ChartCard";

import RevenueChart from "@/components/charts/RevenueChart";
import SalesCategoryChart from "@/components/charts/SalesCategoryChart";
import OrdersTrendChart from "@/components/charts/OrdersTrendChart";
import CustomerGrowthChart from "@/components/charts/CustomerGrowthChart";
import InventoryChart from "@/components/charts/InventoryChart";
import MarketingChart from "@/components/charts/MarketingChart";

import RecentActivities from "@/components/dashboard/RecentActivities";
import AIInsights from "@/components/dashboard/AIInsights";
import QuickActions from "@/components/dashboard/QuickActions";

import { getDashboardData } from "@/services/dashboardService";

const statIcons = {
    revenue: AttachMoneyIcon,
    orders: ShoppingCartIcon,
    customers: PeopleIcon,
    products: InventoryIcon,
    inventory: WarehouseIcon,
    employees: BadgeIcon,
    conversion: TrendingUpIcon,
    support: SupportAgentIcon,
};

const Dashboard = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dashboardData, setDashboardData] = useState({
        dashboardStats: [],
        revenueChartData: [],
        salesByCategory: [],
        ordersTrend: [],
        customerGrowth: [],
        inventoryLevels: [],
        marketingPerformance: [],
        recentActivities: [],
        aiInsights: []
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {

            const data = await getDashboardData();

            setDashboardData(data);

        } catch (err) {

            console.error(err);

            setError("Failed to load dashboard data");

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <>
            <PageHeader
                title="Dashboard"
                subtitle="Business overview and AI-powered insights"
            />

            <Grid container spacing={2}>

                {dashboardData.dashboardStats.map((stat) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.id}>
                        <StatCard
                            {...stat}
                            icon={statIcons[stat.id]}
                        />
                    </Grid>
                ))}

                <Grid item xs={12} lg={8}>
                    <ChartCard
                        title="Revenue & Profit"
                        subheader="Last 6 Months"
                    >
                        <RevenueChart
                            data={dashboardData.revenueChartData}
                        />
                    </ChartCard>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <ChartCard title="Sales by Category">
                        <SalesCategoryChart
                            data={dashboardData.salesByCategory}
                        />
                    </ChartCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <ChartCard title="Orders This Week">
                        <OrdersTrendChart
                            data={dashboardData.ordersTrend}
                        />
                    </ChartCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <ChartCard title="Customer Growth">
                        <CustomerGrowthChart
                            data={dashboardData.customerGrowth}
                        />
                    </ChartCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <ChartCard title="Inventory Levels">
                        <InventoryChart
                            data={dashboardData.inventoryLevels}
                        />
                    </ChartCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <ChartCard title="Marketing Performance">
                        <MarketingChart
                            data={dashboardData.marketingPerformance}
                        />
                    </ChartCard>
                </Grid>

                <Grid item xs={12} md={4}>
                    <RecentActivities
                        activities={dashboardData.recentActivities}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <AIInsights
                        insights={dashboardData.aiInsights}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <QuickActions />
                </Grid>

            </Grid>
        </>
    );
};

export default Dashboard;

