package com.soulmap.server.service;

import com.soulmap.server.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CurrentUserService {
    private final AuthSessionService authSessionService;

    public CurrentUserService(AuthSessionService authSessionService) {
        this.authSessionService = authSessionService;
    }

    public User requireCurrentUser(String sessionToken) {
        return authSessionService.findUser(sessionToken)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication is required"));
    }
}
