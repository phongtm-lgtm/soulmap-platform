package com.soulmap.server.dto.response.ai;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MentorSendMessageResponse {
    private MentorMessageResponse userMessage;
    private MentorMessageResponse assistantMessage;
    private MentorConversationSummaryResponse conversation;
}
