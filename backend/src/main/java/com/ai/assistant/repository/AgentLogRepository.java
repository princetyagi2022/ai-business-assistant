package com.ai.assistant.repository;

import com.ai.assistant.entity.AgentLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for AgentLog entity
 */
@Repository
public interface AgentLogRepository extends JpaRepository<AgentLog, Long> {
    
    List<AgentLog> findByAgentName(String agentName);
    
    List<AgentLog> findByStatus(String status);
    
    List<AgentLog> findByUserId(Long userId);
    
    @Query("SELECT a FROM AgentLog a WHERE a.agentName = :agentName ORDER BY a.createdAt DESC")
    List<AgentLog> findByAgentNameOrderByCreatedAtDesc(@Param("agentName") String agentName);
    
    @Query("SELECT COUNT(a) FROM AgentLog a WHERE a.agentName = :agentName AND a.status = 'SUCCESS'")
    Long countSuccessfulExecutionsByAgent(@Param("agentName") String agentName);
    
    @Query("SELECT a FROM AgentLog a WHERE a.createdAt >= :startDate ORDER BY a.createdAt DESC")
    List<AgentLog> findRecentLogs(@Param("startDate") LocalDateTime startDate);
}
