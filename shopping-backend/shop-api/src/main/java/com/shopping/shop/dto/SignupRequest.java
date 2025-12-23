package com.shopping.shop.dto;

import com.shopping.common.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private Role role;

    // Optional Vendor Info (for ROLE_SHOP_ADMIN)
    private String vendorName;
    private String vendorDescription;
    private String vendorEmail;
    private String vendorPhone;
    private String vendorAddress;
}