package com.soulmap.server.service.impl;

import com.soulmap.server.client.ai.AiChatRequest;
import com.soulmap.server.client.ai.AiMessage;
import com.soulmap.server.client.ai.AiProviderClient;
import com.soulmap.server.common.error.ResourceNotFoundException;
import com.soulmap.server.config.SoulmapAiProperties;
import com.soulmap.server.dto.request.ai.CreateMentorConversationRequest;
import com.soulmap.server.dto.request.ai.SendMentorMessageRequest;
import com.soulmap.server.dto.response.ai.MentorConversationDetailResponse;
import com.soulmap.server.dto.response.ai.MentorConversationSummaryResponse;
import com.soulmap.server.dto.response.ai.MentorMessageResponse;
import com.soulmap.server.dto.response.ai.MentorSendMessageResponse;
import com.soulmap.server.entity.MentorConversation;
import com.soulmap.server.entity.MentorMessage;
import com.soulmap.server.entity.User;
import com.soulmap.server.entity.UserTuViChart;
import com.soulmap.server.repository.AiReadingRepository;
import com.soulmap.server.repository.MentorConversationRepository;
import com.soulmap.server.repository.MentorMessageRepository;
import com.soulmap.server.repository.UserTuViChartRepository;
import com.soulmap.server.service.MentorChatService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
public class MentorChatServiceImpl implements MentorChatService {
    private static final int READING_EXCERPT_CHARS = 1800;
    private static final String WELCOME_TEXT =
            "Chào bạn! Linh Nhi đang lắng nghe. Hãy chia sẻ điều bạn đang suy nghĩ nhé.";

    private static final Map<String, String> JOURNEY_READING_TYPES = Map.of(
            "identity", "IDENTITY_JOURNEY",
            "career", "CAREER_CHAPTER",
            "love", "LOVE_READING",
            "tuvi", "TUVI_FULL_READING"
    );

    private final MentorConversationRepository conversationRepository;
    private final MentorMessageRepository messageRepository;
    private final AiReadingRepository aiReadingRepository;
    private final UserTuViChartRepository userTuViChartRepository;
    private final AiProviderClient aiProviderClient;
    private final SoulmapAiProperties aiProperties;

    public MentorChatServiceImpl(
            MentorConversationRepository conversationRepository,
            MentorMessageRepository messageRepository,
            AiReadingRepository aiReadingRepository,
            UserTuViChartRepository userTuViChartRepository,
            AiProviderClient aiProviderClient,
            SoulmapAiProperties aiProperties
    ) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.aiReadingRepository = aiReadingRepository;
        this.userTuViChartRepository = userTuViChartRepository;
        this.aiProviderClient = aiProviderClient;
        this.aiProperties = aiProperties;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MentorConversationSummaryResponse> listConversations(User user) {
        return conversationRepository.findByUserIdOrderByUpdatedAtDesc(user.getId()).stream()
                .map(this::toSummary)
                .toList();
    }

    @Override
    @Transactional
    public MentorConversationDetailResponse createConversation(User user, CreateMentorConversationRequest request) {
        MentorConversation conversation = new MentorConversation();
        conversation.setUserId(user.getId());
        conversation.setActiveJourney(normalizeJourney(request != null ? request.getActiveJourney() : null));
        String title = request != null && StringUtils.hasText(request.getTitle())
                ? request.getTitle().trim()
                : "Cuộc trò chuyện mới";
        conversation.setTitle(title);
        conversation = conversationRepository.save(conversation);

        MentorMessage welcome = new MentorMessage();
        welcome.setConversationId(conversation.getId());
        welcome.setRole("assistant");
        welcome.setContent(WELCOME_TEXT);
        messageRepository.save(welcome);

        return toDetail(conversation);
    }

    @Override
    @Transactional(readOnly = true)
    public MentorConversationDetailResponse getConversation(User user, Long conversationId) {
        MentorConversation conversation = requireConversation(user, conversationId);
        return toDetail(conversation);
    }

    @Override
    @Transactional
    public MentorSendMessageResponse sendMessage(User user, Long conversationId, SendMentorMessageRequest request) {
        MentorConversation conversation = requireConversation(user, conversationId);
        String content = request.getContent().trim();

        MentorMessage userMessage = new MentorMessage();
        userMessage.setConversationId(conversation.getId());
        userMessage.setRole("user");
        userMessage.setContent(content);
        userMessage = messageRepository.save(userMessage);

        if ("Cuộc trò chuyện mới".equals(conversation.getTitle())) {
            conversation.setTitle(deriveTitle(content));
        }

        List<AiMessage> llmMessages = new ArrayList<>();
        llmMessages.add(new AiMessage("system", buildSystemPrompt(user, conversation.getActiveJourney())));

        List<MentorMessage> recent = messageRepository.findTop20ByConversationIdOrderByCreatedAtDesc(conversation.getId());
        Collections.reverse(recent);
        for (MentorMessage message : recent) {
            if ("system".equalsIgnoreCase(message.getRole())) {
                continue;
            }
            // Skip the just-saved user message; add it once at the end for clarity
            if (message.getId().equals(userMessage.getId())) {
                continue;
            }
            llmMessages.add(new AiMessage(normalizeRole(message.getRole()), message.getContent()));
        }
        llmMessages.add(new AiMessage("user", content));

        String reply = aiProviderClient.generateText(new AiChatRequest(
                aiProperties.getModel(),
                llmMessages,
                aiProperties.getTemperature(),
                null
        )).trim();

        if (!StringUtils.hasText(reply)) {
            reply = "Linh Nhi cần thêm một chút thông tin từ bạn để đồng hành tốt hơn. Bạn có thể chia sẻ rõ hơn được không?";
        }

        MentorMessage assistantMessage = new MentorMessage();
        assistantMessage.setConversationId(conversation.getId());
        assistantMessage.setRole("assistant");
        assistantMessage.setContent(reply);
        assistantMessage = messageRepository.save(assistantMessage);

        conversationRepository.save(conversation);

        MentorSendMessageResponse response = new MentorSendMessageResponse();
        response.setUserMessage(toMessageResponse(userMessage));
        response.setAssistantMessage(toMessageResponse(assistantMessage));
        response.setConversation(toSummary(conversation));
        return response;
    }

    private MentorConversation requireConversation(User user, Long conversationId) {
        return conversationRepository.findByIdAndUserId(conversationId, user.getId())
                .orElseThrow(ResourceNotFoundException::new);
    }

    private String buildSystemPrompt(User user, String activeJourney) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("""
                Bạn là Linh Nhi — AI Mentor của SoulMap.
                Nhiệm vụ: lắng nghe, giải thích insight từ SoulMap của người dùng, và gợi ý bước tiếp theo thực tế.

                Danh xưng:
                - Tự xưng là Linh Nhi (không nói mình là AI, trợ lý, mô hình, ChatGPT).
                - Gọi người dùng là "bạn". Không dùng em/anh/chị/quý khách.

                Giọng:
                - Ấm áp, rõ ràng, trưởng thành; gần gũi nhưng không suồng sã.
                - Thực tế, không định mệnh, không khẳng định tuyệt đối, không tư vấn y tế.

                Cách trả lời:
                - Ưu tiên gắn với MBTI / Tử Vi / reading journey nếu có trong context.
                - Nếu thiếu dữ liệu, thừa nhận nhẹ và hỏi thêm — không bịa hồ sơ.
                - Ngắn gọn đủ sâu: thường 1–3 đoạn, có thể kết bằng 1 câu hỏi mở.

                """);

        prompt.append("## Hồ sơ người dùng\n");
        prompt.append("- Tên: ").append(StringUtils.hasText(user.getFullName()) ? user.getFullName() : "chưa có").append('\n');
        prompt.append("- MBTI: ").append(StringUtils.hasText(user.getMbtiType()) ? user.getMbtiType() : "chưa có").append('\n');

        Optional<UserTuViChart> chartOpt = userTuViChartRepository.findByUserId(user.getId());
        if (chartOpt.isPresent()) {
            prompt.append("- Đã có lá số Tử Vi đã lưu (profile_key=")
                    .append(nullToDash(chartOpt.get().getProfileKey()))
                    .append("). Dùng reading/Tử Vi context bên dưới nếu có; không đọc thô toàn bộ chart JSON.\n");
        } else {
            prompt.append("- Chưa có lá số Tử Vi đã lưu.\n");
        }

        String userId = user.getId().toString();
        if (StringUtils.hasText(activeJourney)) {
            prompt.append("- Hành trình đang mở: ").append(activeJourney).append('\n');
            appendReadingExcerpt(prompt, userId, activeJourney);
        } else {
            prompt.append("- Chưa gắn hành trình cụ thể; tham chiếu các reading gần nhất nếu hữu ích.\n");
            for (String journey : List.of("identity", "career", "love", "tuvi")) {
                appendReadingExcerpt(prompt, userId, journey);
            }
        }

        prompt.append("""

                Nguyên tắc quan trọng:
                - Không học hỏi / không cập nhật "bộ nhớ dài hạn" ngoài context được cung cấp và lịch sử thread hiện tại.
                - Không bịa reading, cung, sao, hay chi tiết hồ sơ không có trong context.
                """);

        return prompt.toString();
    }

    private void appendReadingExcerpt(StringBuilder prompt, String userId, String journey) {
        String type = JOURNEY_READING_TYPES.get(journey.toLowerCase(Locale.ROOT));
        if (type == null) {
            return;
        }
        aiReadingRepository.findTopByUserIdAndTypeOrderByUpdatedAtDesc(userId, type).ifPresent(reading -> {
            prompt.append("\n### Reading ").append(journey);
            if (StringUtils.hasText(reading.getChapterTitle())) {
                prompt.append(" — ").append(reading.getChapterTitle());
            }
            prompt.append('\n');
            prompt.append(excerpt(reading.getContent())).append('\n');
        });
    }

    private static String excerpt(String content) {
        if (!StringUtils.hasText(content)) {
            return "(trống)";
        }
        String normalized = content.trim().replaceAll("\\s+", " ");
        if (normalized.length() <= READING_EXCERPT_CHARS) {
            return normalized;
        }
        return normalized.substring(0, READING_EXCERPT_CHARS) + "…";
    }

    private static String deriveTitle(String content) {
        String cleaned = content.trim().replaceAll("\\s+", " ");
        if (cleaned.length() <= 48) {
            return cleaned;
        }
        return cleaned.substring(0, 48).trim() + "…";
    }

    private static String normalizeJourney(String journey) {
        if (!StringUtils.hasText(journey)) {
            return null;
        }
        String normalized = journey.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "identity", "career", "love", "life", "tuvi" -> normalized;
            default -> null;
        };
    }

    private static String normalizeRole(String role) {
        if ("assistant".equalsIgnoreCase(role)) {
            return "assistant";
        }
        return "user";
    }

    private static String nullToDash(String value) {
        return StringUtils.hasText(value) ? value : "-";
    }

    private MentorConversationSummaryResponse toSummary(MentorConversation conversation) {
        MentorConversationSummaryResponse summary = new MentorConversationSummaryResponse();
        summary.setId(conversation.getId());
        summary.setTitle(conversation.getTitle());
        summary.setActiveJourney(conversation.getActiveJourney());
        summary.setCreatedAt(conversation.getCreatedAt());
        summary.setUpdatedAt(conversation.getUpdatedAt());

        Optional<MentorMessage> lastUser = messageRepository
                .findFirstByConversationIdAndRoleOrderByCreatedAtDesc(conversation.getId(), "user");
        if (lastUser.isPresent()) {
            summary.setPreview("Bạn: " + truncatePreview(lastUser.get().getContent()));
        } else {
            Optional<MentorMessage> lastAssistant = messageRepository
                    .findFirstByConversationIdAndRoleOrderByCreatedAtDesc(conversation.getId(), "assistant");
            summary.setPreview(lastAssistant.map(m -> truncatePreview(m.getContent())).orElse(""));
        }
        return summary;
    }

    private MentorConversationDetailResponse toDetail(MentorConversation conversation) {
        MentorConversationDetailResponse detail = new MentorConversationDetailResponse();
        detail.setId(conversation.getId());
        detail.setTitle(conversation.getTitle());
        detail.setActiveJourney(conversation.getActiveJourney());
        detail.setCreatedAt(conversation.getCreatedAt());
        detail.setUpdatedAt(conversation.getUpdatedAt());
        detail.setMessages(
                messageRepository.findByConversationIdOrderByCreatedAtAsc(conversation.getId()).stream()
                        .filter(m -> !"system".equalsIgnoreCase(m.getRole()))
                        .map(this::toMessageResponse)
                        .toList()
        );
        return detail;
    }

    private MentorMessageResponse toMessageResponse(MentorMessage message) {
        MentorMessageResponse response = new MentorMessageResponse();
        response.setId(message.getId());
        response.setRole(message.getRole());
        response.setContent(message.getContent());
        response.setCreatedAt(message.getCreatedAt());
        return response;
    }

    private static String truncatePreview(String content) {
        String cleaned = content.trim().replaceAll("\\s+", " ");
        if (cleaned.length() <= 80) {
            return cleaned;
        }
        return cleaned.substring(0, 80).trim() + "…";
    }
}
