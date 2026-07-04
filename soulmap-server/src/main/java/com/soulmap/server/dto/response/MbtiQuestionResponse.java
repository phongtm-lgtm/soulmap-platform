package com.soulmap.server.dto.response;

import java.util.List;

public record MbtiQuestionResponse(
        Integer questionId,
        Integer stt,
        String text,
        List<MbtiOptionResponse> options
) {
}
