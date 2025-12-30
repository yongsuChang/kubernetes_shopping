package com.shopping.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String token = extractToken(request);

        // URL 파라미터로 토큰이 넘어온 경우 (Swagger 진입점)
        String queryToken = request.getParameter("token");
        if (queryToken != null) {
            // 1. 쿠키에 저장
            Cookie cookie = new Cookie("X-Auth-Token", queryToken);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(3600);
            response.addCookie(cookie);

            // 2. 토큰이 없는 깨끗한 URL로 리다이렉트 (URL 노출 방지)
            // Swagger UI 메인 페이지인 경우에만 리다이렉트 수행
            if (request.getRequestURI().endsWith("index.html") || request.getRequestURI().endsWith("swagger-ui/")) {
                response.sendRedirect(request.getRequestURI());
                return;
            }
            token = queryToken;
        }

        if (token != null && jwtUtils.validateToken(token)) {
            String username = jwtUtils.getUsername(token);
            String role = jwtUtils.getRole(token);
            
            String authority = role.startsWith("ROLE_") ? role : "ROLE_" + role;

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    username, null, List.of(new SimpleGrantedAuthority(authority)));
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("X-Auth-Token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}