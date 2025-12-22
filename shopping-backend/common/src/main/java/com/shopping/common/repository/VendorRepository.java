package com.shopping.common.repository;

import com.shopping.common.entity.Vendor;
import com.shopping.common.enums.VendorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    List<Vendor> findByStatus(VendorStatus status);
    boolean existsByName(String name);
}
