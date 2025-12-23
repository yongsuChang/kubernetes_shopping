package com.shopping.shop.dto;

import com.shopping.common.entity.OrderStatusHistory;
import com.shopping.common.enums.OrderStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class OrderStatusHistoryResponse {
    private Long id;
    private OrderStatus previousStatus;
    private OrderStatus newStatus;
    private String reason;
    private LocalDateTime createdAt;

    public static OrderStatusHistoryResponse from(OrderStatusHistory history) {
        return OrderStatusHistoryResponse.builder()
                .id(history.getId())
                .previousStatus(history.getPreviousStatus())
                .newStatus(history.getNewStatus())
                .reason(history.getReason())
                .createdAt(history.getCreatedAt())
                .build();
    }
}
