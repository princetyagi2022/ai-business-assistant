package com.ai.assistant.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ai.assistant.entity.Inventory;

/**
 * Repository interface for Inventory entity
 */
@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductId(Long productId);

    @Query("SELECT i FROM Inventory i WHERE i.quantityInStock <= i.reorderLevel")
    List<Inventory> findLowStockItems();

    @Query("SELECT i FROM Inventory i WHERE i.quantityInStock <= 0")
    List<Inventory> findOutOfStockItems();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.quantityInStock <= i.reorderLevel")
    Long countLowStockItems();
}
