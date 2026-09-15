package com.soulmap.server.service;

import com.soulmap.server.config.SessionProperties;
import com.soulmap.server.entity.User;
import com.soulmap.server.entity.UserSession;
import com.soulmap.server.repository.UserRepository;
import com.soulmap.server.repository.UserSessionRepository;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

@Service
public class AuthSessionService {
    public static final String COOKIE_NAME = "soulmap_session";

    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;
    private final SessionProperties sessionProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthSessionService(
            UserRepository userRepository,
            UserSessionRepository userSessionRepository,
            SessionProperties sessionProperties
    ) {
        this.userRepository = userRepository;
        this.userSessionRepository = userSessionRepository;
        this.sessionProperties = sessionProperties;
    }

    public ResponseCookie createSession(User user) {
        String token = generateToken();
        UserSession session = new UserSession();
        session.setUserId(user.getId());
        session.setTokenHash(hash(token));
        session.setExpiresAt(Instant.now().plus(Duration.ofDays(sessionProperties.getDurationDays())));
        userSessionRepository.save(session);
        return sessionCookie(token, sessionProperties.getDurationDays());
    }

    public Optional<User> findUser(String token) {
        if (token == null || token.isBlank()) return Optional.empty();
        return userSessionRepository.findByTokenHashAndRevokedAtIsNullAndExpiresAtAfter(hash(token), Instant.now())
                .flatMap(session -> userRepository.findById(session.getUserId()));
    }

    public ResponseCookie revokeSession(String token) {
        if (token != null && !token.isBlank()) {
            userSessionRepository.findByTokenHashAndRevokedAtIsNullAndExpiresAtAfter(hash(token), Instant.now())
                    .ifPresent(session -> {
                        session.setRevokedAt(Instant.now());
                        userSessionRepository.save(session);
                    });
        }
        return sessionCookie("", 0);
    }

    private ResponseCookie sessionCookie(String value, long maxAgeDays) {
        return ResponseCookie.from(COOKIE_NAME, value)
                .httpOnly(true)
                .secure(sessionProperties.isSecure())
                .sameSite(sessionProperties.getSameSite())
                .path("/")
                .maxAge(maxAgeDays == 0 ? Duration.ZERO : Duration.ofDays(maxAgeDays))
                .build();
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }
}
