package com.soulmap.server.controller;

import com.soulmap.server.dto.request.MbtiResultRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.MbtiQuestionsResponse;
import com.soulmap.server.dto.response.MbtiResultResponse;
import com.soulmap.server.service.MbtiService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mbti")
@CrossOrigin(origins = "*")
public class MbtiController {

    private final MbtiService mbtiService;

    public MbtiController(MbtiService mbtiService) {
        this.mbtiService = mbtiService;
    }

    @GetMapping("/questions")
    public ResponseEntity<ApiResponse<MbtiQuestionsResponse>> getQuestions() {
        MbtiQuestionsResponse response = mbtiService.getQuestions();
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Get MBTI questions successfully", response));
    }

    @PostMapping("/results")
    public ResponseEntity<ApiResponse<MbtiResultResponse>> calculateResult(@Valid @RequestBody MbtiResultRequest request) {
        MbtiResultResponse response = mbtiService.calculateResult(request);
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Calculate MBTI result successfully", response));
    }
}
