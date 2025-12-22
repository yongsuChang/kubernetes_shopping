package com.shopping.shop.service;

import com.shopping.common.entity.*;
import com.shopping.common.enums.OrderStatus;
import com.shopping.common.repository.*;
import com.shopping.shop.dto.OrderRequest;
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

    @Transactional
    public void createOrder(String userEmail, OrderRequest request) {
        Member member = memberRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getMember().getId().equals(member.getId())) {
            throw new RuntimeException("Address does not belong to you");
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Not enough stock");
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
    }

    @Transactional(readOnly = true)
    public List<Order> getMyOrders(String userEmail) {
        Member member = memberRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return orderRepository.findByMember(member);
    }
}
