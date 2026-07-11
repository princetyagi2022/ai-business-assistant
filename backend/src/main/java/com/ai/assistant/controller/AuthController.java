package com.ai.assistant.controller;

import com.ai.assistant.dto.ApiResponse;
import com.ai.assistant.dto.JwtResponse;
import com.ai.assistant.dto.LoginRequest;
import com.ai.assistant.dto.RegisterRequest;
import com.ai.assistant.dto.UserDto;
import com.ai.assistant.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ApiResponse<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("Login successful", authService.login(request));
    }

    @PostMapping("/register")
    public ApiResponse<UserDto> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success("Account created successfully", authService.register(request));
    }

    @GetMapping("/me")
    public ApiResponse<UserDto> me() {
        return ApiResponse.success(authService.currentUser());
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Void>> refreshNotImplemented() {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body(ApiResponse.error("Token refresh is not required. Login again when the token expires."));
    }

    @PostMapping({"/forgot-password", "/reset-password", "/verify-email"})
    public ResponseEntity<ApiResponse<Void>> authWorkflowPlaceholder() {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                .body(ApiResponse.error("This workflow is not enabled yet."));
    }

    @ExceptionHandler({IllegalArgumentException.class, MethodArgumentNotValidException.class})
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(Exception exception) {
        String message = exception instanceof MethodArgumentNotValidException validationException
                ? validationException.getBindingResult().getFieldErrors().stream()
                        .findFirst()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .orElse("Invalid request")
                : exception.getMessage();
        return ResponseEntity.badRequest().body(ApiResponse.error(message));
    }

    @ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class})
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid username or password"));
    }
}
