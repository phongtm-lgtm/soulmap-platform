package com.soulmap.server.dto.request.ai;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateMentorConversationRequest {
    @Size(max = 255)
    private String title;

    /** Optional: identity | career | love | life | tuvi */
    @Size(max = 32)
    private String activeJourney;
}
