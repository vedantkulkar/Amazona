package com.amazona.service;

import com.amazona.dto.AuthResponse;
import com.amazona.dto.LoginRequest;
import com.amazona.dto.RegisterRequest;
import com.amazona.dto.UpdateUserRequest;
import com.amazona.model.User;

public interface UserService {
    AuthResponse signin(LoginRequest loginRequest);
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse updateUser(String id, UpdateUserRequest updateRequest);
    AuthResponse resetPassword(String email, String newPassword);
    User createAdminUser();
    User getUserById(String id);
}
