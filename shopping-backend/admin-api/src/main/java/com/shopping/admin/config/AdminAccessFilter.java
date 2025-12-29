package com.shopping.admin.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Filter for strict admin access control.
 * Checks for SUPER_ADMIN role and prepares for IP-based filtering.
 */
@Slf4j
@org.springframework.stereotype.Component
public class AdminAccessFilter extends OncePerRequestFilter {

    // TODO: Move to configuration/database in the future
    private static final List<String> ALLOWED_IP_WHITELIST = List.of(
            "127.0.0.1",
            "0:0:0:0:0:0:0:1"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        
        // Only apply to admin API paths
        if (path.startsWith("/api/v1/admin")) {
            String clientIp = getClientIp(request);
            log.debug("Admin access attempt from IP: {} for path: {}", clientIp, path);

            // 1. IP Whitelist Check (Strict Blocking Disabled Temporarily for Debugging)
            /*
            if (!isIpAllowed(clientIp)) {
                log.warn("Access denied from unauthorized IP: {}", clientIp);
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Access denied from this IP address.\"}");
                return;
            }
            */

            // 2. Strong Role Check
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            log.info("AdminAccessFilter - Path: {}, Auth: {}, Authorities: {}", 
                path, 
                auth != null ? auth.getName() : "null", 
                auth != null ? auth.getAuthorities() : "none");

            if (auth == null || !auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN"))) {
                log.error("Non-admin access blocked for path: {} by user: {}", path, auth != null ? auth.getName() : "anonymous");
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Admin access required");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isIpAllowed(String ip) {
        // Simple check, can be expanded to CIDR ranges
        return ALLOWED_IP_WHITELIST.contains(ip);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
