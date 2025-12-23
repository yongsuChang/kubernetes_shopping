package com.shopping.admin.controller;

import com.shopping.admin.dto.VendorResponse;
import com.shopping.admin.service.AdminVendorService;
import com.shopping.common.enums.VendorStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/vendors")
@RequiredArgsConstructor
public class AdminVendorController {

    private final AdminVendorService adminVendorService;

    @GetMapping
    public ResponseEntity<List<VendorResponse>> getAllVendors() {
        return ResponseEntity.ok(adminVendorService.getAllVendors());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<VendorResponse>> getPendingVendors() {
        return ResponseEntity.ok(adminVendorService.getPendingVendors());
    }

    @PatchMapping("/{vendorId}/status")
    public ResponseEntity<String> updateVendorStatus(
            @PathVariable Long vendorId,
            @RequestParam VendorStatus status) {
        adminVendorService.updateVendorStatus(vendorId, status);
        return ResponseEntity.ok("Vendor status updated to " + status);
    }

    @PostMapping("/{vendorId}/approve")
    public ResponseEntity<String> approveVendor(@PathVariable Long vendorId) {
        adminVendorService.approveVendor(vendorId);
        return ResponseEntity.ok("Vendor approved");
    }

    @PostMapping("/{vendorId}/reject")
    public ResponseEntity<String> rejectVendor(@PathVariable Long vendorId) {
        adminVendorService.rejectVendor(vendorId);
        return ResponseEntity.ok("Vendor rejected");
    }
}
