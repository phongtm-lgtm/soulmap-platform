package com.soulmap.server.controller;

import com.soulmap.server.dto.request.ai.CreateMentorConversationRequest;
import com.soulmap.server.dto.request.ai.SendMentorMessageRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.ai.MentorConversationDetailResponse;
import com.soulmap.server.dto.response.ai.MentorConversationSummaryResponse;
import com.soulmap.server.dto.response.ai.MentorSendMessageResponse;
import com.soulmap.server.entity.User;
import com.soulmap.server.service.AuthSessionService;
import com.soulmap.server.service.CurrentUserService;
import com.soulmap.server.service.MentorChatService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ai/mentor")
@CrossOrigin(origins = "${SOULMAP_FRONTEND_ORIGIN:http://localhost:3000}", allowCredentials = "true")
public class MentorController {
    private final MentorChatService mentorChatService;
    private final CurrentUserService currentUserService;

    public MentorController(MentorChatService mentorChatService, CurrentUserService currentUserService) {
        this.mentorChatService = mentorChatService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/conversations")
    public ApiResponse<List<MentorConversationSummaryResponse>> listConversations(
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        User currentUser = currentUserService.requireCurrentUser(sessionToken);
        return ApiResponse.of(
                HttpStatus.OK.value(),
                "List mentor conversations successfully",
                mentorChatService.listConversations(currentUser)
        );
    }

    @PostMapping("/conversations")
    public ApiResponse<MentorConversationDetailResponse> createConversation(
            @Valid @RequestBody(required = false) CreateMentorConversationRequest request,
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        User currentUser = currentUserService.requireCurrentUser(sessionToken);
        CreateMentorConversationRequest body = request != null ? request : new CreateMentorConversationRequest();
        return ApiResponse.of(
                HttpStatus.OK.value(),
                "Create mentor conversation successfully",
                mentorChatService.createConversation(currentUser, body)
        );
    }

    @GetMapping("/conversations/{id}")
    public ApiResponse<MentorConversationDetailResponse> getConversation(
            @PathVariable("id") Long id,
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        User currentUser = currentUserService.requireCurrentUser(sessionToken);
        return ApiResponse.of(
                HttpStatus.OK.value(),
                "Get mentor conversation successfully",
                mentorChatService.getConversation(currentUser, id)
        );
    }

    @PostMapping("/conversations/{id}/messages")
    public ApiResponse<MentorSendMessageResponse> sendMessage(
            @PathVariable("id") Long id,
            @Valid @RequestBody SendMentorMessageRequest request,
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        User currentUser = currentUserService.requireCurrentUser(sessionToken);
        return ApiResponse.of(
                HttpStatus.OK.value(),
                "Send mentor message successfully",
                mentorChatService.sendMessage(currentUser, id, request)
        );
    }
}
