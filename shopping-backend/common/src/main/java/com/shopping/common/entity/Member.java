package com.shopping.common.entity;

import com.shopping.common.enums.MemberStatus;
import com.shopping.common.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String uuid;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    private LocalDate dateOfBirth;

    private String gender;

    @Enumerated(EnumType.STRING)
    private MemberStatus status;

    private String profilePictureUrl;

    @Builder.Default
    private boolean isDeleted = false;
}
