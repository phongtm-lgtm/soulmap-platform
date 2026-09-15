package com.soulmap.server.service;

import com.soulmap.server.dto.request.ai.CreateMentorConversationRequest;
import com.soulmap.server.dto.request.ai.SendMentorMessageRequest;
import com.soulmap.server.dto.response.ai.MentorConversationDetailResponse;
import com.soulmap.server.dto.response.ai.MentorConversationSummaryResponse;
import com.soulmap.server.dto.response.ai.MentorSendMessageResponse;
import com.soulmap.server.entity.User;

import java.util.List;

public interface MentorChatService {
    List<MentorConversationSummaryResponse> listConversations(User user);

    MentorConversationDetailResponse createConversation(User user, CreateMentorConversationRequest request);

    MentorConversationDetailResponse getConversation(User user, Long conversationId);

    MentorSendMessageResponse sendMessage(User user, Long conversationId, SendMentorMessageRequest request);
}
