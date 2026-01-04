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

        // 1. 이미 인증된 SHOP_ADMIN 권한 보유자인 경우에만 체크
        if (auth != null && auth.isAuthenticated()) {
            boolean isShopAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_SHOP_ADMIN"));

            if (isShopAdmin) {
                String email = auth.getName();
                
                // 2. 캐시를 피하기 위해 DB에서 최신 상태를 직접 확인
                Optional<Member> memberOpt = memberRepository.findByEmail(email);
                boolean isAllowed = false;
                
                if (memberOpt.isPresent()) {
                    Optional<Vendor> vendorOpt = vendorRepository.findByOwner(memberOpt.get());
                    if (vendorOpt.isPresent()) {
                        isAllowed = vendorOpt.get().getStatus() == VendorStatus.ACTIVE;
                    }
                }

                // 3. 승인되지 않은 경우 403 리턴
                if (!isAllowed) {
                    log.warn("Access denied for unapproved vendor: {}", email);
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"error\": \"Your vendor account is pending approval.\"}");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Skip filter for public paths
        if (path.startsWith("/api/v1/auth/") || 
            path.startsWith("/api/v1/health") ||
            path.startsWith("/api/v1/shop/products")) {
            return true;
        }

        // Allow pending vendors to access registration and status check
        if (path.equals("/api/v1/shop-admin/vendors/register") || 
            path.equals("/api/v1/shop-admin/vendors/me")) {
            return true;
        }

        return false;
    }
}
