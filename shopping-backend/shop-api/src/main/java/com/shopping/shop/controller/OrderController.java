package com.shopping.shop.controller;

import com.shopping.common.entity.Order;
import com.shopping.common.enums.OrderStatus;
import com.shopping.shop.dto.OrderRequest;
import com.shopping.shop.dto.OrderStatusHistoryResponse;
import com.shopping.shop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/shop/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<String> createOrder(
            @AuthenticationPrincipal String userEmail,
            @RequestBody OrderRequest request) {
        orderService.createOrder(userEmail, request);
        return ResponseEntity.ok("Order created successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal String userEmail) {
        return ResponseEntity.ok(orderService.getMyOrders(userEmail));
    }

    @GetMapping("/{orderId}/history")
    public ResponseEntity<List<OrderStatusHistoryResponse>> getOrderHistory(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderHistory(orderId).stream()
                .map(OrderStatusHistoryResponse::from)
                .collect(Collectors.toList()));
    }

    // This would typically be in a separate VendorOrderController, but for simplicity:
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status,
            @RequestParam(required = false) String reason) {
        orderService.updateOrderStatus(orderId, status, reason);
        return ResponseEntity.ok("Order status updated to " + status);
    }
}
