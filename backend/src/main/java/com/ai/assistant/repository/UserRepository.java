package com.ai.assistant.repository;

import com.ai.assistant.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.otp = :otp AND u.otpExpiry > CURRENT_TIMESTAMP")
    Optional<User> findByEmailAndOtp(@Param("email") String email, @Param("otp") String otp);
    
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.name = :roleName")
    java.util.List<User> findByRoleName(@Param("roleName") String roleName);

    @Query("""
            SELECT u FROM User u JOIN u.role r
            WHERE (:search IS NULL OR :search = '' OR
                   LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                   LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                   LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR
                   LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:role IS NULL OR :role = '' OR r.name = :role)
            """)
    Page<User> searchUsers(@Param("search") String search, @Param("role") String role, Pageable pageable);

    long countByEnabledTrue();
}
