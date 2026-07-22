package com.ai.assistant.controller;

import com.ai.assistant.dto.ApiResponse;
import com.ai.assistant.entity.Inventory;
import com.ai.assistant.entity.Product;
import com.ai.assistant.repository.InventoryRepository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Serves in-app notifications. Currently the notifications are computed live
 * from business data: every product whose stock quantity is below
 * {@link #LOW_STOCK_THRESHOLD} produces a low-stock alert.
 */
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    /** Products with fewer than this many units in stock raise a low-stock alert. */
    private static final int LOW_STOCK_THRESHOLD = 10;

    private final InventoryRepository inventoryRepository;

    public NotificationController(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> getAll() {
        List<Inventory> lowStock = inventoryRepository
                .findByQuantityInStockLessThanOrderByQuantityInStockAsc(LOW_STOCK_THRESHOLD);
        List<Map<String, Object>> notifications = lowStock.stream()
                .map(this::lowStockNotification)
                .toList();
        return ApiResponse.success(notifications);
    }

    // Notifications are derived live from stock levels, so marking read/deleting is a
    // no-op acknowledgement kept for frontend compatibility.
    @PatchMapping("/{id}/read")
    public ApiResponse<Map<String, Object>> markRead(@PathVariable String id) {
        return ApiResponse.success("Notification marked as read", Map.of("id", id, "read", true));
    }

    @PatchMapping("/read-all")
    public ApiResponse<Map<String, Object>> markAllRead() {
        return ApiResponse.success("All notifications marked as read", Map.of("read", true));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Map<String, Object>> delete(@PathVariable String id) {
        return ApiResponse.success("Notification dismissed", Map.of("id", id));
    }

    private Map<String, Object> lowStockNotification(Inventory inventory) {
        Product product = inventory.getProduct();
        String name = product != null ? product.getName() : "Unknown product";
        String sku = product != null ? product.getSku() : "-";
        int stock = inventory.getQuantityInStock() != null ? inventory.getQuantityInStock() : 0;

        Map<String, Object> notification = new LinkedHashMap<>();
        notification.put("id", "low-stock-" + inventory.getId());
        notification.put("title", "Low stock: " + name);
        notification.put("message",
                "Only " + stock + " unit" + (stock == 1 ? "" : "s") + " left in stock (SKU " + sku + ").");
        notification.put("type", "LOW_STOCK");
        notification.put("read", false);
        notification.put("stock", stock);
        notification.put("sku", sku);
        notification.put("time", inventory.getUpdatedAt() != null ? inventory.getUpdatedAt() : LocalDateTime.now());
        return notification;
    }
}
