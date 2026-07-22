package com.soulmap.server.service;

import com.soulmap.server.dto.request.ai.TuViReadingRequest;
import com.soulmap.server.dto.response.ai.TuViReadingResponse;

public interface TuViAiService {
    TuViReadingResponse generateReading(TuViReadingRequest request);
}
