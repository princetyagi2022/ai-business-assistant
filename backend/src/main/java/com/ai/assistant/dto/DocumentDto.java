package com.ai.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Document entity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDto {
    
    private Long id;
    private String title;
    private String description;
    private String fileName;
    private String filePath;
    private Long fileSize;
    private String fileType;
    private String documentType;
    private Long uploadedBy;
    private String uploadedByName;
    private Boolean isIndexed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
