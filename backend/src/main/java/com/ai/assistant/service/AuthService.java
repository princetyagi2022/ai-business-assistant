package com.ai.assistant.service;

import com.ai.assistant.dto.JwtResponse;
import com.ai.assistant.dto.LoginRequest;
import com.ai.assistant.dto.RegisterRequest;
import com.ai.assistant.dto.UserDto;
import com.ai.assistant.entity.Role;
import com.ai.assistant.entity.User;
import com.ai.assistant.repository.RoleRepository;
import com.ai.assistant.repository.UserRepository;
import com.ai.assistant.security.CustomUserDetails;
import com.ai.assistant.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public AuthService(
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            UserRepository userRepository,
            RoleRepository roleRepository) {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public JwtResponse login(LoginRequest request) {
        String principal = request.getUsername().trim().toLowerCase(Locale.ROOT);
        User user = findUserByUsernameOrEmail(principal);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword()));
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        return toJwtResponse(token, userDetails.getUser());
    }

    @Transactional
    public UserDto register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        String username = buildUsername(request.getUsername(), email);

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username is already taken");
        }

        Role role = roleRepository.findByName(resolveRoleName(request.getRoleName()))
                .orElseThrow(() -> new IllegalStateException("Default role not found"));

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setPhone(request.getPhone());
        user.setRole(role);
        user.setEnabled(true);
        user.setEmailVerified(true);

        return toUserDto(userRepository.save(user));
    }

    public UserDto currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new UsernameNotFoundException("Authenticated user not found");
        }
        return toUserDto(userDetails.getUser());
    }

    private User findUserByUsernameOrEmail(String principal) {
        return userRepository.findByUsername(principal)
                .or(() -> userRepository.findByEmail(principal))
                .orElseThrow(() -> new UsernameNotFoundException("Invalid username or password"));
    }

    private String buildUsername(String requestedUsername, String email) {
        if (requestedUsername != null && !requestedUsername.isBlank()) {
            return requestedUsername.trim().toLowerCase(Locale.ROOT);
        }
        return email.substring(0, email.indexOf('@')).replaceAll("[^a-zA-Z0-9_]", "_").toLowerCase(Locale.ROOT);
    }

    private String resolveRoleName(String roleName) {
        if (roleName == null || roleName.isBlank()) {
            return "EMPLOYEE";
        }
        String normalized = roleName.trim().toUpperCase(Locale.ROOT).replace("ROLE_", "");
        if ("ADMIN".equals(normalized) || "MANAGER".equals(normalized) || "EMPLOYEE".equals(normalized)) {
            return normalized;
        }
        return "EMPLOYEE";
    }

    private JwtResponse toJwtResponse(String token, User user) {
        return new JwtResponse(
                token,
                "Bearer",
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                "ROLE_" + user.getRole().getName()
        );
    }

    private UserDto toUserDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                "ROLE_" + user.getRole().getName(),
                user.getEnabled(),
                user.getEmailVerified(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
