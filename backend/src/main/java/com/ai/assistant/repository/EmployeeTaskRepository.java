package com.ai.assistant.repository;

import com.ai.assistant.entity.EmployeeTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for EmployeeTask entity
 */
@Repository
public interface EmployeeTaskRepository extends JpaRepository<EmployeeTask, Long> {
    
    List<EmployeeTask> findByEmployeeId(Long employeeId);
    
    List<EmployeeTask> findByStatus(String status);
    
    List<EmployeeTask> findByPriority(String priority);
    
    List<EmployeeTask> findByDueDateBefore(LocalDate date);
    
    @Query("SELECT t FROM EmployeeTask t WHERE t.employee.id = :employeeId AND t.status = 'PENDING' ORDER BY t.dueDate ASC")
    List<EmployeeTask> findPendingTasksByEmployee(@Param("employeeId") Long employeeId);
    
    @Query("SELECT COUNT(t) FROM EmployeeTask t WHERE t.employee.id = :employeeId AND t.status = 'PENDING'")
    Long countPendingTasksByEmployee(@Param("employeeId") Long employeeId);
}
