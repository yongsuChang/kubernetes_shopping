package com.shopping.admin.service;

import com.shopping.admin.dto.VendorResponse;
import com.shopping.common.entity.Vendor;
import com.shopping.common.enums.VendorStatus;
import com.shopping.common.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminVendorService {

    private final VendorRepository vendorRepository;

    @Transactional(readOnly = true)
    public List<VendorResponse> getPendingVendors() {
        return vendorRepository.findByStatus(VendorStatus.PENDING).stream()
                .map(VendorResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void approveVendor(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        vendor.setStatus(VendorStatus.ACTIVE);
        vendorRepository.save(vendor);
    }

    @Transactional
    public void rejectVendor(Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        vendor.setStatus(VendorStatus.INACTIVE);
        vendorRepository.save(vendor);
    }
}
