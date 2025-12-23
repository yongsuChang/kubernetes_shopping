package com.shopping.admin.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyStatsResponse {
    private String date;
    private long count;
    private BigDecimal amount;
}
