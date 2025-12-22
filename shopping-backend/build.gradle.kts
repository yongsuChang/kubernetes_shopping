plugins {
    id("org.springframework.boot") version "3.4.1" apply false
    id("io.spring.dependency-management") version "1.1.7" apply false
    kotlin("jvm") version "1.9.25" apply false
}

allprojects {
    group = "com.shopping"
    version = "0.0.1-SNAPSHOT"

    repositories {
        mavenCentral()
    }
}

subprojects {
    apply(plugin = "java")
    apply(plugin = "io.spring.dependency-management")

    java {
        sourceCompatibility = JavaVersion.VERSION_21
    }

    configurations {
        compileOnly {
            extendsFrom(configurations.annotationProcessor.get())
        }
    }

    dependencies {
        compileOnly("org.projectlombok:lombok")
        annotationProcessor("org.projectlombok:lombok")
        testImplementation("org.springframework.boot:spring-boot-starter-test")
    }

    dependencyManagement {
        imports {
            mavenBom("org.springframework.boot:spring-boot-dependencies:3.4.1")
        }
        dependencies {
            dependency("io.jsonwebtoken:jjwt-api:0.12.3")
            dependency("io.jsonwebtoken:jjwt-impl:0.12.3")
            dependency("io.jsonwebtoken:jjwt-jackson:0.12.3")
        }
    }
}
