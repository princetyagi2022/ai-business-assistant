package com.ai.assistant.controller;

import com.ai.assistant.dto.ApiResponse;
import com.ai.assistant.entity.Customer;
import com.ai.assistant.entity.Inventory;
import com.ai.assistant.entity.Order;
import com.ai.assistant.entity.OrderItem;
import com.ai.assistant.entity.Product;
import com.ai.assistant.entity.User;
import com.ai.assistant.repository.CustomerRepository;
import com.ai.assistant.repository.InventoryRepository;
import com.ai.assistant.repository.OrderItemRepository;
import com.ai.assistant.repository.OrderRepository;
import com.ai.assistant.repository.ProductRepository;
import com.ai.assistant.repository.UserRepository;
import com.ai.assistant.security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Storefront endpoints for normal (ROLE_USER) customers.
 * - GET  /shop/catalog   -> in-stock products grouped by category
 * - POST /shop/orders    -> place an order (decrements warehouse stock)
 * - GET  /my/orders      -> orders placed by the logged-in customer
 */
@RestController
public class StorefrontController {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    public StorefrontController(
            ProductRepository productRepository,
            InventoryRepository inventoryRepository,
            CustomerRepository customerRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            UserRepository userRepository) {
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/shop/catalog")
    public ApiResponse<List<Map<String, Object>>> catalog() {
        // Group in-stock products by their category name.
        Map<String, List<Map<String, Object>>> grouped = new LinkedHashMap<>();
        for (Product product : productRepository.findAll()) {
            int stock = inventoryRepository.findByProductId(product.getId())
                    .map(Inventory::getQuantityInStock)
                    .orElse(0);
            if (stock <= 0) {
                continue;
            }
            String category = product.getCategory() != null ? product.getCategory().getName() : "Uncategorized";
            grouped.computeIfAbsent(category, key -> new ArrayList<>()).add(productCard(product, stock));
        }
        List<Map<String, Object>> categories = new ArrayList<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : grouped.entrySet()) {
            Map<String, Object> node = new LinkedHashMap<>();
            node.put("category", entry.getKey());
            node.put("products", entry.getValue());
            categories.add(node);
        }
        return ApiResponse.success(categories);
    }

    @PostMapping("/shop/orders")
    @Transactional
    @SuppressWarnings("unchecked")
    public ApiResponse<Map<String, Object>> placeOrder(@RequestBody Map<String, Object> request, Authentication authentication) {
        List<Map<String, Object>> items = (List<Map<String, Object>>) request.get("items");
        if (items == null || items.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order must contain at least one item");
        }

        Customer customer = resolveCustomer(authentication);

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setShippingAddress(stringValue(request, "shippingAddress"));
        order.setBillingAddress(stringValue(request, "shippingAddress"));
        order.setTotalAmount(BigDecimal.ZERO);
        Order savedOrder = orderRepository.save(order);

        BigDecimal total = BigDecimal.ZERO;
        List<Map<String, Object>> lineItems = new ArrayList<>();
        for (Map<String, Object> item : items) {
            Long productId = toLong(item.get("productId"));
            int quantity = toInt(item.get("quantity"));
            if (productId == null || quantity <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order item");
            }
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + productId));
            Inventory inventory = inventoryRepository.findByProductId(productId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No stock record for product: " + product.getName()));
            if (inventory.getQuantityInStock() < quantity) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Insufficient stock for " + product.getName() + " (available: " + inventory.getQuantityInStock() + ")");
            }

            // Decrement warehouse stock automatically.
            inventory.setQuantityInStock(inventory.getQuantityInStock() - quantity);
            inventoryRepository.save(inventory);

            BigDecimal unitPrice = product.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
            total = total.add(lineTotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setUnitPrice(unitPrice);
            orderItem.setTotalPrice(lineTotal);
            orderItemRepository.save(orderItem);

            lineItems.add(itemRow(product.getName(), quantity, unitPrice, lineTotal));
        }

        savedOrder.setTotalAmount(total);
        orderRepository.save(savedOrder);

        // Keep the customer's lifetime purchase total in sync.
        customer.setTotalPurchases(
                (customer.getTotalPurchases() == null ? BigDecimal.ZERO : customer.getTotalPurchases()).add(total));
        customerRepository.save(customer);

        Map<String, Object> result = orderDetail(savedOrder, lineItems);
        return ApiResponse.success("Order placed successfully", result);
    }

    @GetMapping("/my/orders")
    @Transactional(readOnly = true)
    public ApiResponse<List<Map<String, Object>>> myOrders(Authentication authentication) {
        String email = currentEmail(authentication);
        Customer customer = customerRepository.findByEmail(email).orElse(null);
        if (customer == null) {
            return ApiResponse.success(List.of());
        }
        List<Map<String, Object>> orders = new ArrayList<>();
        for (Order order : orderRepository.findByCustomerOrderByOrderDateDesc(customer.getId())) {
            // Load line items directly (avoids initialising the lazy Set<OrderItem>,
            // which triggers a Lombok @Data hashCode() recursion on the bidirectional
            // Order <-> OrderItem relationship and previously caused a 500 error here).
            List<Map<String, Object>> lineItems = new ArrayList<>();
            for (OrderItem item : orderItemRepository.findByOrderId(order.getId())) {
                lineItems.add(itemRow(item.getProduct().getName(), item.getQuantity(), item.getUnitPrice(), item.getTotalPrice()));
            }
            orders.add(orderDetail(order, lineItems));
        }
        return ApiResponse.success(orders);
    }

    // ---------------------------------------------------------------- helpers

    private Customer resolveCustomer(Authentication authentication) {
        String email = currentEmail(authentication);
        return customerRepository.findByEmail(email).orElseGet(() -> {
            User user = userRepository.findByEmail(email).orElse(null);
            Customer customer = new Customer();
            customer.setEmail(email);
            customer.setFirstName(user != null ? user.getFirstName() : "Guest");
            customer.setLastName(user != null ? user.getLastName() : "Customer");
            customer.setPhone(user != null ? user.getPhone() : null);
            customer.setCustomerSegment("REGULAR");
            customer.setTotalPurchases(BigDecimal.ZERO);
            return customerRepository.save(customer);
        });
    }

    private String currentEmail(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails details) {
            return details.getEmail();
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
    }

    private String generateOrderNumber() {
        String candidate;
        do {
            candidate = "ORD-" + System.currentTimeMillis();
        } while (orderRepository.existsByOrderNumber(candidate));
        return candidate;
    }

    private Map<String, Object> productCard(Product product, int stock) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", product.getId());
        map.put("name", product.getName());
        map.put("sku", product.getSku());
        map.put("description", product.getDescription());
        map.put("price", product.getPrice());
        map.put("mrp", product.getMrp());
        map.put("rating", product.getRating());
        map.put("reviewCount", product.getReviewCount());
        map.put("imageUrl", product.getImageUrl());
        map.put("category", product.getCategory() != null ? product.getCategory().getName() : "Uncategorized");
        map.put("stock", stock);
        return map;
    }

    private Map<String, Object> itemRow(String name, int quantity, BigDecimal unitPrice, BigDecimal lineTotal) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("product", name);
        map.put("quantity", quantity);
        map.put("unitPrice", unitPrice);
        map.put("totalPrice", lineTotal);
        return map;
    }

    private Map<String, Object> orderDetail(Order order, List<Map<String, Object>> lineItems) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", order.getId());
        map.put("orderNumber", order.getOrderNumber());
        map.put("status", order.getStatus());
        map.put("totalAmount", order.getTotalAmount());
        map.put("orderDate", order.getOrderDate());
        map.put("shippingAddress", order.getShippingAddress());
        map.put("items", lineItems);
        return map;
    }

    private String stringValue(Map<String, Object> request, String key) {
        Object value = request.get(key);
        return value == null ? "" : String.valueOf(value).trim();
    }

    private Long toLong(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return number.longValue();
        }
        try {
            return Long.parseLong(String.valueOf(value).trim());
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private int toInt(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        try {
            return Integer.parseInt(String.valueOf(value).trim());
        } catch (NumberFormatException ex) {
            return 0;
        }
    }
}
