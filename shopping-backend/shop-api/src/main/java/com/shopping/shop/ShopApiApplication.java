package com.shopping.shop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.shopping.shop", "com.shopping.common"})
@EntityScan(basePackages = {"com.shopping.common.entity"})
@EnableJpaRepositories(basePackages = {"com.shopping.shop.repository", "com.shopping.common.repository"})
@EnableJpaAuditing
public class ShopApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShopApiApplication.class, args);
    }
}
