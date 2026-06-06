package com.ai.assistant.repository;

import com.ai.assistant.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Category entity
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    Optional<Category> findByName(String name);
    
    List<Category> findByParentIsNull();
    
    List<Category> findByParentId(Long parentId);
    
    @Query("SELECT c FROM Category c WHERE c.parent IS NULL")
    List<Category> findRootCategories();
    
    @Query("SELECT c FROM Category c WHERE c.parent.id = :parentId")
    List<Category> findSubCategories(@Param("parentId") Long parentId);
}
