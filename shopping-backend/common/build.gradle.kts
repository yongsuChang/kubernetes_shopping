plugins {
    `java-library`
    kotlin("jvm")
    id("io.spring.dependency-management")
}

dependencies {
    // Spring Boot Starters
    api("org.springframework.boot:spring-boot-starter-data-jpa")
    api("org.springframework.boot:spring-boot-starter-security")
    api("org.springframework.boot:spring-boot-starter-validation")
    api("org.springframework.boot:spring-boot-starter-web") // HttpServletRequest 등을 위해 추가

    // Lombok
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    testCompileOnly("org.projectlombok:lombok")
    testAnnotationProcessor("org.projectlombok:lombok")

    // JWT
    api("io.jsonwebtoken:jjwt-api")
    runtimeOnly("io.jsonwebtoken:jjwt-impl")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson")

    // Swagger
    api("org.springdoc:springdoc-openapi-starter-webmvc-ui")
}

java {
    sourceCompatibility = JavaVersion.VERSION_21
}

dependencyManagement {
    imports {
        mavenBom("org.springframework.boot:spring-boot-dependencies:3.4.1")
    }
    dependencies {
        dependency("io.jsonwebtoken:jjwt-api:0.12.3")
        dependency("io.jsonwebtoken:jjwt-impl:0.12.3")
        dependency("io.jsonwebtoken:jjwt-jackson:0.12.3")
        dependency("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.7.0")
    }
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        jvmTarget = "21"
    }
}