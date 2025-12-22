package com.shopping.common.repository;

import com.shopping.common.entity.Order;
import com.shopping.common.entity.Member;
import com.shopping.common.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByMember(Member member);
    List<Order> findByVendor(Vendor vendor);
}
