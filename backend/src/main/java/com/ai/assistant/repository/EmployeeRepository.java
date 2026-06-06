package com.ai.assistant.repository;

import com.ai.assistant.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Employee entity
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmployeeId(String employeeId);
    
    List<Employee> findByDepartment(String department);
    
    List<Employee> findByPosition(String position);
    
    List<Employee> findByStatus(String status);
    
    List<Employee> findByManagerId(Long managerId);
    
    boolean existsByEmployeeId(String employeeId);
    
    @Query("SELECT e FROM Employee e WHERE e.department = :department AND e.status = 'ACTIVE'")
    List<Employee> findActiveEmployeesByDepartment(@Param("department") String department);
    
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department = :department")
    Long countByDepartment(@Param("department") String department);
}
