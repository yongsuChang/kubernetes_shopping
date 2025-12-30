package com.shopping.shop.controller;

import com.shopping.common.entity.Attachment;
import com.shopping.shop.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/shop/images")
@RequiredArgsConstructor
public class ImageUploadController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) {
        Attachment attachment = fileService.uploadImage(file);
        return ResponseEntity.ok(Map.of(
            "imageId", attachment.getId(),
            "imageUrl", "/api/v1/shop/images/" + attachment.getStoredName(),
            "originalName", attachment.getOriginalName()
        ));
    }
}