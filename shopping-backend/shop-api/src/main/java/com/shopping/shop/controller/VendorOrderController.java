package com.shopping.shop.controller;

import com.shopping.common.entity.Order;
import com.shopping.common.enums.OrderStatus;
import com.shopping.shop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shop-admin/vendors/{vendorId}/orders")
@RequiredArgsConstructor
public class VendorOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getVendorOrders(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long vendorId) {
        return ResponseEntity.ok(orderService.getVendorOrders(userEmail, vendorId));
    }

    @GetMapping("/stats")
    public ResponseEntity<com.shopping.shop.dto.VendorStatsResponse> getVendorStats(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long vendorId) {
        return ResponseEntity.ok(orderService.getVendorStats(userEmail, vendorId));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(
            @AuthenticationPrincipal String userEmail,
            @PathVariable Long vendorId,
            @PathVariable Long orderId,
            @RequestParam OrderStatus status,
            @RequestParam(required = false) String reason) {
        // Validation: Verify if order belongs to the vendor
        List<Order> vendorOrders = orderService.getVendorOrders(userEmail, vendorId);
        boolean belongsToVendor = vendorOrders.stream()
                .anyMatch(o -> o.getId().equals(orderId));
        
        if (!belongsToVendor) {
            throw new RuntimeException("Order does not belong to this vendor");
        }

        orderService.updateOrderStatus(orderId, status, reason);
        return ResponseEntity.ok("Order status updated successfully");
    }
}
