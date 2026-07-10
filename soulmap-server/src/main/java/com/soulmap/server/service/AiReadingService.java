package com.soulmap.server.service;

import com.soulmap.server.dto.response.ai.AiReadingResponse;

public interface AiReadingService {
    AiReadingResponse getReading(Long id);
}
