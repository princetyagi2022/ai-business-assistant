package com.ai.assistant.repository;

import com.ai.assistant.entity.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for ChatHistory entity
 */
@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    
    List<ChatHistory> findByUserId(Long userId);
    
    List<ChatHistory> findBySessionId(String sessionId);
    
    List<ChatHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT c FROM ChatHistory c WHERE c.user.id = :userId AND c.createdAt >= :startDate")
    List<ChatHistory> findByUserIdAndCreatedAtAfter(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate);
}
