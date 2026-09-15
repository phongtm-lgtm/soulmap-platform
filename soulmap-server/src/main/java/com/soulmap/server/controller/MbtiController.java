package com.soulmap.server.controller;

import com.soulmap.server.dto.request.MbtiResultRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.MbtiQuestionsResponse;
import com.soulmap.server.dto.response.MbtiResultResponse;
import com.soulmap.server.entity.User;
import com.soulmap.server.repository.UserRepository;
import com.soulmap.server.service.AuthSessionService;
import com.soulmap.server.service.CurrentUserService;
import com.soulmap.server.service.MbtiService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/mbti")
@CrossOrigin(origins = "${SOULMAP_FRONTEND_ORIGIN:http://localhost:3000}", allowCredentials = "true")
public class MbtiController {

    private final MbtiService mbtiService;
    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;

    public MbtiController(MbtiService mbtiService, CurrentUserService currentUserService, UserRepository userRepository) {
        this.mbtiService = mbtiService;
        this.currentUserService = currentUserService;
        this.userRepository = userRepository;
    }

    @GetMapping("/questions")
    public ApiResponse<MbtiQuestionsResponse> getQuestions() {
        MbtiQuestionsResponse response = mbtiService.getQuestions();
        return ApiResponse.of(HttpStatus.OK.value(), "Get MBTI questions successfully", response);
    }

    @PostMapping("/results")
    public ApiResponse<MbtiResultResponse> calculateResult(
            @Valid @RequestBody MbtiResultRequest request,
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        User currentUser = currentUserService.requireCurrentUser(sessionToken);
        MbtiResultResponse response = mbtiService.calculateResult(request);
        currentUser.setMbtiType(response.type());
        currentUser.setMbtiUpdatedAt(Instant.now());
        userRepository.save(currentUser);
        return ApiResponse.of(HttpStatus.OK.value(), "Calculate MBTI result successfully", response);
    }
}
