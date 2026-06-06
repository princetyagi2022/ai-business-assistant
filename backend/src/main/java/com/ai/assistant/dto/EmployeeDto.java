package com.ai.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Employee entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String employeeId;
    private String department;
    private String position;
    private LocalDate hireDate;
    private BigDecimal salary;
    private Long managerId;
    private String managerName;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
