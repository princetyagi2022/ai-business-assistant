package com.ai.assistant.repository;

import com.ai.assistant.entity.FraudAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for FraudAlert entity
 */
@Repository
public interface FraudAlertRepository extends JpaRepository<FraudAlert, Long> {
    
    List<FraudAlert> findByStatus(String status);
    
    List<FraudAlert> findBySeverity(String severity);
    
    List<FraudAlert> findByCustomerId(Long customerId);
    
    List<FraudAlert> findByAlertType(String alertType);
    
    @Query("SELECT COUNT(f) FROM FraudAlert f WHERE f.status = :status")
    Long countByStatus(@Param("status") String status);
    
    @Query("SELECT f FROM FraudAlert f WHERE f.status = 'OPEN' ORDER BY f.severity DESC")
    List<FraudAlert> findOpenAlertsBySeverity();
}
