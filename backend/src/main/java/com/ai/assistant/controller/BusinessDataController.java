package com.ai.assistant.controller;

import com.ai.assistant.dto.ApiResponse;
import com.ai.assistant.entity.Customer;
import com.ai.assistant.entity.Inventory;
import com.ai.assistant.entity.MarketingCampaign;
import com.ai.assistant.entity.Order;
import com.ai.assistant.entity.Product;
import com.ai.assistant.entity.Report;
import com.ai.assistant.entity.Role;
import com.ai.assistant.entity.Sale;
import com.ai.assistant.entity.User;
import com.ai.assistant.repository.CustomerRepository;
import com.ai.assistant.repository.DocumentRepository;
import com.ai.assistant.repository.EmployeeRepository;
import com.ai.assistant.repository.InventoryRepository;
import com.ai.assistant.repository.MarketingCampaignRepository;
import com.ai.assistant.repository.OrderRepository;
import com.ai.assistant.repository.ProductRepository;
import com.ai.assistant.repository.ReportRepository;
import com.ai.assistant.repository.RoleRepository;
import com.ai.assistant.repository.SaleRepository;
import com.ai.assistant.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
public class BusinessDataController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final EmployeeRepository employeeRepository;
    private final OrderRepository orderRepository;
    private final SaleRepository saleRepository;
    private final MarketingCampaignRepository marketingCampaignRepository;
    private final ReportRepository reportRepository;
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;

    public BusinessDataController(
            UserRepository userRepository,
            RoleRepository roleRepository,
            CustomerRepository customerRepository,
            ProductRepository productRepository,
            InventoryRepository inventoryRepository,
            EmployeeRepository employeeRepository,
            OrderRepository orderRepository,
            SaleRepository saleRepository,
            MarketingCampaignRepository marketingCampaignRepository,
            ReportRepository reportRepository,
            DocumentRepository documentRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.employeeRepository = employeeRepository;
        this.orderRepository = orderRepository;
        this.saleRepository = saleRepository;
        this.marketingCampaignRepository = marketingCampaignRepository;
        this.reportRepository = reportRepository;
        this.documentRepository = documentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users")
    public ApiResponse<List<Map<String, Object>>> users() {
        return ApiResponse.success(userRepository.findAll().stream().map(this::userRow).toList());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> user(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(value -> ResponseEntity.ok(ApiResponse.success(userRow(value))))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/users")
    public ApiResponse<Map<String, Object>> createUser(@RequestBody Map<String, Object> request) {
        String email = stringValue(request, "email").toLowerCase(Locale.ROOT);
        Role role = roleRepository.findByName(roleName(stringValue(request, "role"))).orElseThrow();
        User user = new User();
        user.setUsername(email.substring(0, email.indexOf('@')).replaceAll("[^a-zA-Z0-9_]", "_"));
        user.setEmail(email);
        user.setFirstName(stringValue(request, "firstName"));
        user.setLastName(stringValue(request, "lastName"));
        user.setPassword(passwordEncoder.encode("Password@123"));
        user.setRole(role);
        user.setEnabled(!"INACTIVE".equalsIgnoreCase(stringValue(request, "status")));
        user.setEmailVerified(true);
        return ApiResponse.success(userRow(userRepository.save(user)));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return userRepository.findById(id).map(user -> {
            user.setFirstName(stringValue(request, "firstName"));
            user.setLastName(stringValue(request, "lastName"));
            user.setEmail(stringValue(request, "email").toLowerCase(Locale.ROOT));
            user.setEnabled(!"INACTIVE".equalsIgnoreCase(stringValue(request, "status")));
            roleRepository.findByName(roleName(stringValue(request, "role"))).ifPresent(user::setRole);
            return ResponseEntity.ok(ApiResponse.success(userRow(userRepository.save(user))));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }

    @GetMapping("/customers")
    public ApiResponse<List<Map<String, Object>>> customers() {
        return ApiResponse.success(customerRepository.findAll().stream().map(this::customerRow).toList());
    }

    @GetMapping("/products")
    public ApiResponse<List<Map<String, Object>>> products() {
        return ApiResponse.success(productRepository.findAll().stream().map(this::productRow).toList());
    }

    @GetMapping("/inventory")
    public ApiResponse<List<Map<String, Object>>> inventory() {
        return ApiResponse.success(inventoryRepository.findAll().stream().map(this::inventoryRow).toList());
    }

    @GetMapping("/employees")
    public ApiResponse<List<Map<String, Object>>> employees() {
        return ApiResponse.success(employeeRepository.findAll().stream().map(employee -> row(
                "employeeId", employee.getEmployeeId(),
                "name", employee.getUser().getFullName(),
                "email", employee.getUser().getEmail(),
                "department", employee.getDepartment(),
                "position", employee.getPosition(),
                "salary", employee.getSalary(),
                "status", employee.getStatus()
        )).toList());
    }

    @GetMapping("/orders")
    public ApiResponse<List<Map<String, Object>>> orders() {
        return ApiResponse.success(orderRepository.findAll().stream().map(this::orderRow).toList());
    }

    @GetMapping("/sales")
    public ApiResponse<List<Map<String, Object>>> sales() {
        return ApiResponse.success(saleRepository.findAll().stream().map(this::saleRow).toList());
    }

    @GetMapping("/finance/transactions")
    public ApiResponse<List<Map<String, Object>>> financeTransactions() {
        return ApiResponse.success(saleRepository.findAll().stream().map(sale -> row(
                "transaction", "TXN-" + sale.getId(),
                "customer", sale.getOrder().getCustomer().getFirstName() + " " + sale.getOrder().getCustomer().getLastName(),
                "type", "REVENUE",
                "amount", sale.getTotalAmount(),
                "profit", sale.getProfit(),
                "paymentMethod", sale.getPaymentMethod(),
                "date", sale.getSaleDate()
        )).toList());
    }

    @GetMapping("/marketing/campaigns")
    public ApiResponse<List<Map<String, Object>>> marketingCampaigns() {
        return ApiResponse.success(marketingCampaignRepository.findAll().stream().map(this::campaignRow).toList());
    }

    @GetMapping("/reports")
    public ApiResponse<List<Map<String, Object>>> reports() {
        return ApiResponse.success(reportRepository.findAll().stream().map(this::reportRow).toList());
    }

    @GetMapping("/documents")
    public ApiResponse<List<Map<String, Object>>> documents() {
        return ApiResponse.success(documentRepository.findAll().stream().map(document -> row(
                "title", document.getTitle(),
                "fileName", document.getFileName(),
                "documentType", document.getDocumentType(),
                "fileType", document.getFileType(),
                "indexed", document.getIsIndexed(),
                "uploadedBy", document.getUploadedBy().getFullName(),
                "createdAt", document.getCreatedAt()
        )).toList());
    }

    private Map<String, Object> userRow(User user) {
        return row(
                "id", user.getId(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "email", user.getEmail(),
                "role", "ROLE_" + user.getRole().getName(),
                "status", Boolean.TRUE.equals(user.getEnabled()) ? "ACTIVE" : "INACTIVE",
                "createdAt", user.getCreatedAt()
        );
    }

    private Map<String, Object> customerRow(Customer customer) {
        return row(
                "id", customer.getId(),
                "name", customer.getFirstName() + " " + customer.getLastName(),
                "email", customer.getEmail(),
                "phone", customer.getPhone(),
                "orders", orderRepository.findByCustomerId(customer.getId()).size(),
                "status", "ACTIVE",
                "segment", customer.getCustomerSegment(),
                "totalPurchases", customer.getTotalPurchases()
        );
    }

    private Map<String, Object> productRow(Product product) {
        Integer stock = product.getInventory().stream().findFirst().map(Inventory::getQuantityInStock).orElse(0);
        return row(
                "id", product.getId(),
                "name", product.getName(),
                "sku", product.getSku(),
                "category", product.getCategory().getName(),
                "price", product.getPrice(),
                "stock", stock
        );
    }

    private Map<String, Object> inventoryRow(Inventory inventory) {
        BigDecimal inventoryValue = inventory.getProduct().getPrice().multiply(BigDecimal.valueOf(inventory.getQuantityInStock()));
        return row(
                "id", inventory.getId(),
                "product", inventory.getProduct().getName(),
                "sku", inventory.getProduct().getSku(),
                "quantityInStock", inventory.getQuantityInStock(),
                "reorderLevel", inventory.getReorderLevel(),
                "inventoryValue", inventoryValue,
                "status", inventory.getQuantityInStock() <= inventory.getReorderLevel() ? "LOW_STOCK" : "IN_STOCK"
        );
    }

    private Map<String, Object> orderRow(Order order) {
        return row(
                "id", order.getId(),
                "orderNumber", order.getOrderNumber(),
                "customer", order.getCustomer().getFirstName() + " " + order.getCustomer().getLastName(),
                "totalAmount", order.getTotalAmount(),
                "status", order.getStatus(),
                "orderDate", order.getOrderDate()
        );
    }

    private Map<String, Object> saleRow(Sale sale) {
        return row(
                "id", sale.getId(),
                "orderNumber", sale.getOrder().getOrderNumber(),
                "customer", sale.getOrder().getCustomer().getFirstName() + " " + sale.getOrder().getCustomer().getLastName(),
                "totalAmount", sale.getTotalAmount(),
                "profit", sale.getProfit(),
                "paymentMethod", sale.getPaymentMethod(),
                "saleDate", sale.getSaleDate()
        );
    }

    private Map<String, Object> campaignRow(MarketingCampaign campaign) {
        return row(
                "id", campaign.getId(),
                "name", campaign.getName(),
                "status", campaign.getStatus(),
                "budget", campaign.getBudget(),
                "targetAudience", campaign.getTargetAudience(),
                "startDate", campaign.getStartDate(),
                "endDate", campaign.getEndDate()
        );
    }

    private Map<String, Object> reportRow(Report report) {
        return row(
                "id", report.getId(),
                "reportName", report.getReportName(),
                "reportType", report.getReportType(),
                "fileFormat", report.getFileFormat(),
                "generatedBy", report.getGeneratedBy().getFullName(),
                "createdAt", report.getCreatedAt()
        );
    }

    private String roleName(String value) {
        String role = value == null || value.isBlank() ? "EMPLOYEE" : value.replace("ROLE_", "");
        role = role.toUpperCase(Locale.ROOT);
        return "USER".equals(role) ? "EMPLOYEE" : role;
    }

    private String stringValue(Map<String, Object> request, String key) {
        Object value = request.get(key);
        return value == null ? "" : String.valueOf(value).trim();
    }

    private Map<String, Object> row(Object... values) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int index = 0; index < values.length; index += 2) {
            map.put(String.valueOf(values[index]), values[index + 1]);
        }
        return map;
    }
}
