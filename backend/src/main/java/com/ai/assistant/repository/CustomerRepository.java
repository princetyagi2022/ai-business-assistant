package com.ai.assistant.repository;

import com.ai.assistant.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Customer entity
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByEmail(String email);
    
    List<Customer> findByCustomerSegment(String segment);
    
    List<Customer> findByCity(String city);
    
    List<Customer> findByFirstNameContainingIgnoreCase(String firstName);
    
    List<Customer> findByLastNameContainingIgnoreCase(String lastName);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT c FROM Customer c ORDER BY c.totalPurchases DESC")
    List<Customer> findTopCustomersByPurchases();
    
    @Query("SELECT c FROM Customer c WHERE c.totalPurchases > :amount")
    List<Customer> findCustomersWithPurchasesAbove(@Param("amount") Double amount);
}
