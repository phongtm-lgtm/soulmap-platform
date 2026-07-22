package com.soulmap.server.service.impl;

import com.soulmap.server.common.enums.ErrorCode;
import com.soulmap.server.common.error.AiServiceException;
import com.soulmap.server.config.SoulmapAiProperties;
import com.soulmap.server.service.PromptTemplateService;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.io.InputStream;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PromptTemplateServiceImpl implements PromptTemplateService {
    private final SoulmapAiProperties properties;
    private final Map<String, String> cache = new ConcurrentHashMap<>();

    public PromptTemplateServiceImpl(SoulmapAiProperties properties) {
        this.properties = properties;
    }

    @Override
    public String loadPrompt(String relativePath) {
        return cache.computeIfAbsent(relativePath, this::readPrompt);
    }

    private String readPrompt(String relativePath) {
        try {
            String basePath = properties.getPrompts().getBasePath();
            if (basePath.startsWith("classpath:")) {
                String classpathBase = basePath.substring("classpath:".length()).replaceFirst("^/+", "");
                String resourcePath = classpathBase + "/" + relativePath.replace('\\', '/');
                ClassPathResource resource = new ClassPathResource(resourcePath);
                if (!resource.exists()) {
                    return "";
                }
                try (InputStream inputStream = resource.getInputStream()) {
                    return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
                }
            }

            Path promptPath = Path.of(basePath).resolve(relativePath).normalize();
            if (!Files.exists(promptPath)) {
                return "";
            }
            return Files.readString(promptPath, StandardCharsets.UTF_8);
        } catch (IOException exception) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0001, exception);
        }
    }
}
