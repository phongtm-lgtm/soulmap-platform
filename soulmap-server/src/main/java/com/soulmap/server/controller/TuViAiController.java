package com.soulmap.server.controller;

import com.soulmap.server.dto.request.ai.TuViReadingRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.ai.TuViReadingResponse;
import com.soulmap.server.service.TuViAiService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai/tuvi")
@CrossOrigin(origins = "*")
public class TuViAiController {
    private final TuViAiService tuViAiService;

    public TuViAiController(TuViAiService tuViAiService) {
        this.tuViAiService = tuViAiService;
    }

    @PostMapping("/readings")
    public ApiResponse<TuViReadingResponse> generateReading(@Valid @RequestBody TuViReadingRequest request) {
        TuViReadingResponse response = tuViAiService.generateReading(request);
        return ApiResponse.of(HttpStatus.OK.value(), "Generate Tu Vi reading successfully", response);
    }

}
