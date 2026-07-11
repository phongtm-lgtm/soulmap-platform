package com.soulmap.server.service;

import com.soulmap.server.dto.request.ai.CareerReadingRequest;
import com.soulmap.server.dto.response.ai.CareerReadingResponse;
import com.soulmap.server.dto.response.ai.CareerTalentReadingResponse;

public interface CareerAiService {
    CareerReadingResponse generateCareerReading(CareerReadingRequest request);

    CareerTalentReadingResponse generateCareerTalentReading(CareerReadingRequest request);
}
