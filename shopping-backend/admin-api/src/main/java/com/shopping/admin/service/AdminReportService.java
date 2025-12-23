package com.shopping.admin.service;

import com.shopping.admin.dto.DailyStatsResponse;
import com.shopping.admin.dto.SystemReportResponse;
import com.shopping.common.dto.StatisticsProjection;
import com.shopping.common.enums.VendorStatus;
import com.shopping.common.repository.MemberRepository;
import com.shopping.common.repository.OrderRepository;
import com.shopping.common.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminReportService {

    private final OrderRepository orderRepository;
    private final MemberRepository memberRepository;
    private final VendorRepository vendorRepository;

    public SystemReportResponse getSystemReport() {
        BigDecimal totalSales = orderRepository.sumTotalAmount();
        if (totalSales == null) totalSales = BigDecimal.ZERO;
        
        long totalUsers = memberRepository.count();
        long totalVendors = vendorRepository.count();
        long pendingVendors = vendorRepository.countByStatus(VendorStatus.PENDING);

        List<DailyStatsResponse> dailySales = orderRepository.findDailySales().stream()
                .map(this::mapToDailyStats)
                .collect(Collectors.toList());

        List<DailyStatsResponse> dailyUsers = memberRepository.findDailyRegistrations().stream()
                .map(this::mapToDailyStats)
                .collect(Collectors.toList());

        List<DailyStatsResponse> dailyVendors = vendorRepository.findDailyRegistrations().stream()
                .map(this::mapToDailyStats)
                .collect(Collectors.toList());

        return SystemReportResponse.builder()
                .totalSales(totalSales)
                .totalUsers(totalUsers)
                .totalVendors(totalVendors)
                .pendingVendorApprovals(pendingVendors)
                .dailySales(dailySales)
                .dailyUserRegistrations(dailyUsers)
                .dailyVendorRegistrations(dailyVendors)
                .build();
    }

    private DailyStatsResponse mapToDailyStats(StatisticsProjection projection) {
        return DailyStatsResponse.builder()
                .date(projection.getDate())
                .count(projection.getCount())
                .amount(projection.getAmount())
                .build();
    }
}
