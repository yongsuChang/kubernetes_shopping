package com.shopping.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.shopping.admin", "com.shopping.common"})
@EntityScan(basePackages = {"com.shopping.common.entity"})
@EnableJpaRepositories(basePackages = {"com.shopping.admin.repository", "com.shopping.common.repository"})
@EnableJpaAuditing
public class AdminApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdminApiApplication.class, args);
    }
}
