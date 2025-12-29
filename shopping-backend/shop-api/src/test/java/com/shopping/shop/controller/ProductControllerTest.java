package com.shopping.shop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopping.common.enums.ProductStatus;
import com.shopping.shop.dto.ProductRequest;
import com.shopping.shop.service.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "vendor@test.com", roles = "SHOP_ADMIN")
    @DisplayName("상품 등록 성공")
    void createProduct_Success() throws Exception {
        ProductRequest request = new ProductRequest();
        request.setName("Test Product");
        request.setPrice(BigDecimal.valueOf(1000));
        request.setStockQuantity(10);
        request.setStatus(ProductStatus.AVAILABLE);

        mockMvc.perform(post("/api/v1/shop-admin/vendors/1/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Product created successfully"));
    }

    @Test
    @WithMockUser(username = "vendor@test.com", roles = "SHOP_ADMIN")
    @DisplayName("상품 등록 실패 - 필송 필드 누락 (Status)")
    void createProduct_ValidationFail() throws Exception {
        ProductRequest request = new ProductRequest();
        request.setName("Test Product");
        request.setPrice(BigDecimal.valueOf(1000));
        request.setStockQuantity(10);
        // status 누락

        mockMvc.perform(post("/api/v1/shop-admin/vendors/1/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
