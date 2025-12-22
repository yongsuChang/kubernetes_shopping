package com.shopping.admin.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class HealthCheckController {
    @GetMapping("/health")
    public String health() {
        return "Admin API is running";
    }
}
