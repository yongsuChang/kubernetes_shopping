package com.shopping.shop;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("dev")
public class ConfigImportTest {

    @Value("${spring.datasource.url:#{null}}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:#{null}}")
    private String datasourceUsername;

    @Value("${spring.datasource.password:#{null}}")
    private String datasourcePassword;

    @Value("${jwt.secret:#{null}}")
    private String jwtSecret;

    @Test
    void testConfigLoaded() {
        System.out.println("=== Loaded Configuration ===");
        System.out.println("Datasource URL: " + datasourceUrl);
        System.out.println("Datasource Username: " + datasourceUsername);
        System.out.println("JWT Secret: " + (jwtSecret != null ? "PRESENT" : "MISSING"));
        System.out.println("============================");

        assertNotNull(datasourceUrl, "Datasource URL should be loaded from Parameter Store");
        assertNotNull(datasourceUsername, "Datasource Username should be loaded from Parameter Store");
    }
}
