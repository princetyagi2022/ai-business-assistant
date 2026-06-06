package com.ai.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Supplier entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierDto {
    
    private Long id;
    private String name;
    private String contactPerson;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String country;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
