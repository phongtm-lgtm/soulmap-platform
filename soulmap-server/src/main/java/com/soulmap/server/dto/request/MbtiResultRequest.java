package com.soulmap.server.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record MbtiResultRequest(
        @NotEmpty(message = "answers must not be empty")
        List<@Valid MbtiAnswerRequest> answers
) {
}
