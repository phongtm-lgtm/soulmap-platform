package com.soulmap.server.dto.response;

import java.util.List;

public record MbtiQuestionsResponse(
        int totalQuestions,
        List<MbtiQuestionResponse> questions
) {
}
