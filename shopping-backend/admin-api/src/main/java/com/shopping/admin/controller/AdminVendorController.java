package com.shopping.admin.controller;

import com.shopping.admin.dto.VendorResponse;
import com.shopping.admin.service.AdminVendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/vendors")
@RequiredArgsConstructor
public class AdminVendorController {

    private final AdminVendorService adminVendorService;

    @GetMapping("/pending")
    public ResponseEntity<List<VendorResponse>> getPendingVendors() {
        return ResponseEntity.ok(adminVendorService.getPendingVendors());
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
