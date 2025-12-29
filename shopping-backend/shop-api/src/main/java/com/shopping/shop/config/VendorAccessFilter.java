package com.shopping.shop.config;

import com.shopping.common.entity.Member;
import com.shopping.common.entity.Vendor;
import com.shopping.common.enums.VendorStatus;
import com.shopping.common.repository.MemberRepository;
import com.shopping.common.repository.VendorRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

/**
 * Filter to block vendors who are not yet approved (status != ACTIVE).
 * Only applies to members with ROLE_SHOP_ADMIN.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class VendorAccessFilter extends OncePerRequestFilter {

    private final MemberRepository memberRepository;
    private final VendorRepository vendorRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated()) {
            boolean isShopAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_SHOP_ADMIN"));

            if (isShopAdmin) {
                String email = auth.getName();
                
                // Check vendor status
                Optional<Member> memberOpt = memberRepository.findByEmail(email);
                boolean isAllowed = false;
                
                if (memberOpt.isPresent()) {
                    Optional<Vendor> vendorOpt = vendorRepository.findByOwner(memberOpt.get());
                    if (vendorOpt.isPresent()) {
                        isAllowed = vendorOpt.get().getStatus() == VendorStatus.ACTIVE;
                    }
                }

                if (!isAllowed) {
                    log.warn("Access denied for unapproved vendor admin: {}", email);
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Vendor is not active or pending approval.\"}");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Allow health check, auth, and registration
        return path.startsWith("/api/v1/auth/") || 
               path.startsWith("/api/v1/health") ||
               path.equals("/api/v1/shop-admin/vendors/register") ||
               path.equals("/api/v1/shop-admin/vendors/me");
    }
}