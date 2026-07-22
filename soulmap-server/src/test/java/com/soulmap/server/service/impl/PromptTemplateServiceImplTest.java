package com.soulmap.server.service.impl;

import com.soulmap.server.config.SoulmapAiProperties;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PromptTemplateServiceImplTest {

    @Test
    void loadsTuViPromptFromClasspath() {
        SoulmapAiProperties properties = new SoulmapAiProperties();
        properties.getPrompts().setBasePath("classpath:prompts");
        PromptTemplateServiceImpl service = new PromptTemplateServiceImpl(properties);

        String prompt = service.loadPrompt("tuvi/full-reading.md");

        assertThat(prompt)
                .contains("Luận giải Tử Vi Đẩu Số")
                .contains("profile.name")
                .contains("BƯỚC 7");
    }
}
