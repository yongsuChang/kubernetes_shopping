plugins {
    id("org.springframework.boot")
    kotlin("jvm")
    id("io.spring.dependency-management")
}

dependencies {
    implementation(project(":common"))
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui")
    runtimeOnly("com.mysql:mysql-connector-j") // 운영 고려
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
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
