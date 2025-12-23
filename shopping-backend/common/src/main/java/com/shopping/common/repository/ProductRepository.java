package com.shopping.common.repository;

import com.shopping.common.entity.Product;
import com.shopping.common.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByVendor(Vendor vendor);
    List<Product> findByIsDeletedFalse();
    List<Product> findByCategoryAndIsDeletedFalse(String category);
    List<Product> findByNameContainingIgnoreCaseAndIsDeletedFalse(String name);
}
