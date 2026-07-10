package com.soulmap.server.controller;

import com.soulmap.server.dto.request.ai.LoveReadingRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.ai.LoveReadingResponse;
import com.soulmap.server.service.LoveAiService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai/love")
@CrossOrigin(origins = "*")
public class LoveAiController {
    private final LoveAiService loveAiService;

    public LoveAiController(LoveAiService loveAiService) {
        this.loveAiService = loveAiService;
    }

    @PostMapping("/readings")
    public ApiResponse<LoveReadingResponse> generateLoveReading(@Valid @RequestBody LoveReadingRequest request) {
        LoveReadingResponse response = loveAiService.generateLoveReading(request);
        return ApiResponse.of(HttpStatus.OK.value(), "Generate love reading successfully", response);
    }
}
