package com.ai.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Inventory entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDto {
    
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private Long supplierId;
    private String supplierName;
    private Integer quantityInStock;
    private Integer reorderLevel;
    private Integer reorderQuantity;
    private LocalDateTime lastRestockedDate;
    private Boolean lowStock;
    private Boolean outOfStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
