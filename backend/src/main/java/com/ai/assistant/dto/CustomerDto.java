package com.ai.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Customer entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDto {
    
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String country;
    private LocalDate dateOfBirth;
    private String customerSegment;
    private BigDecimal totalPurchases;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
