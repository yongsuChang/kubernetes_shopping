package com.shopping.common.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attachment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String originalName; // 원본 파일명 (예: photo.png)

    @Column(nullable = false, unique = true)
    private String storedName;   // 저장용 파일명 (예: uuid.png)

    @Column(nullable = false)
    private String filePath;     // 실제 저장 경로 또는 URL

    private Long fileSize;       // 파일 크기 (바이트)

    private String contentType;  // 파일 타입 (예: image/png)
}
