package com.ai.assistant.controller;

import com.ai.assistant.dto.ApiResponse;
import com.ai.assistant.entity.Category;
import com.ai.assistant.entity.Customer;
import com.ai.assistant.entity.Inventory;
import com.ai.assistant.entity.MarketingCampaign;
import com.ai.assistant.entity.Order;
import com.ai.assistant.entity.Product;
import com.ai.assistant.entity.Report;
import com.ai.assistant.entity.Role;
import com.ai.assistant.entity.Sale;
import com.ai.assistant.entity.User;
import com.ai.assistant.repository.CategoryRepository;
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
import com.ai.assistant.service.CsvSyncService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@RestController
public class BusinessDataController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CustomerRepository customerRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final EmployeeRepository employeeRepository;
    private final OrderRepository orderRepository;
    private final SaleRepository saleRepository;
    private final MarketingCampaignRepository marketingCampaignRepository;
    private final ReportRepository reportRepository;
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;
    private final CsvSyncService csvSyncService;

    public BusinessDataController(
            UserRepository userRepository,
            RoleRepository roleRepository,
            CustomerRepository customerRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            InventoryRepository inventoryRepository,
            EmployeeRepository employeeRepository,
            OrderRepository orderRepository,
            SaleRepository saleRepository,
            MarketingCampaignRepository marketingCampaignRepository,
            ReportRepository reportRepository,
            DocumentRepository documentRepository,
            PasswordEncoder passwordEncoder,
            CsvSyncService csvSyncService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.customerRepository = customerRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.employeeRepository = employeeRepository;
        this.orderRepository = orderRepository;
        this.saleRepository = saleRepository;
        this.marketingCampaignRepository = marketingCampaignRepository;
        this.reportRepository = reportRepository;
        this.documentRepository = documentRepository;
        this.passwordEncoder = passwordEncoder;
        this.csvSyncService = csvSyncService;
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
    public ApiResponse<Map<String, Object>> createUser(@RequestBody Map<String, Object> request, Authentication authentication) {
        String targetRole = roleName(stringValue(request, "role"));
        ensureCanManageRole(authentication, targetRole);
        String email = stringValue(request, "email").toLowerCase(Locale.ROOT);
        Role role = roleRepository.findByName(targetRole).orElseThrow();
        User user = new User();
        user.setUsername(email.substring(0, email.indexOf('@')).replaceAll("[^a-zA-Z0-9_]", "_"));
        user.setEmail(email);
        user.setFirstName(stringValue(request, "firstName"));
        user.setLastName(stringValue(request, "lastName"));
        user.setPhone(stringValue(request, "phone"));
        user.setPassword(passwordEncoder.encode(stringValue(request, "password").isEmpty() ? "Password@123" : stringValue(request, "password")));
        user.setRole(role);
        user.setEnabled(!"INACTIVE".equalsIgnoreCase(stringValue(request, "status")));
        user.setEmailVerified(true);
        User saved = userRepository.save(user);
        syncUsersCsv();
        return ApiResponse.success(userRow(saved));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> request, Authentication authentication) {
        return userRepository.findById(id).map(user -> {
            // A manager may only manage employee accounts, and may not touch admin/manager accounts.
            ensureCanManageRole(authentication, "ROLE_" + user.getRole().getName());
            String targetRole = roleName(stringValue(request, "role"));
            ensureCanManageRole(authentication, targetRole);
            user.setFirstName(stringValue(request, "firstName"));
            user.setLastName(stringValue(request, "lastName"));
            user.setEmail(stringValue(request, "email").toLowerCase(Locale.ROOT));
            user.setPhone(stringValue(request, "phone"));
            user.setEnabled(!"INACTIVE".equalsIgnoreCase(stringValue(request, "status")));
            String newPassword = stringValue(request, "password");
            if (!newPassword.isEmpty()) {
                user.setPassword(passwordEncoder.encode(newPassword));
            }
            roleRepository.findByName(targetRole).ifPresent(user::setRole);
            User saved = userRepository.save(user);
            syncUsersCsv();
            return ResponseEntity.ok(ApiResponse.success(userRow(saved)));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        syncUsersCsv();
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

    // Admin, Manager and Employee may add a new product; it becomes visible in the
    // storefront as soon as it has stock (the catch-all security rule limits this
    // POST to those staff roles).
    @PostMapping("/products")
    @Transactional
    public ApiResponse<Map<String, Object>> createProduct(@RequestBody Map<String, Object> request) {
        String name = stringValue(request, "name");
        if (name.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product name is required");
        }
        BigDecimal price = toBigDecimal(request.get("price"));
        if (price == null || price.signum() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid selling price is required");
        }

        String categoryName = stringValue(request, "category");
        final String resolvedCategory = categoryName.isEmpty() ? "Uncategorized" : categoryName;
        Category category = categoryRepository.findByName(resolvedCategory)
                .orElseGet(() -> {
                    Category created = new Category();
                    created.setName(resolvedCategory);
                    return categoryRepository.save(created);
                });

        // Derive the "actual" (list) price from the discount percentage so the shop
        // can render the strike-through MRP and the discount badge.
        BigDecimal discountPercent = toBigDecimal(request.get("discountPercent"));
        BigDecimal mrp = price;
        if (discountPercent != null && discountPercent.signum() > 0
                && discountPercent.compareTo(BigDecimal.valueOf(100)) < 0) {
            BigDecimal factor = BigDecimal.valueOf(100).subtract(discountPercent);
            mrp = price.multiply(BigDecimal.valueOf(100)).divide(factor, 2, RoundingMode.HALF_UP);
        }

        Product product = new Product();
        product.setName(name);
        product.setDescription(stringValue(request, "description"));
        product.setSku(generateSku(resolvedCategory));
        product.setPrice(price);
        product.setMrp(mrp);
        product.setCostPrice(price.multiply(BigDecimal.valueOf(0.6)).setScale(2, RoundingMode.HALF_UP));
        product.setCategory(category);
        product.setImageUrl(stringValue(request, "imageUrl"));
        product.setRating(BigDecimal.valueOf(4.0));
        product.setReviewCount(0);
        Product savedProduct = productRepository.save(product);

        Inventory inventory = new Inventory();
        inventory.setProduct(savedProduct);
        inventory.setQuantityInStock(Math.max(parseStock(request), 0));
        inventory.setReorderLevel(10);
        inventory.setReorderQuantity(50);
        inventoryRepository.save(inventory);

        Map<String, Object> body = row(
                "id", savedProduct.getId(),
                "name", savedProduct.getName(),
                "sku", savedProduct.getSku(),
                "category", category.getName(),
                "price", savedProduct.getPrice(),
                "mrp", savedProduct.getMrp(),
                "imageUrl", savedProduct.getImageUrl(),
                "stock", inventory.getQuantityInStock()
        );
        return ApiResponse.success("Product added to the shop", body);
    }

    @GetMapping("/inventory")
    public ApiResponse<List<Map<String, Object>>> inventory() {
        return ApiResponse.success(inventoryRepository.findAll().stream().map(this::inventoryRow).toList());
    }

    // Admin, Manager and Employee may adjust warehouse stock levels.
    @PutMapping("/inventory/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateInventory(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return inventoryRepository.findById(id).map(inventory -> {
            String quantity = stringValue(request, "quantityInStock");
            if (quantity.isEmpty()) {
                quantity = stringValue(request, "stock");
            }
            if (!quantity.isEmpty()) {
                inventory.setQuantityInStock(Integer.parseInt(quantity));
            }
            String reorder = stringValue(request, "reorderLevel");
            if (!reorder.isEmpty()) {
                inventory.setReorderLevel(Integer.parseInt(reorder));
            }
            Inventory saved = inventoryRepository.save(inventory);
            return ResponseEntity.ok(ApiResponse.success(inventoryRow(saved)));
        }).orElseGet(() -> ResponseEntity.notFound().build());
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

    /** Order fulfilment statuses that staff may set. */
    private static final Set<String> ORDER_STATUSES =
            Set.of("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED");

    // Admin, Manager and Employee may all update an order's fulfilment status
    // (the catch-all security rule already limits this to those staff roles).
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateOrderStatus(
            @PathVariable Long id, @RequestBody Map<String, Object> request) {
        String status = stringValue(request, "status").toUpperCase(Locale.ROOT);
        if (!ORDER_STATUSES.contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid order status. Allowed values: " + ORDER_STATUSES);
        }
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            Order saved = orderRepository.save(order);
            return ResponseEntity.ok(ApiResponse.success("Order status updated", orderRow(saved)));
        }).orElseGet(() -> ResponseEntity.notFound().build());
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
                "phone", user.getPhone(),
                "username", user.getUsername(),
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

    /**
     * Enforces staff-management rules:
     *  - ADMIN can manage any account (MANAGER, EMPLOYEE, USER, ADMIN).
     *  - MANAGER can only manage EMPLOYEE accounts.
     *  - Anyone else is forbidden.
     * targetRoleName is expected in the "ROLE_XXX" form.
     */
    private void ensureCanManageRole(Authentication authentication, String targetRoleName) {
        boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (isAdmin) {
            return;
        }
        boolean isManager = authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_MANAGER".equals(a.getAuthority()));
        if (isManager && "ROLE_EMPLOYEE".equals(targetRoleName)) {
            return;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "You are not allowed to manage accounts with role " + targetRoleName);
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

    private int parseStock(Map<String, Object> request) {
        String stock = stringValue(request, "stock");
        if (stock.isEmpty()) {
            stock = stringValue(request, "quantityInStock");
        }
        if (stock.isEmpty()) {
            return 0;
        }
        try {
            return Integer.parseInt(stock);
        } catch (NumberFormatException ex) {
            return 0;
        }
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }
        String text = String.valueOf(value).trim();
        if (text.isEmpty()) {
            return null;
        }
        try {
            return new BigDecimal(text);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private String generateSku(String categoryName) {
        String prefix = categoryName.replaceAll("[^A-Za-z0-9]", "").toUpperCase(Locale.ROOT);
        if (prefix.length() > 6) {
            prefix = prefix.substring(0, 6);
        }
        if (prefix.isEmpty()) {
            prefix = "PROD";
        }
        String sku;
        do {
            sku = prefix + "-" + System.currentTimeMillis() + "-" + (int) (Math.random() * 1000);
        } while (productRepository.existsBySku(sku));
        return sku;
    }

    private Map<String, Object> row(Object... values) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int index = 0; index < values.length; index += 2) {
            map.put(String.valueOf(values[index]), values[index + 1]);
        }
        return map;
    }

    private void syncUsersCsv() {
        try {
            List<Map<String, Object>> allUsers = userRepository.findAll().stream()
                    .map(u -> {
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("id", u.getId());
                        m.put("first_name", u.getFirstName());
                        m.put("last_name", u.getLastName());
                        m.put("email", u.getEmail());
                        m.put("role", u.getRole().getName().toLowerCase());
                        m.put("status", Boolean.TRUE.equals(u.getEnabled()) ? "active" : "inactive");
                        m.put("profile_image_url", u.getProfileImageUrl() != null ? u.getProfileImageUrl() : "");
                        return m;
                    })
                    .toList();
            csvSyncService.syncUsers(allUsers);
        } catch (Exception e) {
            // Log but don't fail the main operation
        }
    }
}
