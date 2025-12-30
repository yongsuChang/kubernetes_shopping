package com.shopping.shop.controller;

import com.shopping.common.exception.BusinessException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
public class HealthCheckController {
    
    @GetMapping
    public String health() {
        return "Shop API is running";
    }

    @GetMapping("/test-error")
    public void testError() {
        throw new BusinessException("auth.user_not_found");
    }
}
