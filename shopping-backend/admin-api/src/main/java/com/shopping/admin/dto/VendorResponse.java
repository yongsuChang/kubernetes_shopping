package com.shopping.admin.dto;

import com.shopping.common.entity.Vendor;
import com.shopping.common.enums.VendorStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VendorResponse {
    private Long id;
    private String name;
    private String ownerName;
    private String ownerEmail;
    private VendorStatus status;
    private String contactEmail;

    public static VendorResponse from(Vendor vendor) {
        VendorResponse response = new VendorResponse();
        response.setId(vendor.getId());
        response.setName(vendor.getName());
        response.setOwnerName(vendor.getOwner().getName());
        response.setOwnerEmail(vendor.getOwner().getEmail());
        response.setStatus(vendor.getStatus());
        response.setContactEmail(vendor.getContactEmail());
        return response;
    }
}
