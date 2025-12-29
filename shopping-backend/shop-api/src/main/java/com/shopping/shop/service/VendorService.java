package com.shopping.shop.service;

import com.shopping.common.entity.Member;
import com.shopping.common.entity.Vendor;
import com.shopping.common.enums.VendorStatus;
import com.shopping.common.repository.MemberRepository;
import com.shopping.common.repository.VendorRepository;
import com.shopping.common.repository.MemberRepository;
import com.shopping.common.repository.VendorRepository;
import com.shopping.common.repository.OrderRepository;
import com.shopping.common.enums.OrderStatus;
import com.shopping.shop.dto.VendorRegistrationRequest;
import com.shopping.shop.dto.VendorStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;
    private final MemberRepository memberRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public VendorStatsResponse getVendorStats(String userEmail, Long vendorId) {
        Vendor vendor = getMyVendor(userEmail);
        if (!vendor.getId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized access to vendor stats");
        }

        BigDecimal totalRevenue = orderRepository.sumTotalAmountByVendor(vendor);
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        return VendorStatsResponse.builder()
                .totalOrders(orderRepository.countByVendor(vendor))
                .totalRevenue(totalRevenue)
                .pendingOrders(orderRepository.countByVendorAndStatus(vendor, OrderStatus.PENDING))
                .processingOrders(orderRepository.countByVendorAndStatus(vendor, OrderStatus.PROCESSING))
                .shippedOrders(orderRepository.countByVendorAndStatus(vendor, OrderStatus.SHIPPED))
                .deliveredOrders(orderRepository.countByVendorAndStatus(vendor, OrderStatus.DELIVERED))
                .cancelledOrders(orderRepository.countByVendorAndStatus(vendor, OrderStatus.CANCELLED))
                .build();
    }

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

    @Transactional(readOnly = true)
    public Vendor getMyVendor(String userEmail) {
        Member member = memberRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return vendorRepository.findByOwner(member)
                .orElseThrow(() -> new RuntimeException("Vendor not registered for this user"));
    }
}