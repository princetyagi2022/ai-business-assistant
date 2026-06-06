package com.ai.assistant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for Chat Response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    
    private String response;
    private String agentUsed;
    private String intentDetected;
    private Double confidenceScore;
    private List<String> sources;
}
