package com.ai.assistant.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Report Entity - Represents generated reports
 */
@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "report_name", nullable = false, length = 200)
    private String reportName;
    
    @Column(name = "report_type", nullable = false, length = 50)
    private String reportType;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generated_by", nullable = false)
    private User generatedBy;
    
    @Column(name = "file_path", length = 500)
    private String filePath;
    
    @Column(name = "file_format", length = 20)
    private String fileFormat;
    
    @Column(name = "parameters", columnDefinition = "JSON")
    private String parameters;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
