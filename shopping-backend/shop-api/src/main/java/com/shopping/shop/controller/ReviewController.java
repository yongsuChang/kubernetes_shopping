package com.shopping.shop.controller;

import com.shopping.shop.dto.ReviewRequest;
import com.shopping.shop.dto.ReviewResponse;
import com.shopping.shop.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shop/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<String> createReview(
            @AuthenticationPrincipal String userEmail,
            @Valid @RequestBody ReviewRequest request) {
        reviewService.createReview(userEmail, request);
        return ResponseEntity.ok("Review submitted successfully");
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }
}
