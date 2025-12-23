package com.shopping.common.repository;

import com.shopping.common.entity.Order;
import com.shopping.common.entity.Member;
import com.shopping.common.entity.Vendor;
import com.shopping.common.dto.StatisticsProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByMember(Member member);
    List<Order> findByVendor(Vendor vendor);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status != 'CANCELLED'")
    BigDecimal sumTotalAmount();

    @Query(value = "SELECT DATE(createdAt) as date, COUNT(*) as count, SUM(total_amount) as amount " +
                   "FROM orders WHERE status != 'CANCELLED' " +
                   "GROUP BY DATE(createdAt) ORDER BY date DESC LIMIT 30", nativeQuery = true)
    List<StatisticsProjection> findDailySales();
}
