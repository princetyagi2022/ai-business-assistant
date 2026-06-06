package com.ai.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Notification entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    
    private Long id;
    private Long userId;
    private String title;
    private String message;
    private String type;
    private Boolean isRead;
    private Long relatedEntityId;
    private String relatedEntityType;
    private LocalDateTime createdAt;
}
