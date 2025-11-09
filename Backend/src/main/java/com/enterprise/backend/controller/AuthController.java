package com.enterprise.backend.controller;

import com.enterprise.backend.dto.AuthResponse;
import com.enterprise.backend.dto.LoginRequest;
import com.enterprise.backend.dto.RegisterRequest;
import com.enterprise.backend.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request,
            HttpServletResponse response) {
        try {
            AuthResponse authResponse = authService.authenticateUser(loginRequest);


            Cookie jwtCookie = new Cookie("jwt", authResponse.getToken());
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(false);
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(24 * 60 * 60);
            response.addCookie(jwtCookie);


            HttpSession session = request.getSession(true);
            session.setAttribute("authenticated", true);
            session.setAttribute("userEmail", authResponse.getEmail());
            session.setAttribute("userRole", authResponse.getRole());


            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        String result = authService.registerUser(signUpRequest);

        Map<String, String> response = new HashMap<>();
        response.put("message", result);

        if (result.equals("Username already exists") || result.equals("Email already exists")) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {

        Cookie jwtCookie = new Cookie("jwt", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0); // Delete cookie
        response.addCookie(jwtCookie);


        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        Map<String, String> result = new HashMap<>();
        result.put("message", "Logged out successfully");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/session-info")
    public ResponseEntity<?> getSessionInfo(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Map<String, Object> info = new HashMap<>();

        if (session != null) {
            info.put("sessionId", session.getId());
            info.put("authenticated", session.getAttribute("authenticated"));
            info.put("userEmail", session.getAttribute("userEmail"));
            info.put("userRole", session.getAttribute("userRole"));
            info.put("creationTime", session.getCreationTime());
            info.put("lastAccessedTime", session.getLastAccessedTime());
        } else {
            info.put("message", "No active session");
        }

        return ResponseEntity.ok(info);
    }
}
