package com.shopping.shop.dto;

import com.shopping.common.entity.Vendor;
import com.shopping.common.enums.VendorStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VendorResponse {
    private Long id;
    private String name;
    private String description;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String websiteUrl;
    private VendorStatus status;

    public static VendorResponse from(Vendor vendor) {
        return VendorResponse.builder()
                .id(vendor.getId())
                .name(vendor.getName())
                .description(vendor.getDescription())
                .contactEmail(vendor.getContactEmail())
                .contactPhone(vendor.getContactPhone())
                .address(vendor.getAddress())
                .websiteUrl(vendor.getWebsiteUrl())
                .status(vendor.getStatus())
                .build();
    }
}
