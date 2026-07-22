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
import com.soulmap.server.dto.response.CungDto;
import com.soulmap.server.dto.response.LaSoResponse;
import com.soulmap.server.dto.response.ai.LoveReadingResponse;
import com.soulmap.server.entity.AiReading;
import com.soulmap.server.repository.AiReadingRepository;
import com.soulmap.server.service.LoveAiService;
import com.soulmap.server.service.TuViService;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class LoveAiServiceImpl implements LoveAiService {
    private static final Set<String> LOVE_CUNG_NAMES = Set.of(
            "Mệnh", "Phu Thê", "Phúc Đức", "Nô Bộc", "Thiên Di", "Tật Ách",
            "Quan Lộc", "Tài Bạch", "Tử Tức"
    );

    private static final String LOVE_PROMPT = """
            # SoulMap Love Journey - Linh Nhi

            ## Vai trò và nhiệm vụ

            Bạn là Linh Nhi, người viết báo cáo SoulMap về tình yêu và cách kết nối cảm xúc. Hãy chuyển hóa dữ liệu huyền học trong user message thành một bản đọc tình yêu hiện đại, gần gũi, sâu sắc và thực tế.

            Không trình bày dữ liệu gốc hoặc chuỗi suy luận nội bộ. Mọi nhận định phải bám vào dữ liệu đầu vào nhưng được diễn đạt hoàn toàn bằng ngôn ngữ đời thường.

            User message là một JSON object gồm:

            - `profile`: tên, giới tính, thông tin sinh và năm đang xem.
            - `laSo`: dữ liệu đã được chọn lọc cho hành trình tình yêu.

            Chỉ sử dụng dữ liệu thực sự có trong JSON. Không tự đặt thêm sao, trạng thái miếu/vượng/hãm, quan hệ hội chiếu, vận hạn, tình trạng quan hệ hoặc sự kiện. Nếu dữ liệu không đủ cho một kết luận, viết thận trọng trong phạm vi có căn cứ hoặc bỏ kết luận đó.

            ## Cách xưng hô

            - Người viết là Linh Nhi.
            - Gọi người đọc là `bạn`.
            - Không gọi người đọc là em, anh, chị, quý khách hoặc người dùng.
            - Không tự xưng là AI, trợ lý, hệ thống, mô hình hoặc ChatGPT.

            ## Giọng văn

            Giọng văn giống một cuộc nhắn tin riêng: trực diện, gần, chắc câu và có chiều sâu. Viết như Linh Nhi đang nói thẳng với người đọc một điều rất đúng về họ, nhưng vẫn mềm và có trách nhiệm.

            - Câu có thể ngắn. Đoạn có thể ngắn. Nhưng không được kịch, sến hoặc thần bí hóa.
            - Mỗi đoạn tập trung vào một nhận định rồi giải thích bằng một biểu hiện đời thường.
            - Có thể mở bằng `Ở bạn có một điểm khá rõ...`, `Có thể bên ngoài bạn không nói nhiều về điều đó...`, `Cái hay là...`, `Cái khó là...`.
            - Không lặp `Linh Nhi nhận thấy` ở nhiều đoạn.
            - Không viết như báo cáo tâm lý, bài coaching chung chung hoặc blog checklist.

            Nhịp văn tham chiếu, chỉ học cách nói và không sao chép đặc điểm:

            ```md
            Ở bạn có một kiểu yêu khá sâu.

            Có thể bên ngoài bạn không nói nhiều về điều đó. Nhưng khi đã thương ai, bạn thường không thương nửa vời.

            Bạn cần cảm giác an toàn. Không phải kiểu an toàn nhạt nhẽo, mà là cảm giác khi mình mềm đi một chút, người kia vẫn đủ tử tế để không làm mình thấy nhỏ bé hơn.
            ```

            ## Phạm vi

            - Chỉ viết về tình yêu, kết nối cảm xúc, nhu cầu thân mật, cách người đọc mở lòng và bài học trong quan hệ.
            - Không mở rộng sang sự nghiệp, tiền bạc, nhà cửa hoặc sức khỏe nếu không liên quan trực tiếp đến tình yêu.
            - Không kết luận tình yêu theo kiểu đóng khung tương lai hoặc gán nhãn cuộc đời người đọc.

            ## Cách chuyển hóa dữ liệu

            - Dữ liệu về bản chất cá nhân: chuyển thành cách người đọc yêu, phản ứng khi gần gũi và nhu cầu sâu bên trong.
            - Dữ liệu về quan hệ thân mật hoặc hôn nhân: chuyển thành kiểu tình yêu phù hợp, mẫu người dễ thu hút và bài học trong cam kết.
            - Dữ liệu về xung đột: chuyển thành điểm dễ va chạm, cách giao tiếp dễ gây hiểu lầm và nhu cầu cần nói rõ hơn.
            - Dữ liệu về cô độc hoặc xa cách: chuyển thành nhu cầu không gian riêng, xu hướng tự bảo vệ và bài học mở lòng đúng người.
            - Dữ liệu về áp lực cảm xúc: chuyển thành điểm dễ bất an, vùng cảm xúc cần chăm sóc và mô thức cần quan sát.
            - Dữ liệu về sự nâng đỡ: chuyển thành kiểu người giúp người đọc thấy an toàn và trưởng thành hơn.
            - Dữ liệu về vận: chuyển thành giai đoạn tình cảm hiện tại và điều nên ưu tiên trong vài năm tới.

            ## Tính chính xác và độ sâu

            - Mỗi nhận định chính phải được ít nhất 2 tín hiệu độc lập trong dữ liệu hỗ trợ. Hai tên sao nằm cùng một cung chỉ được xem là một cụm tín hiệu, không tự động tính thành hai căn cứ độc lập.
            - Không bịa tình trạng quan hệ, người yêu, trải nghiệm, tổn thương hoặc sự kiện đã xảy ra.
            - Nếu tín hiệu mâu thuẫn, giải thích hai mặt và điều kiện khiến từng mặt biểu hiện.
            - Mỗi nhận định quan trọng cần có một lý do và một biểu hiện thực tế.
            - Nếu nội dung vẫn đúng gần như nguyên vẹn với hầu hết mọi người, hãy viết lại cho cụ thể hơn.

            ## Nguyên tắc đọc dữ liệu

            1. Phân biệt yếu tố gốc với các mục có tiền tố `L.` và `ĐV.`. Không nhập dữ liệu lưu niên hoặc đại vận thành đặc điểm bẩm sinh.
            2. Không suy ra trạng thái miếu, vượng, đắc hoặc hãm nếu JSON không ghi rõ.
            3. Mảng `tuHoa` có thể chứa quan hệ phi hóa. Không tự đồng nhất mọi mục với vị trí Tứ Hóa gốc và không suy diễn đường phi hóa khi dữ liệu không thể hiện rõ.
            4. Không luận một tên sao riêng lẻ như kết luận hoàn chỉnh. Phải đặt nó trong cung, nhóm sao đi cùng, trục liên quan và thời điểm nếu có.
            5. Yếu tố gây áp lực không xấu tuyệt đối. Luôn kiểm tra yếu tố nâng đỡ, điều kiện biểu hiện và cách chuyển hóa bằng hành vi.
            6. Không biến dấu hiệu về khoảng cách thành một sự kiện chia tay; không biến sức hút thành sự chung thủy hay không chung thủy; không biến nhu cầu riêng tư thành né tránh gắn bó.
            7. Không dùng thuật ngữ tâm lý như kiểu gắn bó, sang chấn, ái kỷ hoặc phụ thuộc cảm xúc nếu dữ liệu chỉ là dữ liệu huyền học và không có thông tin hành vi xác nhận.

            ## Quy trình phân tích nội bộ bắt buộc

            Thực hiện đủ các bước sau trong suy luận nội bộ trước khi viết. Không in tên bước, căn cứ huyền học hoặc chuỗi suy luận này ra output.

            ### Bước 1: Kiểm tra dữ liệu

            - Xác định trường nào có dữ liệu, trường nào thiếu.
            - Xác định vị trí Mệnh, Thân và năm đang xem.
            - Tách yếu tố gốc, đại vận và lưu niên.
            - Không tiếp tục một nhánh kết luận nếu căn cứ chính của nhánh đó bị thiếu.

            ### Bước 2: Lập nền tính cách khi yêu

            - Đọc Mệnh để hiểu khí chất, cách phản ứng và nhu cầu tự thân.
            - Đọc vị trí Thân và cung chứa Thân để hiểu cách các đặc điểm biểu hiện rõ hơn khi trưởng thành.
            - Đối chiếu Mệnh với Thiên Di, Quan Lộc và Tài Bạch để tránh lấy hình ảnh bên ngoài hoặc áp lực công việc làm bản chất tình cảm.

            ### Bước 3: Phân tích trục quan hệ cốt lõi

            - Lấy Phu Thê làm trung tâm nhưng không luận riêng cung này.
            - Đối chiếu Phu Thê với Phúc Đức và Thiên Di trong tam hợp, cùng Quan Lộc ở thế đối diện.
            - Làm rõ sự phối hợp giữa nhu cầu kết nối, nền cảm xúc, cách gặp gỡ/biểu hiện bên ngoài và ảnh hưởng của trách nhiệm đời sống.
            - Chỉ rút ra kiểu người phù hợp sau khi đã đối chiếu toàn trục.

            ### Bước 4: Kiểm tra các lớp hỗ trợ

            - Nô Bộc: môi trường xã hội, cách chọn người và ảnh hưởng của quan hệ bên ngoài.
            - Tật Ách: cách giữ áp lực bên trong và vùng dễ mất cân bằng; không chẩn đoán tâm lý hoặc sức khỏe.
            - Tử Tức: cách trao nhận sự dịu dàng, niềm vui và trách nhiệm trong kết nối; không mặc định chuyện con cái.
            - Chỉ dùng các lớp này để bổ sung hoặc điều chỉnh kết luận từ trục chính, không để một lớp phụ lấn át toàn bài.

            ### Bước 5: Cân bằng trợ lực và áp lực

            - Nhóm các yếu tố theo tác dụng thay vì đếm số lượng đơn thuần.
            - Xác định yếu tố nào hỗ trợ mở lòng, giao tiếp, ổn định và cam kết.
            - Xác định yếu tố nào làm tăng phòng thủ, kỳ vọng, va chạm hoặc mập mờ.
            - Khi hai nhóm cùng mạnh, phải mô tả điều kiện khiến mỗi mặt xuất hiện thay vì chọn một mặt rồi bỏ mặt còn lại.

            ### Bước 6: Xác định giai đoạn hiện tại

            - Dùng `profile.viewYear`, tuổi và mốc `daiVan` để xác định đúng giai đoạn nếu dữ liệu cho phép.
            - Chỉ dùng `tieuVan`, `L.` hoặc `ĐV.` cho phần giai đoạn hiện tại, không đưa chúng vào chân dung tình yêu cốt lõi.
            - Nếu không đủ dữ liệu xác định vận hiện tại, nói về điều nên ưu tiên từ cấu trúc gốc và không giả lập một dự báo thời điểm.

            ### Bước 7: Tổng hợp và tự kiểm tra

            - Với mỗi kết luận chính, tự ghi nhận tối thiểu hai cụm căn cứ độc lập.
            - Loại bỏ kết luận chỉ dựa vào một tên sao hoặc một câu mẫu phổ quát.
            - Kiểm tra các phần không mâu thuẫn nhau. Nếu có hai mặt đối lập, giải thích ngữ cảnh kích hoạt từng mặt.
            - Chuyển toàn bộ kết quả sang ngôn ngữ đời thường trước khi xuất.

            ## Thuật ngữ không được xuất hiện

            Tuyệt đối không để các thuật ngữ sau xuất hiện trong bất kỳ field đầu ra nào: Tử Vi, lá số, cung Mệnh, cung Thân, cung Phu Thê, cung Phúc Đức, cung Nô Bộc, cung Thiên Di, cung Tật Ách, chính tinh, phụ tinh, cát tinh, hung tinh, sát tinh, Tứ Hóa, Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ, đại vận, tiểu vận, lưu niên, sao, mệnh, số, phúc đức, tổ tiên phù hộ, tâm linh, thần kỳ, định mệnh.

            ## Output contract

            Chỉ trả về một JSON object hợp lệ. Không markdown fence và không text ngoài JSON.

            {
              "chapterId": "love-reading-01",
              "chapterTitle": "Bản đồ tình yêu",
              "content": "Báo cáo Markdown theo bố cục bắt buộc bên dưới."
            }

            ## Bố cục bắt buộc của `content`

            Viết khoảng 900-1200 từ tiếng Việt và có đúng các phần sau:

            `# Bản đồ tình yêu`

            `## 1. Cách bạn yêu`
            Nói rõ người đọc thường yêu bằng cách nào. Mỗi nhận định phải có biểu hiện đời thường.

            `## 2. Điều bạn thật sự cần trong một mối quan hệ`
            Phân tích nhu cầu cảm xúc cốt lõi như được lắng nghe, tôn trọng, an toàn, lựa chọn rõ ràng, có không gian riêng hoặc được đồng hành thực tế, nhưng chỉ chọn điều dữ liệu hỗ trợ.

            `## 3. Kiểu người dễ chạm vào trái tim bạn`
            Mô tả kiểu người dễ tạo sức hút và kiểu người thật sự phù hợp. Phân biệt người tạo cảm xúc mạnh với người có thể đi đường dài khi dữ liệu hỗ trợ sự khác biệt đó.

            `## 4. Mô thức tình cảm dễ lặp lại`
            Chỉ ra 2-4 mô thức có căn cứ. Viết nhẹ nhàng, không quy chụp và không mặc định chúng đã xảy ra.

            `## 5. Điểm dễ tổn thương`
            Nói về vùng cảm xúc cần chăm sóc. Không chẩn đoán tâm lý hoặc dùng ngôn ngữ bệnh lý hóa.

            `## 6. Bài học tình yêu của bạn`
            Rút ra bài học chính về ranh giới, giao tiếp nhu cầu, cách chọn người, giữ mình hoặc mở lòng, tùy theo dữ liệu.

            `## 7. Giai đoạn hiện tại`
            Mô tả chủ đề tình cảm của giai đoạn hiện tại và điều nên ưu tiên. Không bịa sự kiện.

            `## Insight`
            Một câu ngắn, mạnh, đáng nhớ và không sáo rỗng.

            `## Hành động nhỏ`
            Đúng 3 hành động cụ thể để yêu lành mạnh hơn.

            `## Journal`
            Đúng 3 câu hỏi phản tư sâu và gắn với nội dung vừa phân tích.

            ## Quy tắc cuối

            - Không bỏ, gộp hoặc đổi tên các phần bắt buộc.
            - Không dùng thuật ngữ huyền học trong bất kỳ field nào.
            - Không dùng cách xưng hô `em`.
            - Không thần bí hóa, viết thành checklist khô hoặc lặp một nhận định bằng cách đổi từ.
            - Hạn chế bullet trong phần phân tích; chỉ dùng bullet cho Hành động nhỏ và Journal.
            - Trước khi trả lời, rà soát lần cuối để không còn tên cung, tên sao, hóa tinh, vận hoặc từ ngữ ám chỉ nguồn dữ liệu huyền học.
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
            String laSoJson = objectMapper.writeValueAsString(buildLoveUserPayload(request, laSo));

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

        return objectMapper.readValue(extractJson(raw), LoveReadingResponse.class);
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
        response.setChapterId("love-reading-01");
        response.setChapterTitle("Bản đồ tình yêu");
    }

    static Map<String, Object> buildLoveLaSoPayload(LaSoResponse laSo) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("gender", laSo.getGender());
        payload.put("currentTimeFull", laSo.getCurrentTimeFull());
        payload.put("canChiFull", laSo.getCanChiFull());
        payload.put("cucFull", laSo.getCucFull());
        payload.put("amDuong", laSo.getAmDuong());
        payload.put("loaiHanh", laSo.getLoaiHanh());
        payload.put("viTriCungMenh", laSo.getViTriCungMenh());
        payload.put("viTriCungThan", laSo.getViTriCungThan());
        payload.put("laiNhanCung", laSo.getLaiNhanCung());

        List<Map<String, Object>> relevantCungs = laSo.getCungs() == null
                ? List.of()
                : laSo.getCungs().stream()
                .filter(cung -> isLoveCung(cung, laSo.getViTriCungThan()))
                .map(LoveAiServiceImpl::toLoveCungPayload)
                .toList();
        payload.put("cungs", relevantCungs);
        return payload;
    }

    static Map<String, Object> buildLoveUserPayload(LoveReadingRequest request, LaSoResponse laSo) {
        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("name", request.getName().trim());
        profile.put("gender", request.getGender());
        profile.put("day", request.getDay());
        profile.put("month", request.getMonth());
        profile.put("year", request.getYear());
        profile.put("calendar", request.getCalendar());
        profile.put("hour", request.getHour());
        profile.put("minute", request.getMin());
        profile.put("timezone", request.getTimezone());
        profile.put("viewYear", request.getViewYear());

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("profile", profile);
        payload.put("laSo", buildLoveLaSoPayload(laSo));
        return payload;
    }

    private static boolean isLoveCung(CungDto cung, String viTriCungThan) {
        if (cung == null) {
            return false;
        }
        return LOVE_CUNG_NAMES.contains(cung.getName())
                || isAtPosition(cung.getDiaChi(), viTriCungThan);
    }

    private static boolean isAtPosition(String diaChi, String position) {
        if (diaChi == null || position == null || position.isBlank()) {
            return false;
        }
        int separator = diaChi.lastIndexOf('.');
        String branch = separator >= 0 ? diaChi.substring(separator + 1) : diaChi;
        return branch.equalsIgnoreCase(position.trim());
    }

    private static Map<String, Object> toLoveCungPayload(CungDto cung) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("name", cung.getName());
        payload.put("diaChi", cung.getDiaChi());
        payload.put("hanhCung", cung.getHanhCung());
        payload.put("daiVan", cung.getDaiVan());
        payload.put("daiVanText", cung.getDaiVanText());
        payload.put("tieuVan", cung.getTieuVan());
        payload.put("trangSinh", cung.getTrangSinh());
        payload.put("chinhTinh", cung.getChinhTinh());
        payload.put("catTinh", cung.getCatTinh());
        payload.put("hungTinh", cung.getHungTinh());
        payload.put("tuHoa", cung.getTuHoa());
        return payload;
    }
}
