package com.shopping.shop.controller;

import com.shopping.common.entity.Product;
import com.shopping.common.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ProductRepository productRepository;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(productRepository.findByCategoryAndIsDeletedFalse(category));
        }
        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(productRepository.findByNameContainingIgnoreCaseAndIsDeletedFalse(search));
        }
        return ResponseEntity.ok(productRepository.findByIsDeletedFalse());
    }
}