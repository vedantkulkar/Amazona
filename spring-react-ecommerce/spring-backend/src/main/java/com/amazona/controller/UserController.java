package com.amazona.controller;

import com.amazona.dto.AuthResponse;
import com.amazona.dto.LoginRequest;
import com.amazona.dto.RegisterRequest;
import com.amazona.dto.UpdateUserRequest;
import com.amazona.model.User;
import com.amazona.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
@Tag(name = "User Management", description = "Endpoints for user authentication, registration, profile updates, and admin creation")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signin")
    @Operation(summary = "Authenticate user and return JWT token")
    public ResponseEntity<AuthResponse> signin(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(userService.signin(loginRequest));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(userService.register(registerRequest));
    }

    @RequestMapping(value = "/forgot-password", method = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.GET})
    @Operation(summary = "Request password reset / verify email")
    public ResponseEntity<?> forgotPassword(@RequestBody(required = false) java.util.Map<String, String> body) {
        String email = body != null ? body.get("email") : null;
        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("message", "Password reset instructions sent to " + (email != null ? email : ""));
        resp.put("email", email);
        return ResponseEntity.ok(resp);
    }

    @RequestMapping(value = "/reset-password", method = {RequestMethod.POST, RequestMethod.PUT})
    @Operation(summary = "Reset user password with new password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody java.util.Map<String, String> body) {
        String email = body != null ? body.get("email") : null;
        String password = body != null ? body.get("password") : null;
        return ResponseEntity.ok(userService.resetPassword(email, password));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user profile")
    public ResponseEntity<AuthResponse> updateUser(@PathVariable String id, @RequestBody UpdateUserRequest updateRequest) {
        return ResponseEntity.ok(userService.updateUser(id, updateRequest));
    }

    @GetMapping("/createadmin")
    @Operation(summary = "Seed default admin user account")
    public ResponseEntity<User> createAdmin() {
        return ResponseEntity.ok(userService.createAdminUser());
    }
}
