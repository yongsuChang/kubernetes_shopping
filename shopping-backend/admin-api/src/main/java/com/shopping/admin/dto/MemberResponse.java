package com.shopping.admin.dto;

import com.shopping.common.entity.Member;
import com.shopping.common.enums.MemberStatus;
import com.shopping.common.enums.Role;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MemberResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private MemberStatus status;
    private LocalDateTime createdAt;

    public static MemberResponse from(Member member) {
        return MemberResponse.builder()
                .id(member.getId())
                .name(member.getName())
                .email(member.getEmail())
                .role(member.getRole())
                .status(member.getStatus())
                .createdAt(member.getCreatedAt())
                .build();
    }
}
