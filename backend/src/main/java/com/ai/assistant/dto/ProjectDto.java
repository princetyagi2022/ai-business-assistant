package com.ai.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    private Long id;
    private String projectName;
    private String clientName;
    private BigDecimal budget;
    private String status;
    private String priority;
    private LocalDate deadline;
    private String teamMembers;
    private String description;
    private String documents;
    private String paymentStatus;
    private String category;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
