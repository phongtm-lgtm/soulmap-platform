package com.soulmap.server.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(SoulmapAiProperties.class)
public class AiConfig {
}
