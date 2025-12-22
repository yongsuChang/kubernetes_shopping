package com.shopping.common.entity;

import com.shopping.common.enums.VendorStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vendors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_member_id")
    private Member owner;

    @Enumerated(EnumType.STRING)
    private VendorStatus status;

    private String contactEmail;
    private String contactPhone;
    
    @Column(columnDefinition = "TEXT")
    private String address;

    private String logoUrl;
    private String websiteUrl;

    @Column(columnDefinition = "TEXT")
    private String socialMediaLinks;

    @Builder.Default
    private boolean isDeleted = false;
}
