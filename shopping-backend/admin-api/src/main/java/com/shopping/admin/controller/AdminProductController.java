package com.shopping.admin.controller;

import com.shopping.admin.dto.ProductResponse;
import com.shopping.admin.service.AdminProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(adminProductService.getAllProducts());
    }

    @PatchMapping("/{productId}/toggle-status")
    public ResponseEntity<String> toggleProductStatus(@PathVariable Long productId) {
        adminProductService.toggleProductStatus(productId);
        return ResponseEntity.ok("Product status toggled");
    }
}
