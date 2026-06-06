package com.ai.assistant.repository;

import com.ai.assistant.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for SupportTicket entity
 */
@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    
    Optional<SupportTicket> findByTicketNumber(String ticketNumber);
    
    List<SupportTicket> findByCustomerId(Long customerId);
    
    List<SupportTicket> findByStatus(String status);
    
    List<SupportTicket> findByPriority(String priority);
    
    List<SupportTicket> findByAssignedToId(Long employeeId);
    
    boolean existsByTicketNumber(String ticketNumber);
    
    @Query("SELECT COUNT(t) FROM SupportTicket t WHERE t.status = :status")
    Long countByStatus(@Param("status") String status);
    
    @Query("SELECT t FROM SupportTicket t WHERE t.status = 'OPEN' ORDER BY t.priority DESC")
    List<SupportTicket> findOpenTicketsByPriority();
}
