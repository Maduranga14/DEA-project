package com.enterprise.backend.service;

import com.enterprise.backend.dto.AuthResponse;
import com.enterprise.backend.dto.LoginRequest;
import com.enterprise.backend.dto.RegisterRequest;
import com.enterprise.backend.entity.Role;
import com.enterprise.backend.entity.User;
import com.enterprise.backend.repository.UserRepository;
import com.enterprise.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = (User) authentication.getPrincipal();

        return new AuthResponse(jwt, user.getUsername(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole().name());
    }

    public String registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return "Username already exists";
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return "Email already exists";
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName());

        if ("client".equalsIgnoreCase(signUpRequest.getUserType())) {
            user.setRole(Role.CLIENT);
        } else {
            user.setRole(Role.FREELANCER);
        }

        userRepository.save(user);

        return "User registered successfully";
    }
}
