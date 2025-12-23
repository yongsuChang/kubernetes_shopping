package com.shopping.admin.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemReportResponse {
    private BigDecimal totalSales;
    private long totalUsers;
    private long totalVendors;
    private long pendingVendorApprovals;
    
    private List<DailyStatsResponse> dailySales;
    private List<DailyStatsResponse> dailyUserRegistrations;
    private List<DailyStatsResponse> dailyVendorRegistrations;
}
