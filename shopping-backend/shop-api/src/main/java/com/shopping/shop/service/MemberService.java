package com.shopping.shop.service;

import com.shopping.common.entity.Member;
import com.shopping.common.entity.Vendor;
import com.shopping.common.enums.MemberStatus;
import com.shopping.common.enums.Role;
import com.shopping.common.enums.VendorStatus;
import com.shopping.common.repository.MemberRepository;
import com.shopping.common.repository.VendorRepository;
import com.shopping.common.security.JwtUtils;
import com.shopping.shop.dto.LoginRequest;
import com.shopping.shop.dto.LoginResponse;
import com.shopping.shop.dto.SignupRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final VendorRepository vendorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public void signup(SignupRequest request) {
        log.info("Starting signup process for email: {}, role: {}", request.getEmail(), request.getRole());
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Member member = Member.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .uuid(UUID.randomUUID().toString())
                .status(MemberStatus.ACTIVE)
                .build();

        memberRepository.save(member);
        log.info("Member saved with ID: {}", member.getId());

        // ROLE_SHOP_ADMIN인 경우 Vendor 정보 자동 생성
        if (request.getRole() == Role.ROLE_SHOP_ADMIN) {
            log.info("Role is ROLE_SHOP_ADMIN, attempting to create vendor: {}", request.getVendorName());
            String vName = request.getVendorName() != null && !request.getVendorName().isEmpty() 
                    ? request.getVendorName() : request.getName() + "'s Shop";
            
            if (vendorRepository.existsByName(vName)) {
                log.error("Vendor name already exists: {}", vName);
                throw new RuntimeException("Vendor name already exists");
            }

            Vendor vendor = Vendor.builder()
                    .name(vName)
                    .description(request.getVendorDescription())
                    .contactEmail(request.getVendorEmail() != null && !request.getVendorEmail().isEmpty() 
                            ? request.getVendorEmail() : request.getEmail())
                    .contactPhone(request.getVendorPhone())
                    .address(request.getVendorAddress())
                    .owner(member)
                    .status(VendorStatus.PENDING)
                    .build();

            vendorRepository.save(vendor);
            log.info("Vendor saved with ID: {}", vendor.getId());
        } else {
            log.info("Role is not ROLE_SHOP_ADMIN, skipping vendor creation. Actual role: {}", request.getRole());
        }
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtils.createToken(member.getEmail(), member.getRole().name());
        return new LoginResponse(token, member.getEmail(), member.getRole().name());
    }
}