package com.soulmap.server.dto.response.ai;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CareerTalentReadingResponse {
    private Long id;
    private String type;
    private String chapterId;
    private String chapterTitle;
    private String content;
    private String intro;
    private List<Talent> talents;
    private String combinationInsight;
    private List<CareerReadingResponse.Card> balanceRisks;
    private String deepReadingMarkdown;

    @Getter
    @Setter
    public static class Talent {
        private String title;
        private String description;
        private String workExpression;
        private String developmentTip;
    }
}
