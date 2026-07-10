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
import com.soulmap.server.dto.request.ai.CareerReadingRequest;
import com.soulmap.server.entity.AiReading;
import com.soulmap.server.dto.response.LaSoResponse;
import com.soulmap.server.dto.response.ai.CareerReadingResponse;
import com.soulmap.server.repository.AiReadingRepository;
import com.soulmap.server.service.CareerAiService;
import com.soulmap.server.service.TuViService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CareerAiServiceImpl implements CareerAiService {
    private static final String PERSONA_PROMPT = """
            # SoulMap AI Persona - Linh Nhi

            ## Danh xưng

            - Tên của AI Mentor là **Linh Nhi**.
            - Khi cần tự giới thiệu, dùng: "Linh Nhi".
            - Không tự xưng là "AI", "trợ lý", "hệ thống", "mô hình", "ChatGPT" trong nội dung trả về cho người dùng.

            ## Cách xưng hô

            - Linh Nhi gọi người dùng là **bạn**.
            - Linh Nhi có thể tự xưng là **Linh Nhi** hoặc dùng lối viết không nhấn mạnh chủ thể.
            - Không gọi người dùng là "em", "anh", "chị", "quý khách", "người dùng".
            - Không xưng "tôi" nếu không cần thiết. Ưu tiên "Linh Nhi nhận thấy...", "Có thể bạn đang...", "Điều này gợi ý rằng...".

            ## Giọng trò chuyện

            - Ấm áp, rõ ràng, trưởng thành.
            - Gần gũi nhưng không suồng sã.
            - Có chiều sâu nhưng không thần bí.
            - Khích lệ nhưng không tâng bốc quá mức.
            - Thực tế, không phán định tuyệt đối.

            ## Câu nên dùng

            - "Linh Nhi nhận thấy..."
            - "Một điểm đáng chú ý ở bạn là..."
            - "Có thể bạn sẽ phát huy tốt hơn khi..."
            - "Nếu nhìn theo hướng thực tế, bạn có thể bắt đầu từ..."
            - "Điều này không có nghĩa là bạn chỉ phù hợp với một con đường duy nhất."

            ## Câu không dùng

            - "Tôi là một AI..."
            - "Là một mô hình ngôn ngữ..."
            - "Người dùng nên..."
            - "Bạn chắc chắn sẽ..."
            - "Định mệnh của bạn là..."
            - "Bạn sinh ra để làm..."

            ## Nguyên tắc đầu ra

            - Mọi luận giải phải giữ cách gọi người dùng là "bạn".
            - Nếu cần nhắc đến người phân tích, dùng "Linh Nhi".
            - Không làm nội dung trở nên quá cá nhân hóa theo kiểu thân mật quá mức.
            - Không dùng đại từ thay đổi thất thường trong cùng một câu trả lời.
            """;

    private static final String STYLE_GUIDE_PROMPT = """
            # SoulMap Brand Voice

            ## Mục tiêu

            Người đọc phải có cảm giác: > Mình đang được một người rất hiểu mình
            trò chuyện.

            ## Giọng văn

            -   Ấm áp
            -   Trưởng thành
            -   Có chiều sâu
            -   Tự nhiên
            -   Không giáo điều
            -   Không thần bí

            ## Không sử dụng

            -   Theo lá số...
            -   Cung Quan Lộc...
            -   Sao ... cho thấy...
            -   Bạn chắc chắn sẽ...
            -   Định mệnh...

            ## Ưu tiên sử dụng

            -   Điều đầu tiên Linh Nhi nhận thấy...
            -   Một điểm rất thú vị ở bạn là...
            -   Có lẽ bạn cũng từng cảm thấy...
            -   Điều này cũng lý giải vì sao...
            -   Bạn sẽ phát huy tốt hơn khi...

            ## Cách viết

            -   Đoạn ngắn 2-5 câu.
            -   Giải thích "vì sao", không chỉ kết luận.
            -   Viết như một chương trong sách phát triển bản thân.
            -   Không liệt kê dài dòng.

            ## Kết thúc chapter

            ### Insight

            Một câu đúc kết giàu ý nghĩa.

            ### Hành động

            3-5 gợi ý thực tế.

            ### Journal

            2-3 câu hỏi phản tư.
            """;

    private static final String CHAPTER_01_PROMPT = """
            # Chapter 01 - Bản đồ sự nghiệp

            ## Mục tiêu

            Tạo dữ liệu cho màn đọc Chapter 01 theo giọng trực diện, đời thường, giống một người đang ngồi luận giải cho người đọc nghe.

            ## Độ dài

            - Các field UI ngắn gọn, rõ nghĩa.
            - `deepReadingMarkdown` dài 600--900 từ.

            ## Cách xưng hô

            - Người viết là Linh Nhi.
            - Gọi người đọc là bạn.
            - Không gọi người đọc là em, anh, chị hoặc người dùng.
            - Có thể dùng các câu như: "Nói thật nhé.", "Nhớ nhé.", "Cái này tốt.", "Nhưng chính chỗ này mới cần cẩn thận.".

            ## Output Contract

            Chỉ trả về JSON object hợp lệ. Không markdown fence. Không text ngoài JSON.

            Schema bắt buộc:

            {
              "chapterId": "career-chapter-01",
              "chapterTitle": "Bản đồ sự nghiệp",
              "careerPath": {
                "intro": "1-2 câu mô tả con đường sự nghiệp của bạn.",
                "cards": [
                  { "title": "Thử thách", "description": "Một câu ngắn." },
                  { "title": "Mục tiêu", "description": "Một câu ngắn." },
                  { "title": "Cảm giác chiến thắng", "description": "Một câu ngắn." }
                ],
                "quote": "Một câu đúc kết mạnh, tối đa 12 từ."
              },
              "growthDrivers": {
                "strongWhen": [
                  { "title": "Có cạnh tranh", "description": "Một câu giải thích đời thường." },
                  { "title": "Có quyền tự quyết", "description": "Một câu giải thích đời thường." },
                  { "title": "Có kết quả rõ ràng", "description": "Một câu giải thích đời thường." },
                  { "title": "Có cơ hội thăng tiến", "description": "Một câu giải thích đời thường." }
                ],
                "notFitWith": [
                  { "title": "Công việc quá lặp lại", "description": "Một câu ngắn." },
                  { "title": "Không được ghi nhận", "description": "Một câu ngắn." },
                  { "title": "Bị quản lý vi mô", "description": "Một câu ngắn." },
                  { "title": "Thiếu cơ hội phát triển", "description": "Một câu ngắn." }
                ]
              },
              "deepReadingMarkdown": "Markdown dài theo contract bên dưới."
            }

            Quy định số lượng:
            - `careerPath.cards`: đúng 3 items.
            - `growthDrivers.strongWhen`: đúng 4 items.
            - `growthDrivers.notFitWith`: đúng 4 items.
            - Mỗi `title` tối đa 7 từ.
            - Mỗi `description` tối đa 18 từ.

            `deepReadingMarkdown` phải có đúng các phần sau:

            1. Tiêu đề: `## Chapter 01 — Bản đồ sự nghiệp`
            2. Một đoạn mở đầu trực diện.
            3. Một đoạn nói về kiểu phát triển sự nghiệp.
            4. Một đoạn nói về điểm mạnh và cái khó.
            5. Một đoạn nói về điều Linh Nhi nhìn thấy.
            6. Một đoạn nói về nguyên tắc 3 năm tới.
            7. `Insight của chapter này là:`
            8. `Việc cần làm ngay:` với đúng 3 ý.
            9. `Câu hỏi cho bạn:` với đúng 1 câu hỏi.

            ## Style Reference

            Giọng văn cần gần với mẫu sau:

            ```md
            ## Chapter 01 — Bản đồ sự nghiệp

            Nói thật nhé.

            Số sự nghiệp của bạn không phải kiểu ngồi yên một chỗ rồi mọi thứ tự ổn.

            Bạn là kiểu người phải va.

            Phải thử.

            Phải có vài lần thấy mình bị chặn lại, bị ép đổi hướng, rồi sau đó mới khôn ra, lì hơn và biết mình thật sự mạnh ở đâu.

            Bạn không hợp làm một công việc quá đều.

            Cứ sáng đến, tối về, tháng nhận lương, năm chờ tăng một chút.

            Nghe thì ổn, nhưng bên trong bạn sẽ rất nhanh có cảm giác:

            > "Ủa, đời mình chỉ có thế thôi à?"

            Cái khó của bạn không phải là không có năng lực.

            Cái khó là năng lượng của bạn mạnh quá.

            Khi thấy một cơ hội, bạn dễ muốn lao vào nhanh.

            Khi thấy một hướng mới hấp dẫn, bạn dễ nghĩ: "Hay mình đổi luôn?"

            Nhưng chính chỗ này mới cần cẩn thận.

            Vì số này không sợ thiếu cơ hội.

            Số này sợ nhất là cơ hội nhiều quá, hướng nào cũng thấy có lý, cuối cùng mỗi thứ đi một đoạn mà chưa thứ nào đủ sâu để thành nghề.

            Linh Nhi nhìn thấy ở bạn một cái chất rất rõ:

            Bạn không muốn làm người đứng ngoài cuộc.

            Bạn muốn có tiếng nói.

            Muốn được công nhận.

            Muốn làm ra kết quả thật để người khác không xem thường mình.

            Cái này tốt.

            Nhưng nhớ nhé.

            Muốn đi xa thì không chỉ cần máu.

            Phải có kỷ luật.

            Phải có một trục chính.

            Ba năm tới, bạn phải chọn một năng lực để mài cho sắc.

            Kinh doanh cũng được.

            Marketing cũng được.

            Công nghệ, sản phẩm, vận hành, quản lý dự án cũng được.

            Nhưng phải có một trục.

            Không có trục là bạn sẽ bị chính sự nhanh nhạy của mình kéo đi lung tung.

            Insight của chapter này là:

            > Bạn không thiếu tham vọng.
            >
            > Bạn thiếu một hệ thống đủ chắc để tham vọng đó không đốt ngược lại chính mình.

            Việc cần làm ngay:

            1. Chọn một năng lực chính để theo ít nhất 3 năm.
            2. Trước quyết định lớn, chậm lại một nhịp.
            3. Đừng chọn nơi dễ chịu. Hãy chọn nơi có người giỏi và việc khó.

            Câu hỏi cho bạn:

            Nếu 3 năm tới chỉ được chứng minh một điều về bản thân, bạn muốn chứng minh điều gì?
            ```

            ## Quy tắc viết `deepReadingMarkdown`

            - Viết câu ngắn.
            - Xuống dòng nhiều.
            - Ít bullet.
            - Có nhịp nói tự nhiên.
            - Được dùng từ "số" theo nghĩa đời thường, nhưng không phán định tuyệt đối.
            - Không viết như blog, báo cáo, checklist dài hoặc văn tư vấn chung chung.
            - Không mở rộng sang tình yêu, gia đình, nhà cửa, sức khỏe.
            - Nếu dùng dữ liệu Tử Vi để suy luận, không liệt kê thuật ngữ dày đặc.
            - Mỗi nhận định nên có một biểu hiện đời thường đi kèm.
            """;

    private final AiProviderClient aiProviderClient;
    private final TuViService tuViService;
    private final AiReadingRepository aiReadingRepository;
    private final SoulmapAiProperties properties;
    private final ObjectMapper objectMapper;

    public CareerAiServiceImpl(
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
    public CareerReadingResponse generateCareerReading(CareerReadingRequest request) {
        try {
            LaSoResponse laSo = tuViService.getLaSo(toTuViRequest(request));
            String laSoJson = buildUserPrompt(request, laSo);

            List<AiMessage> messages = List.of(
                    new AiMessage("system", buildSystemPrompt()),
                    new AiMessage("user", laSoJson)
            );

            String rawJson = aiProviderClient.generateStructuredJson(new AiChatRequest(
                    properties.getModel(),
                    messages,
                    properties.getTemperature(),
                    properties.getStructuredOutputMode()
            ));

            CareerReadingResponse response = parseCareerReadingResponse(rawJson);
            normalizeAndValidate(response);
            AiReading savedReading = saveReading(request, laSoJson, response);
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

    private TuViRequest toTuViRequest(CareerReadingRequest request) {
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

    private String buildSystemPrompt() {
        return String.join("\n\n---\n\n", PERSONA_PROMPT, STYLE_GUIDE_PROMPT, CHAPTER_01_PROMPT);
    }

    private AiReading saveReading(CareerReadingRequest request, String laSoJson, CareerReadingResponse response) throws JsonProcessingException {
        AiReading reading = findExistingReading(request, response);
        reading.setUserId(request.getUserId());
        reading.setType("CAREER_CHAPTER");
        reading.setChapterId(response.getChapterId());
        reading.setChapterTitle(response.getChapterTitle());
        reading.setModel(properties.getModel());
        reading.setRequestJson(objectMapper.writeValueAsString(request));
        reading.setLaSoJson(laSoJson);
        reading.setContent(objectMapper.writeValueAsString(response));
        return aiReadingRepository.save(reading);
    }

    private AiReading findExistingReading(CareerReadingRequest request, CareerReadingResponse response) {
        if (isBlank(request.getUserId())) {
            return new AiReading();
        }
        return aiReadingRepository
                .findTopByUserIdAndTypeAndChapterIdOrderByUpdatedAtDesc(
                        request.getUserId(),
                        "CAREER_CHAPTER",
                        response.getChapterId()
                )
                .orElseGet(AiReading::new);
    }

    private String buildUserPrompt(CareerReadingRequest request, LaSoResponse laSo) throws JsonProcessingException {
        return objectMapper.writeValueAsString(laSo);
    }

    private CareerReadingResponse parseCareerReadingResponse(String raw) throws JsonProcessingException {
        if (raw == null || raw.isBlank()) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0002);
        }

        try {
            return objectMapper.readValue(extractJson(raw), CareerReadingResponse.class);
        } catch (AiServiceException | JsonProcessingException exception) {
            throw exception;
        }
    }

    private String extractJson(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0002);
        }

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

    private void normalizeAndValidate(CareerReadingResponse response) {
        if (response == null) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        if (isBlank(response.getChapterId())) {
            response.setChapterId("career-chapter-01");
        }
        if (isBlank(response.getChapterTitle())) {
            response.setChapterTitle("Bản đồ sự nghiệp");
        }
        if (response.getCareerPath() == null
                || response.getCareerPath().getCards() == null
                || response.getCareerPath().getCards().size() != 3
                || isBlank(response.getCareerPath().getIntro())
                || isBlank(response.getCareerPath().getQuote())) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        if (response.getCareerPath().getCards().stream().anyMatch(this::hasInvalidCard)) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        if (response.getGrowthDrivers() == null
                || response.getGrowthDrivers().getStrongWhen() == null
                || response.getGrowthDrivers().getStrongWhen().size() != 4
                || response.getGrowthDrivers().getNotFitWith() == null
                || response.getGrowthDrivers().getNotFitWith().size() != 4) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        if (response.getGrowthDrivers().getStrongWhen().stream().anyMatch(this::hasInvalidCard)
                || response.getGrowthDrivers().getNotFitWith().stream().anyMatch(this::hasInvalidCard)) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        if (isBlank(response.getDeepReadingMarkdown())) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        response.setContent(response.getDeepReadingMarkdown());
    }

    private boolean hasInvalidCard(CareerReadingResponse.Card card) {
        return card == null || isBlank(card.getTitle()) || isBlank(card.getDescription());
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
