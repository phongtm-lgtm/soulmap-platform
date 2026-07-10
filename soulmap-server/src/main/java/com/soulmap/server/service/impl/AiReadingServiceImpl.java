package com.soulmap.server.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.soulmap.server.common.error.ResourceNotFoundException;
import com.soulmap.server.dto.response.ai.AiReadingResponse;
import com.soulmap.server.dto.response.ai.CareerReadingResponse;
import com.soulmap.server.entity.AiReading;
import com.soulmap.server.repository.AiReadingRepository;
import com.soulmap.server.service.AiReadingService;
import org.springframework.stereotype.Service;

@Service
public class AiReadingServiceImpl implements AiReadingService {
    private final AiReadingRepository aiReadingRepository;
    private final ObjectMapper objectMapper;

    public AiReadingServiceImpl(AiReadingRepository aiReadingRepository, ObjectMapper objectMapper) {
        this.aiReadingRepository = aiReadingRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public AiReadingResponse getReading(Long id) {
        AiReading reading = aiReadingRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);
        return toResponse(reading);
    }

    private AiReadingResponse toResponse(AiReading reading) {
        AiReadingResponse response = new AiReadingResponse();
        response.setId(reading.getId());
        response.setUserId(reading.getUserId());
        response.setType(reading.getType());
        response.setChapterId(reading.getChapterId());
        response.setChapterTitle(reading.getChapterTitle());
        response.setContent(reading.getContent());
        applyStructuredContent(reading, response);
        response.setCreatedAt(reading.getCreatedAt());
        response.setUpdatedAt(reading.getUpdatedAt());
        return response;
    }

    private void applyStructuredContent(AiReading reading, AiReadingResponse response) {
        if (!"CAREER_CHAPTER".equals(reading.getType()) || reading.getContent() == null || reading.getContent().isBlank()) {
            return;
        }

        try {
            CareerReadingResponse careerReading = objectMapper.readValue(reading.getContent(), CareerReadingResponse.class);
            response.setCareerPath(careerReading.getCareerPath());
            response.setGrowthDrivers(careerReading.getGrowthDrivers());
            response.setDeepReadingMarkdown(careerReading.getDeepReadingMarkdown());
            response.setContent(careerReading.getDeepReadingMarkdown());
        } catch (JsonProcessingException ignored) {
            // Older rows stored plain markdown/text in content; keep response.content as-is.
        }
    }
}
