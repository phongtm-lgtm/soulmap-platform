package com.soulmap.server.controller;

import com.soulmap.server.dto.request.ai.CareerReadingRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.ai.CareerReadingResponse;
import com.soulmap.server.service.CareerAiService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai/career")
@CrossOrigin(origins = "*")
public class CareerAiController {
    private final CareerAiService careerAiService;

    public CareerAiController(CareerAiService careerAiService) {
        this.careerAiService = careerAiService;
    }

    @PostMapping("/readings")
    public ApiResponse<CareerReadingResponse> generateCareerReading(@Valid @RequestBody CareerReadingRequest request) {
        CareerReadingResponse response = careerAiService.generateCareerReading(request);
        return ApiResponse.of(HttpStatus.OK.value(), "Generate career reading successfully", response);
    }
}
