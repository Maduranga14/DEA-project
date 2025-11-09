package com.enterprise.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.util.StringUtils;

public class JwtCsrfRequestMatcher implements RequestMatcher {

    @Override
    public boolean matches(HttpServletRequest request) {
        String uri = request.getRequestURI();


        if (uri.endsWith("/auth/login") || uri.endsWith("/auth/register")) {
            return false;
        }


        String authHeader = request.getHeader("Authorization");
        boolean hasJwtHeader = StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ");


        if (hasJwtHeader) {
            return false;
        }


        String method = request.getMethod();
        return "POST".equals(method) || "PUT".equals(method) ||
                "DELETE".equals(method) || "PATCH".equals(method);
    }
}
