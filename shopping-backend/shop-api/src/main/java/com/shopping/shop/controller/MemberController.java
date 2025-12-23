package com.shopping.shop.controller;

import com.shopping.common.entity.Address;
import com.shopping.common.entity.Member;
import com.shopping.common.repository.AddressRepository;
import com.shopping.common.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shop/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberRepository memberRepository;
    private final AddressRepository addressRepository;

    @GetMapping("/addresses")
    public ResponseEntity<List<Address>> getMyAddresses(@AuthenticationPrincipal String userEmail) {
        Member member = memberRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return ResponseEntity.ok(addressRepository.findByMember(member));
    }

    @PostMapping("/addresses")
    public ResponseEntity<Address> addAddress(
            @AuthenticationPrincipal String userEmail,
            @RequestBody Address address) {
        Member member = memberRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        address.setMember(member);
        return ResponseEntity.ok(addressRepository.save(address));
    }
}
