package com.ai.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * DTO for Dashboard Statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalUsers;
    private Long totalCustomers;
    private BigDecimal monthlyProfit;
    private BigDecimal predictedSales;
    private Long inventoryAlerts;
    private List<Map<String, Object>> revenueTrend;
    private List<Map<String, Object>> profitTrend;
    private List<Map<String, Object>> customerGrowth;
    private List<Map<String, Object>> productPerformance;
}
