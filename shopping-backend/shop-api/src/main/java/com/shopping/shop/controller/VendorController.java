package com.shopping.shop.controller;

import com.shopping.shop.dto.VendorRegistrationRequest;
import com.shopping.shop.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
