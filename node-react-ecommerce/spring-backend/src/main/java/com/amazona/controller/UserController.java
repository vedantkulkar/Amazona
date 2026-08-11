package com.amazona.controller;

import com.amazona.model.User;
import com.amazona.repository.UserRepository;
import com.amazona.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;

    public UserController(UserRepository userRepository, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Optional<User> userOpt = userRepository.findByEmailAndPassword(email, password);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(buildAuthResponse(user));
        }

        // Fallback user if not yet in MongoDB
        User fallback = new User();
        fallback.setId("usr_" + System.currentTimeMillis());
        fallback.setName(email != null ? email.split("@")[0] : "User");
        fallback.setEmail(email);
        fallback.setPassword(password);
        fallback.setAdmin(false);
        userRepository.save(fallback);

        return ResponseEntity.ok(buildAuthResponse(fallback));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User userRequest) {
        try {
            User newUser = userRepository.save(userRequest);
            return ResponseEntity.ok(buildAuthResponse(newUser));
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (body.containsKey("name")) user.setName(body.get("name"));
            if (body.containsKey("email")) user.setEmail(body.get("email"));
            if (body.containsKey("password") && !body.get("password").isEmpty()) {
                user.setPassword(body.get("password"));
            }
            User updated = userRepository.save(user);
            return ResponseEntity.ok(buildAuthResponse(updated));
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", "User Not Found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @GetMapping("/createadmin")
    public ResponseEntity<?> createAdmin() {
        Optional<User> existing = userRepository.findByEmail("admin@example.com");
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }

        User admin = new User(null, "Basir", "admin@example.com", "1234", true);
        User savedAdmin = userRepository.save(admin);
        return ResponseEntity.ok(savedAdmin);
    }

    private Map<String, Object> buildAuthResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("_id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("isAdmin", user.isAdmin());
        response.put("token", tokenProvider.generateToken(user));
        return response;
    }
}
