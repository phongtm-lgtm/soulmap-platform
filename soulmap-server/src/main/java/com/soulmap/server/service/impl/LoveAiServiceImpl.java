package com.soulmap.server.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.soulmap.server.client.ai.AiChatRequest;
import com.soulmap.server.client.ai.AiMessage;
import com.soulmap.server.client.ai.AiProviderClient;
import com.soulmap.server.common.enums.ErrorCode;
import com.soulmap.server.common.error.AiServiceException;
import com.soulmap.server.config.SoulmapAiProperties;
import com.soulmap.server.dto.request.TuViRequest;
import com.soulmap.server.dto.request.ai.LoveReadingRequest;
import com.soulmap.server.entity.AiReading;
import com.soulmap.server.dto.response.LaSoResponse;
import com.soulmap.server.dto.response.ai.LoveReadingResponse;
import com.soulmap.server.repository.AiReadingRepository;
import com.soulmap.server.service.LoveAiService;
import com.soulmap.server.service.TuViService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoveAiServiceImpl implements LoveAiService {
    private static final String LOVE_PROMPT = """
            # SoulMap Love Reading - Linh Nhi

            ## Vai trò

            Bạn là Linh Nhi, người đồng hành của SoulMap trong hành trình tình yêu và kết nối cảm xúc.

            ## Cách xưng hô

            - Người viết là Linh Nhi.
            - Gọi người đọc là bạn.
            - Ưu tiên dùng "Linh Nhi nhận thấy...", "Có thể bạn từng cảm thấy...", "Linh Nhi muốn hỏi bạn...".
            - Không tự xưng là AI, trợ lý, hệ thống, mô hình hoặc ChatGPT.

            ## Mục tiêu

            Tạo một bản đọc tình yêu giúp người dùng hiểu cách mình yêu, điều mình cần trong một mối quan hệ, những điểm dễ tổn thương, kiểu kết nối phù hợp và bài học cảm xúc hiện tại.

            ## Độ dài

            900--1200 từ.

            ## Phạm vi

            - Chỉ viết về tình yêu, kết nối cảm xúc, nhu cầu thân mật, cách người dùng mở lòng và bài học trong quan hệ.
            - Không viết thành bài luận Tử Vi tổng quát.
            - Không mở rộng sang sự nghiệp, tiền bạc, nhà cửa, sức khỏe nếu không liên quan trực tiếp đến tình yêu.
            - Không dùng thuật ngữ Tử Vi trong nội dung trả về.
            - Không nói "Cung Phu Thê...", "sao...", "mệnh...", "lá số cho thấy...".
            - Không phán định người dùng chắc chắn sẽ yêu ai, cưới khi nào, ly hôn hay hạnh phúc tuyệt đối.
            - Không gieo sợ hãi, không định mệnh hóa chuyện tình cảm.

            ## Cấu trúc

            1. Mở đầu ngắn
            2. Cách bạn yêu và mở lòng
            3. Điều bạn thật sự cần trong một mối quan hệ
            4. Điểm dễ tổn thương hoặc lặp lại trong tình yêu
            5. Kiểu người và kiểu kết nối phù hợp
            6. Insight
            7. Góc nhìn của Linh Nhi
            8. 3 hành động nhỏ để yêu lành mạnh hơn
            9. 3 câu hỏi Journal

            ## Quy tắc độ sâu

            - Hạn chế bullet. Toàn bài không quá 12 bullet.
            - Viết như một chương sách, không viết như blog checklist.
            - Mỗi nhận định quan trọng cần có một lý do và một biểu hiện thực tế.
            - Có ít nhất 2 đoạn tạo cảm giác "đúng thật".
            - Có ít nhất 1 đoạn đối thoại trực tiếp từ Linh Nhi.
            - Có ít nhất 1 hình ảnh ẩn dụ dễ nhớ về tình yêu hoặc sự mở lòng.
            - Insight phải là một câu đủ mạnh để người đọc muốn chụp màn hình.
            - Journal phải là câu hỏi sâu, hơi "đau", khiến người đọc dừng lại suy nghĩ.

            ## Ví dụ phong cách

            Không viết:

            "Bạn cần một người chung thủy."

            Hãy viết:

            "Có thể điều bạn cần không chỉ là một người ở lại. Điều bạn cần là cảm giác khi mình yếu đi một chút, người kia không dùng sự yếu mềm đó để làm bạn thấy nhỏ bé hơn. Với bạn, tình yêu không chỉ là có người bên cạnh. Nó là cảm giác được an toàn khi không cần phải luôn mạnh."

            Không viết:

            "Bạn sợ bị tổn thương."

            Hãy viết:

            "Có những người khép lòng vì họ không còn tin vào tình yêu. Nhưng cũng có những người khép lòng vì họ từng yêu rất thật. Linh Nhi có cảm giác bạn thuộc nhóm thứ hai: không phải không muốn mở lòng, mà là cần biết người kia có đủ tử tế để bước vào thế giới bên trong của bạn hay không."

            ## Góc nhìn của Linh Nhi

            Sau Insight, bắt buộc thêm section:

            ### Góc nhìn của Linh Nhi

            Đây là đoạn chữ ký cảm xúc của SoulMap. Viết như một lời nhắn riêng, ấm, chậm, có chiều sâu. Không bullet.
            """;

    private final AiProviderClient aiProviderClient;
    private final TuViService tuViService;
    private final AiReadingRepository aiReadingRepository;
    private final SoulmapAiProperties properties;
    private final ObjectMapper objectMapper;

    public LoveAiServiceImpl(
            AiProviderClient aiProviderClient,
            TuViService tuViService,
            AiReadingRepository aiReadingRepository,
            SoulmapAiProperties properties,
            ObjectMapper objectMapper
    ) {
        this.aiProviderClient = aiProviderClient;
        this.tuViService = tuViService;
        this.aiReadingRepository = aiReadingRepository;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    @Override
    public LoveReadingResponse generateLoveReading(LoveReadingRequest request) {
        try {
            LaSoResponse laSo = tuViService.getLaSo(toTuViRequest(request));
            String laSoJson = objectMapper.writeValueAsString(laSo);

            String rawJson = aiProviderClient.generateStructuredJson(new AiChatRequest(
                    properties.getModel(),
                    List.of(
                            new AiMessage("system", LOVE_PROMPT),
                            new AiMessage("user", laSoJson)
                    ),
                    properties.getTemperature(),
                    properties.getStructuredOutputMode()
            ));

            LoveReadingResponse response = parseLoveReadingResponse(rawJson);
            normalizeAndValidate(response);
            AiReading savedReading = saveReading(request, laSoJson, response.getContent());
            response.setId(savedReading.getId());
            response.setType(savedReading.getType());
            response.setChapterId(savedReading.getChapterId());
            response.setChapterTitle(savedReading.getChapterTitle());
            return response;
        } catch (AiServiceException exception) {
            throw exception;
        } catch (JsonProcessingException exception) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0002, exception);
        }
    }

    private TuViRequest toTuViRequest(LoveReadingRequest request) {
        TuViRequest tuViRequest = new TuViRequest();
        tuViRequest.setName(request.getName());
        tuViRequest.setDay(request.getDay());
        tuViRequest.setMonth(request.getMonth());
        tuViRequest.setYear(request.getYear());
        tuViRequest.setCalendar(request.getCalendar());
        tuViRequest.setGender(request.getGender());
        tuViRequest.setHour(request.getHour());
        tuViRequest.setMin(request.getMin());
        tuViRequest.setTimezone(request.getTimezone());
        tuViRequest.setViewYear(request.getViewYear());
        return tuViRequest;
    }

    private AiReading saveReading(LoveReadingRequest request, String laSoJson, String content) throws JsonProcessingException {
        AiReading reading = new AiReading();
        reading.setUserId(request.getUserId());
        reading.setType("LOVE_READING");
        reading.setChapterId("love-reading-01");
        reading.setChapterTitle("Bản đồ tình yêu");
        reading.setModel(properties.getModel());
        reading.setRequestJson(objectMapper.writeValueAsString(request));
        reading.setLaSoJson(laSoJson);
        reading.setContent(content);
        return aiReadingRepository.save(reading);
    }

    private LoveReadingResponse parseLoveReadingResponse(String raw) throws JsonProcessingException {
        if (raw == null || raw.isBlank()) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0002);
        }

        try {
            return objectMapper.readValue(extractJson(raw), LoveReadingResponse.class);
        } catch (AiServiceException | JsonProcessingException exception) {
            LoveReadingResponse response = new LoveReadingResponse();
            response.setContent(raw.trim());
            return response;
        }
    }

    private String extractJson(String raw) {
        String trimmed = raw.trim();
        if (trimmed.startsWith("```")) {
            trimmed = trimmed.replaceFirst("^```(?:json)?", "").replaceFirst("```$", "").trim();
        }

        int start = trimmed.indexOf('{');
        int end = trimmed.lastIndexOf('}');
        if (start < 0 || end <= start) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0002);
        }
        return trimmed.substring(start, end + 1);
    }

    private void normalizeAndValidate(LoveReadingResponse response) {
        if (response == null || response.getContent() == null || response.getContent().isBlank()) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
    }
}
