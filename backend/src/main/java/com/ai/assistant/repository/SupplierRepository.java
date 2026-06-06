package com.ai.assistant.repository;

import com.ai.assistant.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Supplier entity
 */
@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    
    Optional<Supplier> findByName(String name);
    
    List<Supplier> findByCity(String city);
    
    List<Supplier> findByCountry(String country);
    
    List<Supplier> findByNameContainingIgnoreCase(String name);
}
