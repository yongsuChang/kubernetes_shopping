package com.shopping.shop.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VendorRegistrationRequest {
    @NotBlank
    private String name;

    private String description;

    @NotBlank
    @Email
    private String contactEmail;

    @NotBlank
    private String contactPhone;

    private String address;
    private String websiteUrl;
}
