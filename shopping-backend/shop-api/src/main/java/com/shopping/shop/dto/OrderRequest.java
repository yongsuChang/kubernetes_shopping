package com.shopping.shop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {
    @NotNull
    private Long productId;

    @NotNull
    private Long addressId;

    @NotNull
    @Min(1)
    private Integer quantity;
}
