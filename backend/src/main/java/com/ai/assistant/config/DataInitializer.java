package com.ai.assistant.config;

import com.ai.assistant.entity.Category;
import com.ai.assistant.entity.Customer;
import com.ai.assistant.entity.Document;
import com.ai.assistant.entity.Employee;
import com.ai.assistant.entity.Inventory;
import com.ai.assistant.entity.MarketingCampaign;
import com.ai.assistant.entity.Order;
import com.ai.assistant.entity.Payment;
import com.ai.assistant.entity.Product;
import com.ai.assistant.entity.Report;
import com.ai.assistant.entity.Role;
import com.ai.assistant.entity.Sale;
import com.ai.assistant.entity.Supplier;
import com.ai.assistant.entity.User;
import com.ai.assistant.repository.CategoryRepository;
import com.ai.assistant.repository.CustomerRepository;
import com.ai.assistant.repository.DocumentRepository;
import com.ai.assistant.repository.EmployeeRepository;
import com.ai.assistant.repository.InventoryRepository;
import com.ai.assistant.repository.MarketingCampaignRepository;
import com.ai.assistant.repository.OrderRepository;
import com.ai.assistant.repository.PaymentRepository;
import com.ai.assistant.repository.ProductRepository;
import com.ai.assistant.repository.ReportRepository;
import com.ai.assistant.repository.RoleRepository;
import com.ai.assistant.repository.SaleRepository;
import com.ai.assistant.repository.SupplierRepository;
import com.ai.assistant.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final SaleRepository saleRepository;
    private final MarketingCampaignRepository marketingCampaignRepository;
    private final ReportRepository reportRepository;
    private final DocumentRepository documentRepository;
    private final EmployeeRepository employeeRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            RoleRepository roleRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            SupplierRepository supplierRepository,
            InventoryRepository inventoryRepository,
            CustomerRepository customerRepository,
            OrderRepository orderRepository,
            SaleRepository saleRepository,
            MarketingCampaignRepository marketingCampaignRepository,
            ReportRepository reportRepository,
            DocumentRepository documentRepository,
            EmployeeRepository employeeRepository,
            PaymentRepository paymentRepository,
            PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
        this.inventoryRepository = inventoryRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.saleRepository = saleRepository;
        this.marketingCampaignRepository = marketingCampaignRepository;
        this.reportRepository = reportRepository;
        this.documentRepository = documentRepository;
        this.employeeRepository = employeeRepository;
        this.paymentRepository = paymentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedRoles();
        seedUsers();
        seedBusinessData();
    }

    private void seedRoles() {
        Map<String, String> roles = Map.of(
                "ADMIN", "Full system access",
                "MANAGER", "Manager level access",
                "EMPLOYEE", "Employee level access",
                "USER", "Storefront customer access"
        );

        roles.forEach((name, description) -> {
            if (!roleRepository.existsByName(name)) {
                Role role = new Role();
                role.setName(name);
                role.setDescription(description);
                roleRepository.save(role);
            }
        });
    }

    private void seedUsers() {
        Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
        Role managerRole = roleRepository.findByName("MANAGER").orElseThrow();
        Role employeeRole = roleRepository.findByName("EMPLOYEE").orElseThrow();

        ensureUser("admin", "princetyagi9997@gmail.com", "Prince", "Tyagi", adminRole, true, "prince@#1221");
        ensureUser("manager", "manager@aiassistant.com", "Priya", "Sharma", managerRole, true, "Password@123");
        ensureUser("analyst", "analyst@aiassistant.com", "Rahul", "Mehta", employeeRole, true, "Password@123");
    }

    private void seedBusinessData() {
        User admin = userRepository.findByUsername("admin").orElseThrow();
        User manager = userRepository.findByUsername("manager").orElseThrow();
        User analyst = userRepository.findByUsername("analyst").orElseThrow();

        ensureEmployee(manager, "EMP-1001", "Operations", "Business Operations Manager", "92000.00");
        ensureEmployee(analyst, "EMP-1002", "Analytics", "Data Analyst", "68000.00");

        Customer customerOne = ensureCustomer("Aarav", "Kapoor", "aarav.kapoor@example.com", "+91 98765 43210", "Mumbai", "VIP", "184500.00");
        Customer customerTwo = ensureCustomer("Neha", "Rao", "neha.rao@example.com", "+91 99887 77665", "Bengaluru", "REGULAR", "72800.00");
        Customer customerThree = ensureCustomer("Kabir", "Singh", "kabir.singh@example.com", "+91 91234 56789", "Delhi", "PREMIUM", "126400.00");

        Category software = ensureCategory("Software", "Business automation and analytics tools");
        Category hardware = ensureCategory("Hardware", "Office and warehouse hardware");
        Supplier supplier = ensureSupplier("Northstar Supplies", "Anita Desai", "support@northstar.example", "Pune", "India");

        Product crm = ensureProduct("AI CRM Suite", "CRM-AI-001", software, "12999.00", "7200.00");
        Product scanner = ensureProduct("Inventory Scanner Pro", "INV-SCAN-014", hardware, "8999.00", "5100.00");
        Product dashboard = ensureProduct("Executive Dashboard License", "DASH-LIC-030", software, "15999.00", "8400.00");

        ensureInventory(crm, supplier, 86, 20, 40);
        ensureInventory(scanner, supplier, 32, 15, 30);
        ensureInventory(dashboard, supplier, 118, 25, 50);

        Order orderOne = ensureOrder("ORD-2026-1001", customerOne, "38997.00", "DELIVERED");
        Order orderTwo = ensureOrder("ORD-2026-1002", customerTwo, "8999.00", "PROCESSING");
        Order orderThree = ensureOrder("ORD-2026-1003", customerThree, "15999.00", "PAID");

        ensureSale(orderOne, "38997.00", "15400.00", "CARD");
        ensureSale(orderTwo, "8999.00", "2600.00", "UPI");
        ensureSale(orderThree, "15999.00", "6100.00", "BANK_TRANSFER");

        ensureCampaign("Q2 Retention Push", manager, "ACTIVE", "Customer retention for premium accounts", "45000.00");
        ensureCampaign("Inventory Upgrade Launch", manager, "PLANNED", "Warehouse teams and operations managers", "72000.00");

        ensureReport("Monthly Revenue Summary", "FINANCE", admin, "PDF");
        ensureReport("Customer Segment Review", "CUSTOMER", manager, "XLSX");

        ensureDocument("Sales Dataset", "sales.csv", "DATASET", admin);
        ensureDocument("Project Analysis Report", "phase-1-project-analysis-report.md", "REPORT", admin);

        seedPayments(admin, manager);

        // Load the Amazon-style storefront catalog (products + stock) from CSV.
        seedStorefrontCatalog();
    }

    /**
     * Seeds the customer-facing storefront with a rich Amazon-style catalog read from
     * {@code amazon-products.csv} on the classpath. Each row becomes a Product plus an
     * Inventory record so the item is immediately available (in stock) in the shop.
     * Idempotent: an existing SKU is reused (never duplicated) and its display
     * fields are refreshed from the CSV on every restart.
     */
    private void seedStorefrontCatalog() {
        Supplier marketplace = ensureSupplier(
                "Amazon Marketplace", "Marketplace Support", "sellers@amazon.example", "Bengaluru", "India");

        ClassPathResource resource = new ClassPathResource("amazon-products.csv");
        if (!resource.exists()) {
            return;
        }

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            reader.readLine(); // skip header row
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.isBlank()) {
                    continue;
                }
                List<String> cols = parseCsvLine(line);
                if (cols.size() < 11) {
                    continue;
                }
                String sku = cols.get(2).trim();
                if (sku.isEmpty() || sku.equalsIgnoreCase("sku")) {
                    // Skip blank rows and any stray/duplicate header line.
                    continue;
                }

                // Pricing/rating must be numeric; skip a malformed row instead of
                // aborting the whole application startup.
                BigDecimal price = parseDecimalSafe(cols.get(4));
                BigDecimal costPrice = parseDecimalSafe(cols.get(5));
                BigDecimal mrp = parseDecimalSafe(cols.get(6));
                BigDecimal rating = parseDecimalSafe(cols.get(8));
                if (price == null || costPrice == null) {
                    System.err.println("Skipping storefront row with invalid pricing for SKU: " + sku);
                    continue;
                }

                Category category = ensureCategory(cols.get(0).trim(),
                        cols.get(0).trim() + " products available in the storefront");

                // Reuse the existing product for this SKU so restarts never create
                // duplicates, but always refresh the display fields (image, pricing,
                // rating) so edits to amazon-products.csv take effect on restart.
                Product product = productRepository.findBySku(sku).orElseGet(Product::new);
                product.setName(cols.get(1).trim());
                product.setSku(sku);
                product.setDescription(cols.get(3).trim());
                product.setCategory(category);
                product.setPrice(price);
                product.setCostPrice(costPrice);
                product.setMrp(mrp);
                product.setRating(rating);
                product.setReviewCount(parseIntSafe(cols.get(9).trim()));
                product.setImageUrl(cols.get(10).trim());
                Product saved = productRepository.save(product);

                ensureInventory(saved, marketplace, parseIntSafe(cols.get(7).trim()), 20, 50);
            }
        } catch (IOException ex) {
            System.err.println("Failed to seed storefront catalog: " + ex.getMessage());
        }
    }

    /** Minimal RFC-4180 style CSV line parser that supports double-quoted fields. */
    private List<String> parseCsvLine(String line) {
        List<String> result = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (inQuotes) {
                if (c == '"') {
                    if (i + 1 < line.length() && line.charAt(i + 1) == '"') {
                        sb.append('"');
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    sb.append(c);
                }
            } else if (c == '"') {
                inQuotes = true;
            } else if (c == ',') {
                result.add(sb.toString());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        result.add(sb.toString());
        return result;
    }

    private int parseIntSafe(String value) {
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException ex) {
            return 0;
        }
    }

    /** Parses a decimal, returning {@code null} for blank or non-numeric input. */
    private BigDecimal parseDecimalSafe(String value) {
        if (value == null) {
            return null;
        }
        try {
            return new BigDecimal(value.trim());
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private void seedPayments(User admin, User manager) {
        if (paymentRepository.count() == 0) {
            ensurePayment(admin, "38997.00", "6999.46", "45996.46", "SUCCESS", "CARD", "INV-2026-001", "CRM Suite order payment");
            ensurePayment(manager, "8999.00", "1619.82", "10618.82", "SUCCESS", "UPI", "INV-2026-002", "Scanner Pro purchase");
            ensurePayment(admin, "15999.00", "2879.82", "18878.82", "CREATED", null, "INV-2026-003", "Dashboard license - pending");
            ensurePayment(manager, "45000.00", "8100.00", "53100.00", "SUCCESS", "BANK_TRANSFER", "INV-2026-004", "Q2 campaign budget");
        }
    }

    private void ensurePayment(User user, String amount, String gst, String total, String status, String method, String invoice, String desc) {
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setAmount(new BigDecimal(amount));
        payment.setGstAmount(new BigDecimal(gst));
        payment.setTotalAmount(new BigDecimal(total));
        payment.setCurrency("INR");
        payment.setStatus(status);
        payment.setPaymentMethod(method);
        payment.setInvoiceNumber(invoice);
        payment.setDescription(desc);
        payment.setRazorpayOrderId("order_seed_" + invoice);
        if ("SUCCESS".equals(status)) {
            payment.setRazorpayPaymentId("pay_seed_" + invoice);
            payment.setRazorpaySignature("sig_seed_" + invoice);
        }
        paymentRepository.save(payment);
    }

    private User ensureUser(String username, String email, String firstName, String lastName, Role role, boolean verified, String password) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            user = new User();
            user.setUsername(username);
        }
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setEnabled(true);
        user.setEmailVerified(verified);
        return userRepository.save(user);
    }

    private Customer ensureCustomer(String firstName, String lastName, String email, String phone, String city, String segment, String totalPurchases) {
        return customerRepository.findByEmail(email).orElseGet(() -> {
            Customer customer = new Customer();
            customer.setFirstName(firstName);
            customer.setLastName(lastName);
            customer.setEmail(email);
            customer.setPhone(phone);
            customer.setCity(city);
            customer.setCountry("India");
            customer.setCustomerSegment(segment);
            customer.setTotalPurchases(new BigDecimal(totalPurchases));
            return customerRepository.save(customer);
        });
    }

    private Category ensureCategory(String name, String description) {
        return categoryRepository.findByName(name).orElseGet(() -> {
            Category category = new Category();
            category.setName(name);
            category.setDescription(description);
            return categoryRepository.save(category);
        });
    }

    private Supplier ensureSupplier(String name, String contact, String email, String city, String country) {
        return supplierRepository.findByName(name).orElseGet(() -> {
            Supplier supplier = new Supplier();
            supplier.setName(name);
            supplier.setContactPerson(contact);
            supplier.setEmail(email);
            supplier.setCity(city);
            supplier.setCountry(country);
            return supplierRepository.save(supplier);
        });
    }

    private Product ensureProduct(String name, String sku, Category category, String price, String costPrice) {
        return productRepository.findBySku(sku).orElseGet(() -> {
            Product product = new Product();
            product.setName(name);
            product.setSku(sku);
            product.setDescription("Seeded product record used by the live business dashboard.");
            product.setCategory(category);
            product.setPrice(new BigDecimal(price));
            product.setCostPrice(new BigDecimal(costPrice));
            return productRepository.save(product);
        });
    }

    private void ensureInventory(Product product, Supplier supplier, int stock, int reorderLevel, int reorderQuantity) {
        inventoryRepository.findByProductId(product.getId()).orElseGet(() -> {
            Inventory inventory = new Inventory();
            inventory.setProduct(product);
            inventory.setSupplier(supplier);
            inventory.setQuantityInStock(stock);
            inventory.setReorderLevel(reorderLevel);
            inventory.setReorderQuantity(reorderQuantity);
            inventory.setLastRestockedDate(LocalDateTime.now().minusDays(7));
            return inventoryRepository.save(inventory);
        });
    }

    private Order ensureOrder(String orderNumber, Customer customer, String amount, String status) {
        return orderRepository.findByOrderNumber(orderNumber).orElseGet(() -> {
            Order order = new Order();
            order.setOrderNumber(orderNumber);
            order.setCustomer(customer);
            order.setOrderDate(LocalDateTime.now().minusDays(3));
            order.setTotalAmount(new BigDecimal(amount));
            order.setStatus(status);
            order.setShippingAddress(customer.getCity() + ", " + customer.getCountry());
            order.setBillingAddress(customer.getCity() + ", " + customer.getCountry());
            return orderRepository.save(order);
        });
    }

    private void ensureSale(Order order, String amount, String profit, String paymentMethod) {
        boolean exists = saleRepository.findAll().stream().anyMatch(sale -> sale.getOrder().getId().equals(order.getId()));
        if (!exists) {
            Sale sale = new Sale();
            sale.setOrder(order);
            sale.setSaleDate(order.getOrderDate().plusHours(2));
            sale.setTotalAmount(new BigDecimal(amount));
            sale.setProfit(new BigDecimal(profit));
            sale.setPaymentMethod(paymentMethod);
            saleRepository.save(sale);
        }
    }

    private void ensureCampaign(String name, User createdBy, String status, String audience, String budget) {
        boolean exists = marketingCampaignRepository.findAll().stream().anyMatch(campaign -> campaign.getName().equals(name));
        if (!exists) {
            MarketingCampaign campaign = new MarketingCampaign();
            campaign.setName(name);
            campaign.setDescription("Seeded campaign record for live marketing reporting.");
            campaign.setStartDate(LocalDate.now().minusDays(10));
            campaign.setEndDate(LocalDate.now().plusDays(25));
            campaign.setBudget(new BigDecimal(budget));
            campaign.setStatus(status);
            campaign.setTargetAudience(audience);
            campaign.setCreatedBy(createdBy);
            marketingCampaignRepository.save(campaign);
        }
    }

    private void ensureReport(String name, String type, User generatedBy, String format) {
        boolean exists = reportRepository.findAll().stream().anyMatch(report -> report.getReportName().equals(name));
        if (!exists) {
            Report report = new Report();
            report.setReportName(name);
            report.setReportType(type);
            report.setDescription("Generated from current seeded business data.");
            report.setGeneratedBy(generatedBy);
            report.setFilePath("./documents/" + name.toLowerCase().replace(" ", "-") + "." + format.toLowerCase());
            report.setFileFormat(format);
            report.setParameters("{}");
            reportRepository.save(report);
        }
    }

    private void ensureDocument(String title, String fileName, String type, User uploadedBy) {
        boolean exists = documentRepository.findByTitleContainingIgnoreCase(title).stream().anyMatch(document -> document.getTitle().equals(title));
        if (!exists) {
            Document document = new Document();
            document.setTitle(title);
            document.setDescription("Project document available to the assistant.");
            document.setFileName(fileName);
            document.setFilePath("./documents/" + fileName);
            document.setFileSize(2048L);
            document.setFileType("text/plain");
            document.setDocumentType(type);
            document.setUploadedBy(uploadedBy);
            document.setIsIndexed(true);
            documentRepository.save(document);
        }
    }

    private void ensureEmployee(User user, String employeeId, String department, String position, String salary) {
        if (!employeeRepository.existsByEmployeeId(employeeId)) {
            Employee employee = new Employee();
            employee.setUser(user);
            employee.setEmployeeId(employeeId);
            employee.setDepartment(department);
            employee.setPosition(position);
            employee.setHireDate(LocalDate.now().minusYears(1));
            employee.setSalary(new BigDecimal(salary));
            employee.setStatus("ACTIVE");
            employeeRepository.save(employee);
        }
    }
}
