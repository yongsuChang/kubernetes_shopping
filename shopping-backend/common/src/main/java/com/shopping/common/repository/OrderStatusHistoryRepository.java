package com.shopping.common.repository;

import com.shopping.common.entity.Order;
import com.shopping.common.entity.OrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Long> {
    List<OrderStatusHistory> findByOrderOrderByCreatedAtDesc(Order order);
}
