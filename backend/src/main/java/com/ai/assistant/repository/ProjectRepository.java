package com.ai.assistant.repository;

import com.ai.assistant.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("""
            SELECT p FROM Project p
            WHERE (:search IS NULL OR :search = '' OR
                   LOWER(p.projectName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                   LOWER(p.clientName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                   LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:status IS NULL OR :status = '' OR p.status = :status)
            AND (:client IS NULL OR :client = '' OR LOWER(p.clientName) LIKE LOWER(CONCAT('%', :client, '%')))
            AND (:category IS NULL OR :category = '' OR p.category = :category)
            AND (:fromDate IS NULL OR p.deadline >= :fromDate)
            AND (:toDate IS NULL OR p.deadline <= :toDate)
            """)
    Page<Project> searchProjects(
            @Param("search") String search,
            @Param("status") String status,
            @Param("client") String client,
            @Param("category") String category,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            Pageable pageable);

    long countByStatus(String status);

    List<Project> findByDeadlineBeforeAndStatusNot(LocalDate deadline, String status);
}
