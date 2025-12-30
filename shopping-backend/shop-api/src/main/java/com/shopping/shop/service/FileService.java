package com.shopping.shop.service;

import com.shopping.common.entity.Attachment;
import com.shopping.common.repository.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

    private final AttachmentRepository attachmentRepository;

    @Value("${upload.path}")
    private String uploadPath;

    @Transactional
    public Attachment uploadImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Cannot upload empty file");
        }

        try {
            Path root = Paths.get(uploadPath);
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            String storedName = UUID.randomUUID().toString() + extension;
            Path targetPath = root.resolve(storedName);

            // 1. 파일 저장
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            
            // 2. 메타데이터 DB 기록
            Attachment attachment = Attachment.builder()
                    .originalName(originalFilename)
                    .storedName(storedName)
                    .filePath(targetPath.toString())
                    .fileSize(file.getSize())
                    .contentType(file.getContentType())
                    .build();

            return attachmentRepository.save(attachment);
        } catch (IOException e) {
            log.error("Failed to store file", e);
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }
}