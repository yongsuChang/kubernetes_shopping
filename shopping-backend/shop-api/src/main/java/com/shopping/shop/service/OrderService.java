package com.shopping.shop.service;

import com.shopping.common.entity.*;
import com.shopping.common.enums.OrderStatus;
import com.shopping.common.repository.*;
import com.shopping.common.utils.MessageUtils;
import com.shopping.shop.dto.OrderRequest;
import com.shopping.shop.dto.VendorStatsResponse;
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
    private final VendorRepository vendorRepository;
    private final MessageUtils messageUtils;

    @Transactional
    public void createOrder(String userEmail, OrderRequest request) {
        Member member = memberRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException(messageUtils.getMessage("auth.user_not_found")));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException(messageUtils.getMessage("product.not_found")));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getMember().getId().equals(member.getId())) {
            throw new RuntimeException(messageUtils.getMessage("order.wrong_address"));
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException(messageUtils.getMessage("product.out_of_stock"));
        }

        // Update stock
        product.setStockQuantity(product.getStockQuantity() - request.getQuantity());
        productRepository.save(product);

        Order order = Order.builder()
                .member(member)
                .vendor(product.getVendor())
                .product(product)
                .address(address)
                .quantity(request.getQuantity())
                .pricePerUnit(product.getPrice())
                .totalAmount(product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())))
                .status(OrderStatus.PENDING)
                .build();

        orderRepository.save(order);

        // Record initial history
        recordStatusHistory(order, null, OrderStatus.PENDING, "Order created");
    }

    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus newStatus, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException(messageUtils.getMessage("order.not_found")));
        
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
    public VendorStatsResponse getVendorStats(String userEmail, Long vendorId) {
        List<Order> orders = getVendorOrders(userEmail, vendorId);
        
        BigDecimal totalRevenue = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return VendorStatsResponse.builder()
                .totalOrders((long) orders.size())
                .totalRevenue(totalRevenue)
                .pendingOrders(orders.stream().filter(o -> o.getStatus() == OrderStatus.PENDING).count())
                .processingOrders(orders.stream().filter(o -> o.getStatus() == OrderStatus.PROCESSING).count())
                .shippedOrders(orders.stream().filter(o -> o.getStatus() == OrderStatus.SHIPPED).count())
                .deliveredOrders(orders.stream().filter(o -> o.getStatus() == OrderStatus.DELIVERED).count())
                .cancelledOrders(orders.stream().filter(o -> o.getStatus() == OrderStatus.CANCELLED).count())
                .build();
    }

    @Transactional(readOnly = true)
    public List<OrderStatusHistory> getOrderHistory(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return orderStatusHistoryRepository.findByOrderOrderByCreatedAtDesc(order);
    }
}