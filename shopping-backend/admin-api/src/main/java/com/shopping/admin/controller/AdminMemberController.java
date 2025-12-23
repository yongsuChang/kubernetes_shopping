package com.shopping.admin.controller;

import com.shopping.admin.dto.MemberResponse;
import com.shopping.admin.service.AdminMemberService;
import com.shopping.common.enums.MemberStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/members")
@RequiredArgsConstructor
public class AdminMemberController {

    private final AdminMemberService adminMemberService;

    @GetMapping
    public ResponseEntity<List<MemberResponse>> getAllMembers() {
        return ResponseEntity.ok(adminMemberService.getAllMembers());
    }

    @PatchMapping("/{memberId}/status")
    public ResponseEntity<String> updateMemberStatus(
            @PathVariable Long memberId,
            @RequestParam MemberStatus status) {
        adminMemberService.updateMemberStatus(memberId, status);
        return ResponseEntity.ok("Member status updated to " + status);
    }
}
