package com.amazona;

import com.amazona.dto.AuthResponse;
import com.amazona.dto.LoginRequest;
import com.amazona.dto.RegisterRequest;
import com.amazona.exception.BadRequestException;
import com.amazona.model.User;
import com.amazona.repository.UserRepository;
import com.amazona.security.JwtTokenProvider;
import com.amazona.service.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    private JwtTokenProvider tokenProvider;

    private UserServiceImpl userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", "somethingsecret_must_be_at_least_256_bits_long_for_hmac_sha256");

        userService = new UserServiceImpl(userRepository, tokenProvider);

        testUser = new User("usr_1", "Test User", "test@example.com", "1234", false);
    }

    @Test
    void testSignin_Success() {
        LoginRequest req = new LoginRequest("test@example.com", "1234");
        when(userRepository.findByEmailAndPassword("test@example.com", "1234")).thenReturn(Optional.of(testUser));

        AuthResponse response = userService.signin(req);

        assertNotNull(response);
        assertEquals("test@example.com", response.getEmail());
        assertNotNull(response.getToken());
    }

    @Test
    void testSignin_WrongPassword_ThrowsBadRequestException() {
        LoginRequest req = new LoginRequest("test@example.com", "wrongpass");
        when(userRepository.findByEmailAndPassword("test@example.com", "wrongpass")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        assertThrows(BadRequestException.class, () -> userService.signin(req));
    }

    @Test
    void testRegister_Success() {
        RegisterRequest req = new RegisterRequest("New User", "new@example.com", "1234");
        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        AuthResponse response = userService.register(req);

        assertNotNull(response);
        assertNotNull(response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegister_DuplicateEmail_ThrowsException() {
        RegisterRequest req = new RegisterRequest("Existing", "test@example.com", "1234");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        assertThrows(BadRequestException.class, () -> userService.register(req));
    }
}
