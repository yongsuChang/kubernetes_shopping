package com.shopping.shop.controller;

import com.shopping.common.entity.Product;
import com.shopping.common.enums.Category;
import com.shopping.common.repository.ProductRepository;
import com.shopping.shop.dto.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ProductRepository productRepository;

    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        
        List<Product> products;
        
        if (category != null && !category.isEmpty()) {
            try {
                Category categoryEnum = Category.valueOf(category.toUpperCase());
                products = productRepository.findByCategoryAndIsDeletedFalse(categoryEnum);
            } catch (IllegalArgumentException e) {
                // 잘못된 카테고리 요청 시 빈 리스트 또는 전체 리스트
                products = List.of();
            }
        } else if (search != null && !search.isEmpty()) {
            products = productRepository.findByNameContainingIgnoreCaseAndIsDeletedFalse(search);
        } else {
            products = productRepository.findByIsDeletedFalse();
        }

        return ResponseEntity.ok(products.stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList()));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .filter(p -> !p.isDeleted())
                .map(ProductResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}