package com.ai.assistant.repository;

import com.ai.assistant.entity.MarketingCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for MarketingCampaign entity
 */
@Repository
public interface MarketingCampaignRepository extends JpaRepository<MarketingCampaign, Long> {
    
    List<MarketingCampaign> findByStatus(String status);
    
    List<MarketingCampaign> findByStartDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT c FROM MarketingCampaign c WHERE c.status = 'ACTIVE' AND c.endDate >= :currentDate")
    List<MarketingCampaign> findActiveCampaigns(@Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT c FROM MarketingCampaign c WHERE c.startDate <= :currentDate AND c.endDate >= :currentDate")
    List<MarketingCampaign> findRunningCampaigns(@Param("currentDate") LocalDate currentDate);
}
