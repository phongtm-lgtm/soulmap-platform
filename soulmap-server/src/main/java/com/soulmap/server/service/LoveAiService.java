package com.soulmap.server.service;

import com.soulmap.server.dto.request.ai.LoveReadingRequest;
import com.soulmap.server.dto.response.ai.LoveReadingResponse;

public interface LoveAiService {
    LoveReadingResponse generateLoveReading(LoveReadingRequest request);
}
