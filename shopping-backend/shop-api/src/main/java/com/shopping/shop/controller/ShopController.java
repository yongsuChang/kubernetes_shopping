package com.shopping.shop.controller;

import com.shopping.common.entity.Order;
import com.shopping.common.entity.Product;
import com.shopping.common.repository.ProductRepository;
import com.shopping.shop.dto.OrderRequest;
import com.shopping.shop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shop")
@RequiredArgsConstructor
public class ShopController {

    private final OrderService orderService;
    private final ProductRepository productRepository;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findByIsDeletedFalse());
    }

    @PostMapping("/orders")
    public ResponseEntity<String> createOrder(
            @AuthenticationPrincipal String userEmail,
            @Valid @RequestBody OrderRequest request) {
        orderService.createOrder(userEmail, request);
        return ResponseEntity.ok("Order placed successfully");
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal String userEmail) {
        return ResponseEntity.ok(orderService.getMyOrders(userEmail));
    }
}
