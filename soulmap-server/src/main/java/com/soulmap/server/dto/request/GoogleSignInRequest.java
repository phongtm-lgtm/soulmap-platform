package com.soulmap.server.dto.request;

import jakarta.validation.constraints.NotBlank;

public record GoogleSignInRequest(@NotBlank String credential) {
}
