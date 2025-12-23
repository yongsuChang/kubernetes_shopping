package com.shopping.shop.controller;

import com.shopping.common.entity.Vendor;
import com.shopping.shop.dto.VendorRegistrationRequest;
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
    public ResponseEntity<Vendor> getMyVendor(@AuthenticationPrincipal String userEmail) {
        return ResponseEntity.ok(vendorService.getMyVendor(userEmail));
    }
}
