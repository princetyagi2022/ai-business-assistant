package com.ai.assistant.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * AgentLog Entity - Represents AI agent execution logs
 */
@Entity
@Table(name = "agent_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgentLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "agent_name", nullable = false, length = 50)
    private String agentName;
    
    @Column(name = "action", nullable = false, length = 100)
    private String action;
    
    @Column(name = "input_data", columnDefinition = "TEXT")
    private String inputData;
    
    @Column(name = "output_data", columnDefinition = "TEXT")
    private String outputData;
    
    @Column(name = "execution_time_ms")
    private Long executionTimeMs;
    
    @Column(name = "status", length = 50)
    private String status = "SUCCESS";
    
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
