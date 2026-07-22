package com.ai.assistant.controller;

import com.ai.assistant.dto.ApiResponse;
import com.ai.assistant.service.OpenAiService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/chatbot")
public class ChatController {

    private final OpenAiService openAiService;

    public ChatController(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    @PostMapping("/chat")
    public ApiResponse<Map<String, Object>> chat(@RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "");
        String sessionId = request.getOrDefault("sessionId", "");

        if (message.isBlank()) {
            return ApiResponse.error("Message cannot be empty");
        }

        String reply = openAiService.chatWithBusinessContext(message, null);

        Map<String, Object> response = Map.of(
                "reply", reply,
                "message", reply,
                "intent", "ai-assistant",
                "sessionId", sessionId,
                "source", openAiService.isConfigured() ? "openai-gpt4" : "fallback"
        );

        return ApiResponse.success(response);
    }

    @GetMapping("/status")
    public ApiResponse<Map<String, Object>> status() {
        return ApiResponse.success(Map.of(
                "aiConfigured", openAiService.isConfigured(),
                "model", "gpt-4",
                "provider", "OpenAI"
        ));
    }
}
