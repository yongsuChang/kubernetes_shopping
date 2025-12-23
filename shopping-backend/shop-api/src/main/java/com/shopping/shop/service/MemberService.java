package com.shopping.shop.service;

import com.shopping.common.entity.Member;
import com.shopping.common.enums.MemberStatus;
import com.shopping.common.repository.MemberRepository;
import com.shopping.common.security.JwtUtils;
import com.shopping.shop.dto.LoginRequest;
import com.shopping.shop.dto.LoginResponse;
import com.shopping.shop.dto.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public void signup(SignupRequest request) {
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
