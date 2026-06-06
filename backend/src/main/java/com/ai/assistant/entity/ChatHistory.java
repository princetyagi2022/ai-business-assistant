package com.ai.assistant.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * ChatHistory Entity - Represents chatbot conversation history
 */
@Entity
@Table(name = "chat_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "session_id", nullable = false, length = 100)
    private String sessionId;
    
    @Column(name = "user_message", nullable = false, columnDefinition = "TEXT")
    private String userMessage;
    
    @Column(name = "bot_response", nullable = false, columnDefinition = "TEXT")
    private String botResponse;
    
    @Column(name = "agent_used", length = 50)
    private String agentUsed;
    
    @Column(name = "intent_detected", length = 100)
    private String intentDetected;
    
    @Column(name = "confidence_score", precision = 5, scale = 4)
    private BigDecimal confidenceScore;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
