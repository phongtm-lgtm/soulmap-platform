package com.soulmap.server.controller;

import com.soulmap.server.dto.request.ai.LoveReadingRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.ai.LoveReadingResponse;
import com.soulmap.server.entity.User;
import com.soulmap.server.service.AuthSessionService;
import com.soulmap.server.service.CurrentUserService;
import com.soulmap.server.service.LoveAiService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai/love")
@CrossOrigin(origins = "${SOULMAP_FRONTEND_ORIGIN:http://localhost:3000}", allowCredentials = "true")
public class LoveAiController {
    private final LoveAiService loveAiService;
    private final CurrentUserService currentUserService;

    public LoveAiController(LoveAiService loveAiService, CurrentUserService currentUserService) {
        this.loveAiService = loveAiService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/readings")
    public ApiResponse<LoveReadingResponse> generateLoveReading(
            @Valid @RequestBody LoveReadingRequest request,
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        User currentUser = currentUserService.requireCurrentUser(sessionToken);
        request.setUserId(currentUser.getId().toString());
        request.setMbtiType(currentUser.getMbtiType());
        LoveReadingResponse response = loveAiService.generateLoveReading(request);
        return ApiResponse.of(HttpStatus.OK.value(), "Generate love reading successfully", response);
    }
}
