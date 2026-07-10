package com.soulmap.server.dto.response.ai;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CareerReadingResponse {
    private Long id;
    private String type;
    private String chapterId;
    private String chapterTitle;
    private String content;
    private CareerPath careerPath;
    private GrowthDrivers growthDrivers;
    private String deepReadingMarkdown;

    @Getter
    @Setter
    public static class CareerPath {
        private String intro;
        private List<Card> cards;
        private String quote;
    }

    @Getter
    @Setter
    public static class GrowthDrivers {
        private List<Card> strongWhen;
        private List<Card> notFitWith;
    }

    @Getter
    @Setter
    public static class Card {
        private String title;
        private String description;
    }
}
