package com.shopping.shop.service;

import com.shopping.common.entity.Member;
import com.shopping.common.entity.Product;
import com.shopping.common.entity.Vendor;
import com.shopping.common.repository.MemberRepository;
import com.shopping.common.repository.ProductRepository;
import com.shopping.common.repository.VendorRepository;
import com.shopping.shop.dto.ProductRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final VendorRepository vendorRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void createProduct(String userEmail, Long vendorId, ProductRequest request) {
        Vendor vendor = getVendorAndCheckOwnership(userEmail, vendorId);

        Product product = Product.builder()
                .vendor(vendor)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .category(request.getCategory())
                .status(request.getStatus())
                .build();

        productRepository.save(product);
    }

    @Transactional
    public void updateProduct(String userEmail, Long vendorId, Long productId, ProductRequest request) {
        getVendorAndCheckOwnership(userEmail, vendorId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getVendor().getId().equals(vendorId)) {
            throw new RuntimeException("Product does not belong to this vendor");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(request.getCategory());
        product.setStatus(request.getStatus());

        productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public List<Product> getVendorProducts(String userEmail, Long vendorId) {
        Vendor vendor = getVendorAndCheckOwnership(userEmail, vendorId);
        return productRepository.findByVendor(vendor);
    }

    @Transactional
    public void deleteProduct(String userEmail, Long vendorId, Long productId) {
        getVendorAndCheckOwnership(userEmail, vendorId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getVendor().getId().equals(vendorId)) {
            throw new RuntimeException("Product does not belong to this vendor");
        }

        product.setDeleted(true);
        productRepository.save(product);
    }

    private Vendor getVendorAndCheckOwnership(String userEmail, Long vendorId) {
        Member member = memberRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        if (!vendor.getOwner().getId().equals(member.getId())) {
            throw new RuntimeException("You are not the owner of this vendor");
        }
        return vendor;
    }
}
