package com.shopping.shop.service;

import com.shopping.common.entity.Order;
import com.shopping.common.entity.Product;
import com.shopping.common.entity.Review;
import com.shopping.common.enums.OrderStatus;
import com.shopping.common.repository.OrderRepository;
import com.shopping.common.repository.ProductRepository;
import com.shopping.common.repository.ReviewRepository;
import com.shopping.shop.dto.ReviewRequest;
import com.shopping.shop.dto.ReviewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public void createReview(String userEmail, ReviewRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getMember().getEmail().equals(userEmail)) {
            throw new RuntimeException("Not your order");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("Only delivered orders can be reviewed");
        }

        if (reviewRepository.existsByOrderId(order.getId())) {
            throw new RuntimeException("Review already exists for this order");
        }

        Review review = Review.builder()
                .member(order.getMember())
                .product(order.getProduct())
                .order(order)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        reviewRepository.save(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getProductReviews(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        return reviewRepository.findByProductAndIsDeletedFalseOrderByCreatedAtDesc(product).stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }
}
