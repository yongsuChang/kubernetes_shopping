package com.shopping.shop.dto;

import com.shopping.common.entity.Order;
import com.shopping.common.enums.OrderStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String productName;
    private Integer quantity;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private String shippingAddress;
    private LocalDateTime orderDate;

    public static OrderResponse from(Order order) {
        String addrStr = "No Address";
        if (order.getAddress() != null) {
            addrStr = String.format("%s, %s, %s", order.getAddress().getStreet(), order.getAddress().getCity(), order.getAddress().getCountry());
        }

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber("ORD-" + order.getId()) // UUID 대신 ID 기반 생성
                .customerName(order.getMember().getName())
                .customerEmail(order.getMember().getEmail())
                .productName(order.getProduct().getName())
                .quantity(order.getQuantity())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(addrStr)
                .orderDate(order.getCreatedAt())
                .build();
    }
}