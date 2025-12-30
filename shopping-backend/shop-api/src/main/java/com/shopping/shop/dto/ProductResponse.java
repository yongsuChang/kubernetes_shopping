package com.shopping.shop.dto;

import com.shopping.common.entity.Product;
import com.shopping.common.enums.Category;
import com.shopping.common.enums.ProductStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private Category category;
    private ProductStatus status;
    private String vendorName;
    private String imageUrl;

    public static ProductResponse from(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .category(product.getCategory())
                .status(product.getStatus())
                .vendorName(product.getVendor() != null ? product.getVendor().getName() : "Unknown")
                .imageUrl(product.getImageUrl())
                .build();
    }
}
