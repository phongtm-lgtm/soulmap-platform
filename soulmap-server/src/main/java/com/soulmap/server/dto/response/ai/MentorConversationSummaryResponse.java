package com.soulmap.server.dto.response.ai;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class MentorConversationSummaryResponse {
    private Long id;
    private String title;
    private String activeJourney;
    private String preview;
    private Instant createdAt;
    private Instant updatedAt;
}
