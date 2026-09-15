package com.soulmap.server.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.soulmap.server.config.GoogleAuthProperties;
import com.soulmap.server.dto.request.GoogleSignInRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.GoogleSignInResponse;
import com.soulmap.server.entity.User;
import com.soulmap.server.repository.UserRepository;
import com.soulmap.server.service.AuthSessionService;
import jakarta.validation.Valid;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.Instant;
import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "${SOULMAP_FRONTEND_ORIGIN:http://localhost:3000}", allowCredentials = "true")
public class AuthController {

    private final GoogleAuthProperties googleAuthProperties;
    private final UserRepository userRepository;
    private final AuthSessionService authSessionService;

    public AuthController(
            GoogleAuthProperties googleAuthProperties,
            UserRepository userRepository,
            AuthSessionService authSessionService
    ) {
        this.googleAuthProperties = googleAuthProperties;
        this.userRepository = userRepository;
        this.authSessionService = authSessionService;
    }

    @PostMapping("/google")
    @Transactional
    public ResponseEntity<ApiResponse<GoogleSignInResponse>> signInWithGoogle(
            @Valid @RequestBody GoogleSignInRequest request
    ) throws GeneralSecurityException, IOException {
        String clientId = googleAuthProperties.getClientId();
        if (clientId == null || clientId.isBlank()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance()
        ).setAudience(Collections.singletonList(clientId)).build();

        GoogleIdToken idToken = verifier.verify(request.credential());
        if (idToken == null || !Boolean.TRUE.equals(idToken.getPayload().getEmailVerified())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String googleSub = payload.getSubject();
        String email = payload.getEmail().toLowerCase();
        Optional<User> userByGoogleSub = userRepository.findByGoogleSub(googleSub);
        User user;

        if (userByGoogleSub.isPresent()) {
            user = userByGoogleSub.get();
        } else {
            Optional<User> userByEmail = userRepository.findByEmail(email);
            if (userByEmail.isPresent() && userByEmail.get().getGoogleSub() != null
                    && !googleSub.equals(userByEmail.get().getGoogleSub())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
            user = userByEmail.orElseGet(User::new);
            user.setGoogleSub(googleSub);
        }

        user.setEmail(email);
        user.setFullName(getStringClaim(payload, "name", email));
        user.setAvatarUrl(getStringClaim(payload, "picture", null));
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        GoogleSignInResponse response = new GoogleSignInResponse(
                user.getFullName(),
                user.getEmail()
        );
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authSessionService.createSession(user).toString())
                .body(ApiResponse.of(HttpStatus.OK.value(), "Google sign-in verified", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<GoogleSignInResponse>> getCurrentUser(
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        return authSessionService.findUser(sessionToken)
                .map(this::toCurrentUserResponse)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, authSessionService.revokeSession(sessionToken).toString())
                .build();
    }

    private String getStringClaim(GoogleIdToken.Payload payload, String claim, String defaultValue) {
        Object value = payload.get(claim);
        return value instanceof String string && !string.isBlank() ? string : defaultValue;
    }

    private ResponseEntity<ApiResponse<GoogleSignInResponse>> toCurrentUserResponse(User user) {
        GoogleSignInResponse response = new GoogleSignInResponse(user.getFullName(), user.getEmail());
        return ResponseEntity.ok(ApiResponse.of(HttpStatus.OK.value(), "Current user retrieved", response));
    }
}
