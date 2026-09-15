package com.soulmap.server.controller;

import com.soulmap.server.dto.request.ai.IdentityJourneyRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.ai.IdentityJourneyResponse;
import com.soulmap.server.entity.User;
import com.soulmap.server.service.AuthSessionService;
import com.soulmap.server.service.CurrentUserService;
import com.soulmap.server.service.IdentityJourneyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai/identity")
@CrossOrigin(origins = "${SOULMAP_FRONTEND_ORIGIN:http://localhost:3000}", allowCredentials = "true")
public class IdentityJourneyController {
    private final IdentityJourneyService identityJourneyService;
    private final CurrentUserService currentUserService;

    public IdentityJourneyController(IdentityJourneyService identityJourneyService, CurrentUserService currentUserService) {
        this.identityJourneyService = identityJourneyService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/readings")
    public ApiResponse<IdentityJourneyResponse> generateIdentityJourney(
            @Valid @RequestBody IdentityJourneyRequest request,
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        User currentUser = currentUserService.requireCurrentUser(sessionToken);
        request.setUserId(currentUser.getId().toString());
        request.setMbtiType(currentUser.getMbtiType());
        IdentityJourneyResponse response = identityJourneyService.generateIdentityJourney(request);
        return ApiResponse.of(HttpStatus.OK.value(), "Generate identity journey successfully", response);
    }
}
