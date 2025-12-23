package com.shopping.common.dto;

import java.math.BigDecimal;

public interface StatisticsProjection {
    String getDate();
    Long getCount();
    BigDecimal getAmount();
}
