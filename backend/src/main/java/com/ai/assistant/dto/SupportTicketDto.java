package com.ai.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for SupportTicket entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicketDto {
    
    private Long id;
    private String ticketNumber;
    private Long customerId;
    private String customerName;
    private String subject;
    private String description;
    private String priority;
    private String status;
    private Long assignedTo;
    private String assignedToName;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
