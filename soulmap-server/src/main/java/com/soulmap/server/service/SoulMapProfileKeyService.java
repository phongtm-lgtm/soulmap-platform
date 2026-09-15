package com.soulmap.server.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.stereotype.Service;

/** Creates a stable identity for billable SoulMap input, excluding name and view year. */
@Service
public class SoulMapProfileKeyService {
    public String create(
            String mbtiType,
            int day,
            int month,
            int year,
            String calendar,
            String gender,
            int hour,
            int minute,
            int timezone
    ) {
        String source = String.join("|",
                normalize(mbtiType), String.valueOf(day), String.valueOf(month), String.valueOf(year),
                normalize(calendar), normalize(gender), String.valueOf(hour), String.valueOf(minute),
                String.valueOf(timezone));
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(source.getBytes(StandardCharsets.UTF_8));
            StringBuilder key = new StringBuilder(64);
            for (byte value : digest) key.append(String.format("%02x", value));
            return key.toString();
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toUpperCase();
    }
}
