package com.shopping.shop.controller;

import com.shopping.shop.dto.ProductRequest;
import com.shopping.shop.dto.ProductResponse;
import com.shopping.shop.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/shop-admin/vendors/{vendorId}/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<String> createProduct(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long vendorId,
            @Valid @RequestBody ProductRequest request) {
        productService.createProduct(userEmail, vendorId, request);
        return ResponseEntity.ok("Product created successfully");
    }

    @PutMapping("/{productId}")
    public ResponseEntity<String> updateProduct(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long vendorId,
            @PathVariable Long productId,
            @Valid @RequestBody ProductRequest request) {
        productService.updateProduct(userEmail, vendorId, productId, request);
        return ResponseEntity.ok("Product updated successfully");
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getVendorProducts(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long vendorId) {
        return ResponseEntity.ok(productService.getVendorProducts(userEmail, vendorId).stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList()));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long vendorId,
            @PathVariable Long productId) {
        productService.deleteProduct(userEmail, vendorId, productId);
        return ResponseEntity.ok("Product deleted successfully");
    }
}
