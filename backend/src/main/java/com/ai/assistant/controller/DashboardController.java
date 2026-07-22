package com.ai.assistant.controller;

import com.ai.assistant.dto.ApiResponse;
import com.ai.assistant.repository.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class DashboardController {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final SaleRepository saleRepository;
    private final InventoryRepository inventoryRepository;
    private final EmployeeRepository employeeRepository;
    private final MarketingCampaignRepository marketingCampaignRepository;
    private final PaymentRepository paymentRepository;

    public DashboardController(
            UserRepository userRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            SaleRepository saleRepository,
            InventoryRepository inventoryRepository,
            EmployeeRepository employeeRepository,
            MarketingCampaignRepository marketingCampaignRepository,
            PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.saleRepository = saleRepository;
        this.inventoryRepository = inventoryRepository;
        this.employeeRepository = employeeRepository;
        this.marketingCampaignRepository = marketingCampaignRepository;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/dashboard")
    public ApiResponse<Map<String, Object>> dashboard() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByEnabledTrue();
        long totalCustomers = customerRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalEmployees = employeeRepository.count();
        long lowStock = inventoryRepository.findAll().stream()
                .filter(i -> i.getQuantityInStock() <= i.getReorderLevel())
                .count();

        BigDecimal totalRevenue = saleRepository.findAll().stream()
                .map(s -> s.getTotalAmount() != null ? s.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalProfit = saleRepository.findAll().stream()
                .map(s -> s.getProfit() != null ? s.getProfit() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long successfulPayments = paymentRepository.countByStatus("SUCCESS");

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalProfit", totalProfit);
        stats.put("totalEmployees", totalEmployees);
        stats.put("lowStockItems", lowStock);
        stats.put("successfulPayments", successfulPayments);

        // Recent orders
        List<Map<String, Object>> recentOrders = orderRepository.findAll().stream()
                .sorted((a, b) -> b.getOrderDate().compareTo(a.getOrderDate()))
                .limit(5)
                .map(o -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", o.getId());
                    row.put("orderNumber", o.getOrderNumber());
                    row.put("customer", o.getCustomer().getFirstName() + " " + o.getCustomer().getLastName());
                    row.put("totalAmount", o.getTotalAmount());
                    row.put("status", o.getStatus());
                    row.put("orderDate", o.getOrderDate());
                    return row;
                })
                .toList();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("stats", stats);
        result.put("recentOrders", recentOrders);
        return ApiResponse.success(result);
    }

    @GetMapping("/dashboard/export-users")
    public ApiResponse<Map<String, Object>> exportUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .map(u -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", u.getId());
                    row.put("firstName", u.getFirstName());
                    row.put("lastName", u.getLastName());
                    row.put("email", u.getEmail());
                    row.put("phone", u.getPhone());
                    row.put("role", u.getRole().getName());
                    row.put("status", Boolean.TRUE.equals(u.getEnabled()) ? "ACTIVE" : "INACTIVE");
                    row.put("createdAt", u.getCreatedAt());
                    return row;
                })
                .toList();

        StringBuilder csv = new StringBuilder();
        csv.append("ID,First Name,Last Name,Email,Phone,Role,Status,Created At\n");
        for (Map<String, Object> u : users) {
            csv.append(u.get("id")).append(",")
                    .append(escapeCsv(String.valueOf(u.get("firstName")))).append(",")
                    .append(escapeCsv(String.valueOf(u.get("lastName")))).append(",")
                    .append(escapeCsv(String.valueOf(u.get("email")))).append(",")
                    .append(escapeCsv(String.valueOf(u.getOrDefault("phone", "")))).append(",")
                    .append(u.get("role")).append(",")
                    .append(u.get("status")).append(",")
                    .append(u.get("createdAt")).append("\n");
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("csv", csv.toString());
        result.put("count", users.size());
        return ApiResponse.success(result);
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
