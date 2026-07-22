package com.ai.assistant.controller;

import com.ai.assistant.dto.ApiResponse;
import com.ai.assistant.repository.CustomerRepository;
import com.ai.assistant.repository.InventoryRepository;
import com.ai.assistant.repository.MarketingCampaignRepository;
import com.ai.assistant.repository.OrderRepository;
import com.ai.assistant.repository.SaleRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Exposes the AI agent roster shown on the "AI Agents" page. Task counts are
 * derived from live business data so the cards reflect current activity.
 */
@RestController
public class AgentController {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final SaleRepository saleRepository;
    private final InventoryRepository inventoryRepository;
    private final MarketingCampaignRepository marketingCampaignRepository;

    public AgentController(
            OrderRepository orderRepository,
            CustomerRepository customerRepository,
            SaleRepository saleRepository,
            InventoryRepository inventoryRepository,
            MarketingCampaignRepository marketingCampaignRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.saleRepository = saleRepository;
        this.inventoryRepository = inventoryRepository;
        this.marketingCampaignRepository = marketingCampaignRepository;
    }

    @GetMapping("/agents")
    public ApiResponse<List<Map<String, Object>>> agents() {
        List<Map<String, Object>> agents = List.of(
                agent("sales", "Sales Agent", "Qualifies leads and drafts proposals.", "active", orderRepository.count()),
                agent("support", "Support Agent", "Handles tickets and customer queries.", "active", customerRepository.count()),
                agent("fraud", "Fraud Detection", "Monitors transactions for anomalies.", "active", saleRepository.count()),
                agent("inventory", "Inventory Agent", "Predicts stock needs and reorder points.", "active", inventoryRepository.count()),
                agent("marketing", "Marketing Agent", "Optimizes campaigns and audience segments.", "active", marketingCampaignRepository.count())
        );
        return ApiResponse.success(agents);
    }

    private Map<String, Object> agent(String id, String name, String description, String status, long tasksCompleted) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        map.put("name", name);
        map.put("description", description);
        map.put("status", status);
        map.put("tasksCompleted", tasksCompleted);
        return map;
    }
}
