package com.shopping.shop.service;

import com.shopping.common.entity.Member;
import com.shopping.common.entity.Vendor;
import com.shopping.common.enums.Role;
import com.shopping.common.repository.MemberRepository;
import com.shopping.common.repository.VendorRepository;
import com.shopping.common.security.JwtUtils;
import com.shopping.shop.dto.LoginRequest;
import com.shopping.shop.dto.LoginResponse;
import com.shopping.shop.dto.SignupRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private VendorRepository vendorRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private MemberService memberService;

    @Test
    @DisplayName("일반 사용자 회원가입 성공 - 업체 생성 안됨")
    void signup_User_Success() {
        // given
        SignupRequest request = new SignupRequest();
        request.setEmail("user@test.com");
        request.setPassword("password");
        request.setName("User");
        request.setRole(Role.ROLE_USER);

        when(memberRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        // when
        memberService.signup(request);

        // then
        verify(memberRepository, times(1)).save(any(Member.class));
        verify(vendorRepository, never()).save(any(Vendor.class));
    }

    @Test
    @DisplayName("입점 업체 회원가입 성공 - 업체 자동 생성")
    void signup_Vendor_Success() {
        // given
        SignupRequest request = new SignupRequest();
        request.setEmail("vendor@test.com");
        request.setPassword("password");
        request.setName("Vendor Owner");
        request.setRole(Role.ROLE_SHOP_ADMIN);
        request.setVendorName("My Shop");

        when(memberRepository.existsByEmail(anyString())).thenReturn(false);
        when(vendorRepository.existsByName(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        // when
        memberService.signup(request);

        // then
        verify(memberRepository, times(1)).save(any(Member.class));
        verify(vendorRepository, times(1)).save(any(Vendor.class));
    }

    @Test
    @DisplayName("회원가입 실패 - 중복 이메일")
    void signup_DuplicateEmail_Fail() {
        // given
        SignupRequest request = new SignupRequest();
        request.setEmail("duplicate@test.com");

        when(memberRepository.existsByEmail(anyString())).thenReturn(true);

        // when & then
        assertThrows(RuntimeException.class, () -> memberService.signup(request));
    }

    @Test
    @DisplayName("로그인 성공 - 토큰 반환")
    void login_Success() {
        // given
        LoginRequest request = new LoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("password");

        Member member = Member.builder()
                .email("user@test.com")
                .password("encodedPassword")
                .role(Role.ROLE_USER)
                .build();

        when(memberRepository.findByEmail(anyString())).thenReturn(Optional.of(member));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtils.createToken(anyString(), anyString())).thenReturn("mock-token");

        // when
        LoginResponse response = memberService.login(request);

        // then
        assertNotNull(response);
        assertEquals("mock-token", response.getToken());
        assertEquals(Role.ROLE_USER.name(), response.getRole());
    }

    @Test
    @DisplayName("로그인 실패 - 잘못된 비밀번호")
    void login_InvalidPassword_Fail() {
        // given
        LoginRequest request = new LoginRequest();
        request.setEmail("user@test.com");
        request.setPassword("wrong");

        Member member = Member.builder()
                .email("user@test.com")
                .password("encodedPassword")
                .build();

        when(memberRepository.findByEmail(anyString())).thenReturn(Optional.of(member));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // when & then
        assertThrows(RuntimeException.class, () -> memberService.login(request));
    }
}
