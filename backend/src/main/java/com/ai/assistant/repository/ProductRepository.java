package com.ai.assistant.repository;

import com.ai.assistant.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Product entity
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findBySku(String sku);
    
    List<Product> findByCategoryId(Long categoryId);
    
    List<Product> findByNameContainingIgnoreCase(String name);
    
    boolean existsBySku(String sku);
    
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId ORDER BY p.name")
    List<Product> findByCategoryOrderByName(@Param("categoryId") Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
}
