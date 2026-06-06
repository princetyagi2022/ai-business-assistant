package com.ai.assistant.repository;

import com.ai.assistant.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Document entity
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    List<Document> findByDocumentType(String documentType);
    
    List<Document> findByUploadedById(Long userId);
    
    List<Document> findByIsIndexed(Boolean isIndexed);
    
    List<Document> findByTitleContainingIgnoreCase(String title);
    
    @Query("SELECT d FROM Document d WHERE d.documentType = :documentType AND d.isIndexed = true")
    List<Document> findIndexedDocumentsByType(@Param("documentType") String documentType);
}
