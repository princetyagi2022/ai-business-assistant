package com.ai.assistant.repository;

import com.ai.assistant.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Sale entity
 */
@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    
    List<Sale> findBySaleDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT SUM(s.totalAmount) FROM Sale s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    Double sumTotalAmountBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(s.profit) FROM Sale s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    Double sumProfitBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(s) FROM Sale s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    Long countSalesBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
