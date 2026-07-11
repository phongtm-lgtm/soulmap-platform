package com.soulmap.server.dto.response.ai;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class AiReadingResponse {
    private Long id;
    private String userId;
    private String type;
    private String chapterId;
    private String chapterTitle;
    private String content;
    private CareerReadingResponse.CareerPath careerPath;
    private CareerReadingResponse.GrowthDrivers growthDrivers;
    private String talentIntro;
    private java.util.List<CareerTalentReadingResponse.Talent> talents;
    private String combinationInsight;
    private java.util.List<CareerReadingResponse.Card> balanceRisks;
    private String deepReadingMarkdown;
    private Instant createdAt;
    private Instant updatedAt;
}
