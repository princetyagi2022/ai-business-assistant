package com.ai.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for FraudAlert entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FraudAlertDto {
    
    private Long id;
    private String alertType;
    private String description;
    private String severity;
    private Long orderId;
    private String orderNumber;
    private Long customerId;
    private String customerName;
    private String status;
    private Long investigatedBy;
    private String investigatedByName;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
