package com.shopping.admin.service;

import com.shopping.admin.dto.MemberResponse;
import com.shopping.common.entity.Member;
import com.shopping.common.enums.MemberStatus;
import com.shopping.common.repository.MemberRepository;
import com.shopping.common.utils.MessageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminMemberService {

    private final MemberRepository memberRepository;
    private final MessageUtils messageUtils;

    @Transactional(readOnly = true)
    public List<MemberResponse> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(MemberResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateMemberStatus(Long memberId, MemberStatus status) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException(messageUtils.getMessage("auth.user_not_found")));
        member.setStatus(status);
        memberRepository.save(member);
    }
}
