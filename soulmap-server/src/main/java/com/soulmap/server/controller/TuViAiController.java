package com.soulmap.server.controller;

import com.soulmap.server.dto.request.ai.TuViReadingRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.ai.TuViReadingResponse;
import com.soulmap.server.entity.User;
import com.soulmap.server.service.AuthSessionService;
import com.soulmap.server.service.CurrentUserService;
import com.soulmap.server.service.TuViAiService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai/tuvi")
@CrossOrigin(origins = "${SOULMAP_FRONTEND_ORIGIN:http://localhost:3000}", allowCredentials = "true")
public class TuViAiController {
    private final TuViAiService tuViAiService;
    private final CurrentUserService currentUserService;

    public TuViAiController(TuViAiService tuViAiService, CurrentUserService currentUserService) {
        this.tuViAiService = tuViAiService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/readings")
    public ApiResponse<TuViReadingResponse> generateReading(
            @Valid @RequestBody TuViReadingRequest request,
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        User currentUser = currentUserService.requireCurrentUser(sessionToken);
        request.setUserId(currentUser.getId().toString());
        request.setMbtiType(currentUser.getMbtiType());
        TuViReadingResponse response = tuViAiService.generateReading(request);
        return ApiResponse.of(HttpStatus.OK.value(), "Generate Tu Vi reading successfully", response);
    }
}
