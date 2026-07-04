package com.soulmap.server.service.impl;

import com.soulmap.server.common.enums.ErrorCode;
import com.soulmap.server.common.error.BusinessException;
import com.soulmap.server.dto.request.MbtiAnswerRequest;
import com.soulmap.server.dto.request.MbtiResultRequest;
import com.soulmap.server.dto.response.MbtiOptionResponse;
import com.soulmap.server.dto.response.MbtiQuestionResponse;
import com.soulmap.server.dto.response.MbtiQuestionsResponse;
import com.soulmap.server.dto.response.MbtiResultResponse;
import com.soulmap.server.entity.MbtiQuestion;
import com.soulmap.server.repository.MbtiQuestionRepository;
import com.soulmap.server.service.MbtiService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Service
public class MbtiServiceImpl implements MbtiService {

    private static final int SHORT_TOTAL_QUESTIONS = 40;

    private final MbtiQuestionRepository mbtiQuestionRepository;

    public MbtiServiceImpl(MbtiQuestionRepository mbtiQuestionRepository) {
        this.mbtiQuestionRepository = mbtiQuestionRepository;
    }

    @Override
    public MbtiQuestionsResponse getQuestions() {
        List<MbtiQuestion> questions = loadActiveQuestions();

        List<MbtiQuestionResponse> responseQuestions = questions.stream()
                .map(question -> new MbtiQuestionResponse(
                        question.getStt(),
                        question.getStt(),
                        question.getQuestionText(),
                        List.of(
                                new MbtiOptionResponse("a", question.getOptionAText()),
                                new MbtiOptionResponse("b", question.getOptionBText())
                        )
                ))
                .toList();

        return new MbtiQuestionsResponse(responseQuestions.size(), responseQuestions);
    }

    @Override
    public MbtiResultResponse calculateResult(MbtiResultRequest request) {
        List<MbtiQuestion> questions = loadActiveQuestions();
        validateAnswers(request.answers(), questions.size());

        Map<Integer, MbtiQuestion> questionsByStt = questions.stream()
                .collect(HashMap::new, (map, question) -> map.put(question.getStt(), question), HashMap::putAll);

        int scoreEi = 0;
        int scoreSn = 0;
        int scoreTf = 0;
        int scoreJp = 0;

        int totalEi = 0;
        int totalSn = 0;
        int totalTf = 0;
        int totalJp = 0;

        for (MbtiQuestion question : questions) {
            switch (question.getDimensionPair()) {
                case "EI" -> totalEi++;
                case "SN" -> totalSn++;
                case "TF" -> totalTf++;
                case "JP" -> totalJp++;
                default -> throw new BusinessException(ErrorCode.COMMON_ERROR_0003);
            }
        }

        for (MbtiAnswerRequest answer : request.answers()) {
            MbtiQuestion question = questionsByStt.get(answer.questionId());
            if (question == null) {
                throw new BusinessException(ErrorCode.COMMON_ERROR_0001);
            }

            String optionId = answer.optionId().toLowerCase(Locale.ROOT);
            String dimension = resolveDimension(question, optionId);

            switch (dimension) {
                case "E", "I" -> {
                    if ("E".equals(dimension)) {
                        scoreEi++;
                    }
                }
                case "S", "N" -> {
                    if ("S".equals(dimension)) {
                        scoreSn++;
                    }
                }
                case "T", "F" -> {
                    if ("T".equals(dimension)) {
                        scoreTf++;
                    }
                }
                case "J", "P" -> {
                    if ("J".equals(dimension)) {
                        scoreJp++;
                    }
                }
                default -> throw new BusinessException(ErrorCode.COMMON_ERROR_0003);
            }
        }

        String type = buildMbtiType(scoreEi, totalEi, scoreSn, totalSn, scoreTf, totalTf, scoreJp, totalJp);
        return new MbtiResultResponse(type);
    }

    private List<MbtiQuestion> loadActiveQuestions() {
        List<MbtiQuestion> questions = mbtiQuestionRepository.findAllByOrderBySttAsc();
        if (questions.size() != SHORT_TOTAL_QUESTIONS) {
            throw new BusinessException(ErrorCode.COMMON_ERROR_0003);
        }
        return questions;
    }

    private void validateAnswers(List<MbtiAnswerRequest> answers, int expectedSize) {
        if (answers == null || answers.size() != expectedSize) {
            throw new BusinessException(ErrorCode.COMMON_ERROR_0001);
        }

        Set<Integer> questionIds = new HashSet<>();
        for (MbtiAnswerRequest answer : answers) {
            if (!questionIds.add(answer.questionId())) {
                throw new BusinessException(ErrorCode.COMMON_ERROR_0001);
            }
        }
    }

    private String resolveDimension(MbtiQuestion question, String optionId) {
        return switch (optionId) {
            case "a" -> question.getOptionADimension();
            case "b" -> question.getOptionBDimension();
            default -> throw new BusinessException(ErrorCode.COMMON_ERROR_0001);
        };
    }

    private String buildMbtiType(
            int scoreEi,
            int totalEi,
            int scoreSn,
            int totalSn,
            int scoreTf,
            int totalTf,
            int scoreJp,
            int totalJp
    ) {
        String letter1 = scoreEi * 2 >= totalEi ? "E" : "I";
        String letter2 = scoreSn * 2 >= totalSn ? "S" : "N";
        String letter3 = scoreTf * 2 >= totalTf ? "T" : "F";
        String letter4 = scoreJp * 2 >= totalJp ? "J" : "P";
        return letter1 + letter2 + letter3 + letter4;
    }

}
