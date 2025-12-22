package com.shopping.common.repository;

import com.shopping.common.entity.Address;
import com.shopping.common.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByMember(Member member);
}
