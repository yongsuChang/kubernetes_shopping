package com.shopping.admin.dto;

import com.shopping.common.entity.Product;
import com.shopping.common.enums.Category;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private Category category;
    private String vendorName;
    private boolean isDeleted;
    private LocalDateTime createdAt;

    public static ProductResponse from(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .category(product.getCategory())
                .vendorName(product.getVendor().getName())
                .isDeleted(product.isDeleted())
                .createdAt(product.getCreatedAt())
                .build();
    }
}