package com.soulmap.server.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record MbtiAnswerRequest(
        @NotNull(message = "questionId is required")
        @Min(value = 1, message = "questionId must be at least 1")
        @Max(value = 40, message = "questionId must not exceed 40")
        Integer questionId,

        @NotBlank(message = "optionId is required")
        @Pattern(regexp = "^[abAB]$", message = "optionId must be 'a' or 'b'")
        String optionId
) {
}
