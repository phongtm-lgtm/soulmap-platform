package com.soulmap.server.dto.response.ai;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class MentorConversationDetailResponse {
    private Long id;
    private String title;
    private String activeJourney;
    private Instant createdAt;
    private Instant updatedAt;
    private List<MentorMessageResponse> messages;
}
