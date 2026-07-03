package com.soulmap.server.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

public record ApiResponse<T>(
        int status,
        String message,
        @JsonInclude(JsonInclude.Include.NON_NULL)
        T data,
        Instant timestamp
) {

    public ApiResponse {
        if (timestamp == null) {
            timestamp = Instant.now();
        }
    }

    public static <T> ApiResponse<T> of(int status, String message, T data) {
        return new ApiResponse<>(status, message, data, null);
    }

    public static ApiResponse<Void> of(int status, String message) {
        return new ApiResponse<>(status, message, null, null);
    }
}
