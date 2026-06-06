package com.ai.assistant.repository;

import com.ai.assistant.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Report entity
 */
@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByReportType(String reportType);
    
    List<Report> findByGeneratedById(Long userId);
    
    List<Report> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT r FROM Report r WHERE r.generatedBy.id = :userId ORDER BY r.createdAt DESC")
    List<Report> findByGeneratedByOrderByCreatedAtDesc(@Param("userId") Long userId);
}
