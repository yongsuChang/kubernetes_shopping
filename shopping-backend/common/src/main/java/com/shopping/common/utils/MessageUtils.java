package com.shopping.common.utils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Slf4j
@RequiredArgsConstructor
public class MessageUtils {

    private final MessageSource messageSource;

    public String getMessage(String code) {
        return getMessage(code, null);
    }

    public String getMessage(String code, Object[] args) {
        return getMessage(code, args, LocaleContextHolder.getLocale());
    }

    public String getMessage(String code, Object[] args, Locale locale) {
        log.info("Requested Locale: {}", locale);
        String message = messageSource.getMessage(code, args, locale);
        log.info("Resolved message: {}", message);
        return message;
    }
}
