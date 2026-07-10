package com.soulmap.server.controller;

import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.ai.AiReadingResponse;
import com.soulmap.server.service.AiReadingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai/readings")
@CrossOrigin(origins = "*")
public class AiReadingController {
    private final AiReadingService aiReadingService;

    public AiReadingController(AiReadingService aiReadingService) {
        this.aiReadingService = aiReadingService;
    }

    @GetMapping("/{id}")
    public ApiResponse<AiReadingResponse> getReading(@PathVariable Long id) {
        AiReadingResponse response = aiReadingService.getReading(id);
        return ApiResponse.of(HttpStatus.OK.value(), "Get AI reading successfully", response);
    }
}
