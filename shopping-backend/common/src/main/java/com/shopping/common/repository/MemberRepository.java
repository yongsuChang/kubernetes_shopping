package com.shopping.common.repository;

import com.shopping.common.entity.Member;
import com.shopping.common.dto.StatisticsProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query(value = "SELECT DATE(created_at) as date, COUNT(*) as count, 0 as amount " +
                   "FROM members " +
                   "GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30", nativeQuery = true)
    List<StatisticsProjection> findDailyRegistrations();
}
