package com.shopping.shop.service;

import com.shopping.common.entity.*;
import com.shopping.common.enums.OrderStatus;
import com.shopping.common.repository.*;
import com.shopping.shop.dto.OrderRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private MemberRepository memberRepository;
    @Mock
    private AddressRepository addressRepository;
    @Mock
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    @DisplayName("주문 생성 성공 - 재고 차감 및 히스토리 기록")
    void createOrder_Success() {
        // given
        String email = "user@test.com";
        OrderRequest request = new OrderRequest();
        request.setProductId(1L);
        request.setAddressId(1L);
        request.setQuantity(2);

        Member member = Member.builder().id(1L).email(email).build();
        Vendor vendor = Vendor.builder().id(1L).build();
        Product product = Product.builder()
                .id(1L)
                .price(BigDecimal.valueOf(1000))
                .stockQuantity(10)
                .vendor(vendor)
                .build();
        Address address = Address.builder().id(1L).member(member).build();

        when(memberRepository.findByEmail(email)).thenReturn(Optional.of(member));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));

        // when
        orderService.createOrder(email, request);

        // then
        verify(productRepository, times(1)).save(argThat(p -> p.getStockQuantity() == 8));
        verify(orderRepository, times(1)).save(any(Order.class));
        verify(orderStatusHistoryRepository, times(1)).save(any(OrderStatusHistory.class));
    }

    @Test
    @DisplayName("주문 실패 - 재고 부족")
    void createOrder_InsufficientStock_Fail() {
        // given
        String email = "user@test.com";
        OrderRequest request = new OrderRequest();
        request.setProductId(1L);
        request.setAddressId(1L);
        request.setQuantity(20); // 재고보다 많음

        Member member = Member.builder().id(1L).email(email).build();
        Product product = Product.builder()
                .id(1L)
                .stockQuantity(10)
                .build();
        Address address = Address.builder().id(1L).member(member).build();

        when(memberRepository.findByEmail(email)).thenReturn(Optional.of(member));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));

        // when & then
        assertThrows(RuntimeException.class, () -> orderService.createOrder(email, request));
    }

    @Test
    @DisplayName("주문 실패 - 타인의 배송지 사용")
    void createOrder_WrongAddress_Fail() {
        // given
        String email = "user@test.com";
        OrderRequest request = new OrderRequest();
        request.setProductId(1L);
        request.setAddressId(1L);
        request.setQuantity(1);

        Member member = Member.builder().id(1L).email(email).build();
        Member otherMember = Member.builder().id(2L).build();
        Product product = Product.builder().id(1L).stockQuantity(10).build();
        Address address = Address.builder().id(1L).member(otherMember).build();

        when(memberRepository.findByEmail(email)).thenReturn(Optional.of(member));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));

        // when & then
        assertThrows(RuntimeException.class, () -> orderService.createOrder(email, request));
    }
}
