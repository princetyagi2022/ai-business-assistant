package com.ai.assistant.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class OpenAiService {

    private static final Logger log = LoggerFactory.getLogger(OpenAiService.class);
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    private final String apiKey;
    private final String model;
    private final RestTemplate restTemplate;

    public OpenAiService(
            @Value("${ai.openai.api-key:}") String apiKey,
            @Value("${ai.openai.model:gpt-4}") String model) {
        this.apiKey = apiKey;
        this.model = model;
        this.restTemplate = new RestTemplate();
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    public String chat(String userMessage, String systemPrompt) {
        if (!isConfigured()) {
            return getFallbackResponse(userMessage);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            List<Map<String, String>> messages = new ArrayList<>();
            if (systemPrompt != null && !systemPrompt.isBlank()) {
                messages.add(Map.of("role", "system", "content", systemPrompt));
            }
            messages.add(Map.of("role", "user", "content", userMessage));

            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 1024);
            requestBody.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(OPENAI_API_URL, HttpMethod.POST, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
            return "I received your message but could not generate a response. Please try again.";
        } catch (Exception e) {
            log.error("OpenAI API call failed: {}", e.getMessage());
            return getFallbackResponse(userMessage);
        }
    }

    public String chatWithBusinessContext(String userMessage, String businessDataSummary) {
        String systemPrompt = """
                You are an AI Business Assistant. You help business owners analyze data, make decisions, 
                and answer questions about their business operations. Be concise, professional, and actionable.
                
                Here is the current business context:
                %s
                """.formatted(businessDataSummary != null ? businessDataSummary : "No context available.");
        return chat(userMessage, systemPrompt);
    }

    private String getFallbackResponse(String message) {
        return "OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable to enable AI-powered responses. " +
               "Your message was: \"" + message + "\". " +
               "In the meantime, you can use the dashboard and data modules to explore your business data.";
    }
}
