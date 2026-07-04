package com.soulmap.server.service;

import com.soulmap.server.dto.request.MbtiResultRequest;
import com.soulmap.server.dto.response.MbtiQuestionsResponse;
import com.soulmap.server.dto.response.MbtiResultResponse;

public interface MbtiService {

    MbtiQuestionsResponse getQuestions();

    MbtiResultResponse calculateResult(MbtiResultRequest request);
}
