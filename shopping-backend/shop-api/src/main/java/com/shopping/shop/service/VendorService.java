package com.shopping.shop.service;

import com.shopping.common.entity.Member;
import com.shopping.common.entity.Vendor;
import com.shopping.common.enums.VendorStatus;
import com.shopping.common.repository.MemberRepository;
import com.shopping.common.repository.VendorRepository;
import com.shopping.shop.dto.VendorRegistrationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void registerVendor(String userEmail, VendorRegistrationRequest request) {
        Member member = memberRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (vendorRepository.existsByName(request.getName())) {
            throw new RuntimeException("Vendor name already exists");
        }

        Vendor vendor = Vendor.builder()
                .name(request.getName())
                .description(request.getDescription())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .address(request.getAddress())
                .websiteUrl(request.getWebsiteUrl())
                .owner(member)
                .status(VendorStatus.PENDING)
                .build();

        vendorRepository.save(vendor);
    }
}
