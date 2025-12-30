package com.shopping.shop.controller;

import com.shopping.shop.dto.VendorRegistrationRequest;
import com.shopping.shop.dto.VendorResponse;
import com.shopping.shop.dto.VendorStatsResponse;
import com.shopping.shop.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/shop-admin/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @PostMapping("/register")
    public ResponseEntity<String> registerVendor(
            @AuthenticationPrincipal String userEmail,
            @Valid @RequestBody VendorRegistrationRequest request) {
        vendorService.registerVendor(userEmail, request);
        return ResponseEntity.ok("Vendor registration submitted and pending approval");
    }

    @GetMapping("/me")
    public ResponseEntity<VendorResponse> getMyVendor(@AuthenticationPrincipal String userEmail) {
        return ResponseEntity.ok(VendorResponse.from(vendorService.getMyVendor(userEmail)));
    }

    @GetMapping("/{vendorId}/stats")
    public ResponseEntity<VendorStatsResponse> getVendorStats(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long vendorId) {
        return ResponseEntity.ok(vendorService.getVendorStats(userEmail, vendorId));
    }
}