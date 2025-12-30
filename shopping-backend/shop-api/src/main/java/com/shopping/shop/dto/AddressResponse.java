package com.shopping.shop.dto;

import com.shopping.common.entity.Address;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AddressResponse {
    private Long id;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private String fullAddress;

    public static AddressResponse from(Address address) {
        String full = String.format("%s, %s, %s, %s", address.getStreet(), address.getCity(), address.getState(), address.getCountry());
        return AddressResponse.builder()
                .id(address.getId())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .zipCode(address.getZipCode())
                .country(address.getCountry())
                .fullAddress(full)
                .build();
    }
}