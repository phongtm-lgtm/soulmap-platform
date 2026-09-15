package com.soulmap.server.controller;

import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.ai.AiReadingResponse;
import com.soulmap.server.entity.User;
import com.soulmap.server.service.AiReadingService;
import com.soulmap.server.service.AuthSessionService;
import com.soulmap.server.service.CurrentUserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai/readings")
@CrossOrigin(origins = "${SOULMAP_FRONTEND_ORIGIN:http://localhost:3000}", allowCredentials = "true")
public class AiReadingController {
    private final AiReadingService aiReadingService;
    private final CurrentUserService currentUserService;

    public AiReadingController(AiReadingService aiReadingService, CurrentUserService currentUserService) {
        this.aiReadingService = aiReadingService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/{id}")
    public ApiResponse<AiReadingResponse> getReading(
            @PathVariable Long id,
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        User currentUser = currentUserService.requireCurrentUser(sessionToken);
        AiReadingResponse response = aiReadingService.getReading(id, currentUser.getId().toString());
        return ApiResponse.of(HttpStatus.OK.value(), "Get AI reading successfully", response);
    }
}
