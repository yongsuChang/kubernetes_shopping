package com.shopping.admin.service;

import com.shopping.admin.dto.ProductResponse;
import com.shopping.common.entity.Product;
import com.shopping.common.repository.ProductRepository;
import com.shopping.common.utils.MessageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;
    private final MessageUtils messageUtils;

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleProductStatus(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException(messageUtils.getMessage("product.not_found")));
        product.setDeleted(!product.isDeleted());
        productRepository.save(product);
    }
}
