package com.ai.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Category entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    
    private Long id;
    private String name;
    private String description;
    private Long parentId;
    private String parentName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
