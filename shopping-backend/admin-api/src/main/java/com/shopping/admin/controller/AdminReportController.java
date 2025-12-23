package com.shopping.admin.controller;

import com.shopping.admin.dto.SystemReportResponse;
import com.shopping.admin.service.AdminReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/reports")
@RequiredArgsConstructor
public class AdminReportController {

    private final AdminReportService adminReportService;

    @GetMapping("/system")
    public ResponseEntity<SystemReportResponse> getSystemReport() {
        return ResponseEntity.ok(adminReportService.getSystemReport());
    }
}
