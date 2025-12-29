package com.shopping.common.config;

import com.shopping.common.exception.GlobalExceptionHandler;
import com.shopping.common.utils.MessageUtils;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CommonConfig {

    @Bean
    public MessageUtils messageUtils(MessageSource messageSource) {
        return new MessageUtils(messageSource);
    }

    @Bean
    public GlobalExceptionHandler globalExceptionHandler(MessageUtils messageUtils) {
        return new GlobalExceptionHandler(messageUtils);
    }
}
