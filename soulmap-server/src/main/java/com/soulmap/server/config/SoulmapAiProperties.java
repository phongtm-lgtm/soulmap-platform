package com.soulmap.server.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "soulmap.ai")
public class SoulmapAiProperties {
    private String provider = "9router";
    private String baseUrl;
    private String apiKey;
    private String model;
    private int timeoutSeconds = 60;
    private double temperature = 0.4;
    private String structuredOutputMode = "json_object";
    private String careerPromptPack = "core";
    private PromptProperties prompts = new PromptProperties();

    @Getter
    @Setter
    public static class PromptProperties {
        private String basePath = "../docs/promt";
    }
}
