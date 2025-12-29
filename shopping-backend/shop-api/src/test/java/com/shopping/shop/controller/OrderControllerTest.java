package com.shopping.shop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopping.shop.dto.OrderRequest;
import com.shopping.shop.service.OrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "user@test.com")
    @DisplayName("주문 생성 성공")
    void createOrder_Success() throws Exception {
        OrderRequest request = new OrderRequest();
        request.setProductId(1L);
        request.setAddressId(1L);
        request.setQuantity(1);

        mockMvc.perform(post("/api/v1/shop/orders")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Order created successfully"));
    }

    @Test
    @WithMockUser(username = "user@test.com")
    @DisplayName("내 주문 내역 조회 성공")
    void getMyOrders_Success() throws Exception {
        when(orderService.getMyOrders(anyString())).thenReturn(new ArrayList<>());

        mockMvc.perform(get("/api/v1/shop/orders/me"))
                .andExpect(status().isOk());
    }
}
