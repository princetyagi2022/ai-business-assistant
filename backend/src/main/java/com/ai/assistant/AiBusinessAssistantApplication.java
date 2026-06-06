package com.ai.assistant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main Application Class for AI Business Assistant
 * This is the entry point for the Spring Boot application
 */
@SpringBootApplication
@EnableScheduling
public class AiBusinessAssistantApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiBusinessAssistantApplication.class, args);
        System.out.println("AI Business Assistant started successfully!");
    }
}