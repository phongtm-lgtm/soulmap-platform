package com.soulmap.server.controller;

import com.soulmap.server.dto.request.ai.CareerReadingRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.ai.CareerReadingResponse;
import com.soulmap.server.dto.response.ai.CareerTalentReadingResponse;
import com.soulmap.server.entity.User;
import com.soulmap.server.service.AuthSessionService;
import com.soulmap.server.service.CareerAiService;
import com.soulmap.server.service.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai/career")
@CrossOrigin(origins = "${SOULMAP_FRONTEND_ORIGIN:http://localhost:3000}", allowCredentials = "true")
public class CareerAiController {
    private final CareerAiService careerAiService;
    private final CurrentUserService currentUserService;

    public CareerAiController(CareerAiService careerAiService, CurrentUserService currentUserService) {
        this.careerAiService = careerAiService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/readings")
    public ApiResponse<CareerReadingResponse> generateCareerReading(
            @Valid @RequestBody CareerReadingRequest request,
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        User currentUser = currentUserService.requireCurrentUser(sessionToken);
        request.setUserId(currentUser.getId().toString());
        request.setMbtiType(currentUser.getMbtiType());
        CareerReadingResponse response = careerAiService.generateCareerReading(request);
        return ApiResponse.of(HttpStatus.OK.value(), "Generate career reading successfully", response);
    }

    @PostMapping("/chapters/03/readings")
    public ApiResponse<CareerTalentReadingResponse> generateCareerTalentReading(
            @Valid @RequestBody CareerReadingRequest request,
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        User currentUser = currentUserService.requireCurrentUser(sessionToken);
        request.setUserId(currentUser.getId().toString());
        request.setMbtiType(currentUser.getMbtiType());
        CareerTalentReadingResponse response = careerAiService.generateCareerTalentReading(request);
        return ApiResponse.of(HttpStatus.OK.value(), "Generate career talent reading successfully", response);
    }
}
