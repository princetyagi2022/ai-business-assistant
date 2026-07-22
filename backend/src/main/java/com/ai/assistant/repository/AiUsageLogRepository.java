package com.ai.assistant.repository;

import com.ai.assistant.entity.AiUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiUsageLogRepository extends JpaRepository<AiUsageLog, Long> {

    long count();

    long countByCreatedAtAfter(java.time.LocalDateTime after);
}
