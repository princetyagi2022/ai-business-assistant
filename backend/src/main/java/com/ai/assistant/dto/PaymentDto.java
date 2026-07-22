package com.ai.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {
    private Long id;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private Long projectId;
    private String projectName;
    private Long userId;
    private String userEmail;
    private BigDecimal amount;
    private BigDecimal gstAmount;
    private BigDecimal totalAmount;
    private String currency;
    private String status;
    private String paymentMethod;
    private String invoiceNumber;
    private String description;
    private String refundId;
    private String refundStatus;
    private LocalDateTime createdAt;
}
