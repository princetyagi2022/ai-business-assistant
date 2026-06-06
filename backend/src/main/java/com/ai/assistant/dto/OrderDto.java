package com.ai.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Order entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    
    private Long id;
    private String orderNumber;
    private Long customerId;
    private String customerName;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private String status;
    private String shippingAddress;
    private String billingAddress;
    private String notes;
    private List<OrderItemDto> orderItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
