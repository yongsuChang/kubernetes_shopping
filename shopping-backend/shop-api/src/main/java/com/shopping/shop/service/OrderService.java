package com.shopping.shop.service;

import com.shopping.common.entity.*;
import com.shopping.common.enums.OrderStatus;
import com.shopping.common.repository.*;
import com.shopping.shop.dto.OrderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final MemberRepository memberRepository;
    private final AddressRepository addressRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Transactional
    public void createOrder(String userEmail, OrderRequest request) {
        // ... (existing code)
        orderRepository.save(order);

        // Record initial history
        recordStatusHistory(order, null, OrderStatus.PENDING, "Order created");
    }

    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus newStatus, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        OrderStatus previousStatus = order.getStatus();
        if (previousStatus == newStatus) {
            return;
        }

        order.setStatus(newStatus);
        orderRepository.save(order);

        recordStatusHistory(order, previousStatus, newStatus, reason);
    }

    private void recordStatusHistory(Order order, OrderStatus prev, OrderStatus next, String reason) {
        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .previousStatus(prev)
                .newStatus(next)
                .reason(reason)
                .build();
        orderStatusHistoryRepository.save(history);
    }

    @Transactional(readOnly = true)
    public List<Order> getMyOrders(String userEmail) {
        Member member = memberRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return orderRepository.findByMember(member);
    }

    @Transactional(readOnly = true)
    public List<Order> getVendorOrders(String userEmail, Long vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        
        Member member = memberRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (!vendor.getOwner().getId().equals(member.getId())) {
            throw new RuntimeException("You are not the owner of this vendor");
        }

        return orderRepository.findByVendor(vendor);
    }

    @Transactional(readOnly = true)
    public List<OrderStatusHistory> getOrderHistory(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return orderStatusHistoryRepository.findByOrderOrderByCreatedAtDesc(order);
    }
}
