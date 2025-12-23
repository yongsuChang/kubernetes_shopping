package com.shopping.shop.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class VendorStatsResponse {
    private Long totalOrders;
    private BigDecimal totalRevenue;
    private Long pendingOrders;
    private Long processingOrders;
    private Long shippedOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
}
