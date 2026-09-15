package com.soulmap.server.dto.response.ai;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class IdentityJourneyResponse {
    private Long id;
    private String type;
    private String journeyTitle;
    private String tagline;
    private String coreNarrative;
    private List<IdentityJourneyChapter> chapters;
    private String closing;

    @Getter
    @Setter
    public static class IdentityJourneyChapter {
        private int order;
        private String title;
        private InsightSide strength;
        private InsightSide watchOut;
    }

    @Getter
    @Setter
    public static class InsightSide {
        private String title;
        private String content;
    }
}
