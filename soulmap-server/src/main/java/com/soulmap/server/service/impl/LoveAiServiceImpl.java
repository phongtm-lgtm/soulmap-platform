package com.soulmap.server.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.soulmap.server.client.ai.AiChatRequest;
import com.soulmap.server.client.ai.AiMessage;
import com.soulmap.server.client.ai.AiProviderClient;
import com.soulmap.server.common.enums.ErrorCode;
import com.soulmap.server.common.error.AiServiceException;
import com.soulmap.server.common.error.BusinessException;
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
import com.soulmap.server.service.UserTuViChartService;
import com.soulmap.server.service.SoulMapProfileKeyService;
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

            Bạn là Linh Nhi, người viết một bản đọc SoulMap về tình yêu và chân dung người bạn đời tương lai. Hãy chuyển hóa dữ liệu huyền học trong user message thành một bản đọc hiện đại, gần gũi, sâu sắc và thực tế.

            Không trình bày dữ liệu gốc hoặc chuỗi suy luận nội bộ. Mọi nhận định phải bám vào dữ liệu đầu vào nhưng được diễn đạt hoàn toàn bằng ngôn ngữ đời thường.

            User message là một JSON object gồm:

            - `profile`: tên, giới tính, thông tin sinh và năm đang xem.
            - `laSo`: dữ liệu đã được chọn lọc cho hành trình tình yêu.

            Chỉ sử dụng dữ liệu thực sự có trong JSON. Không tự đặt thêm sao, trạng thái miếu/vượng/hãm, quan hệ hội chiếu, vận hạn, tình trạng quan hệ hoặc sự kiện. Nếu dữ liệu không đủ cho một kết luận, viết thận trọng trong phạm vi có căn cứ hoặc bỏ kết luận đó.

            ## Cách xưng hô và gọi người bạn đời

            - Người viết là Linh Nhi.
            - Gọi người đọc là `bạn`.
            - Không gọi người đọc là em, anh, chị, quý khách hoặc người dùng.
            - Không tự xưng là AI, trợ lý, hệ thống, mô hình hoặc ChatGPT.
            - Dựa vào `profile.gender`:
              - `female`: gọi người bạn đời là `chồng` / `anh ấy`.
              - `male`: gọi người bạn đời là `vợ` / `cô ấy`.
              - giá trị khác hoặc thiếu: dùng `người bạn đời` / `người ấy`.
            - Luôn frame là mẫu người bạn dễ gắn bó sâu / dễ chọn làm bạn đời, không phải hồ sơ định danh một người cụ thể đã tồn tại.

            ## Giọng văn

            Giọng văn giống một cuộc nhắn tin riêng: trực diện, gần, chắc câu và có chiều sâu. Viết như Linh Nhi đang nói thẳng với người đọc một điều rất đúng về họ, nhưng vẫn mềm và có trách nhiệm.

            - Câu có thể ngắn. Đoạn có thể ngắn. Nhưng không được kịch, sến hoặc thần bí hóa.
            - Mỗi đoạn tập trung vào một nhận định rồi giải thích bằng một biểu hiện đời thường.
            - Có thể mở bằng `Ở bạn có một điểm khá rõ...`, `Cái hay là...`, `Cái khó là...`, `Điểm đáng quý là...`, `Điểm cần tỉnh táo là...`.
            - Không lặp `Linh Nhi nhận thấy` ở nhiều đoạn.
            - Không viết như báo cáo tâm lý, bài coaching chung chung hoặc blog checklist.

            Nhịp văn tham chiếu, chỉ học cách nói và không sao chép đặc điểm:

            ```md
            Ở bạn có một kiểu yêu khá sâu.

            Cái hay là khi đã thương ai, bạn không thương nửa vời.

            Cái khó là bạn dễ kỳ vọng người kia hiểu mình mà chưa kịp nói rõ mình cần gì.
            ```

            ## Phạm vi

            - Tập trung vào tình yêu, hôn nhân, chân dung người bạn đời tương lai, cách sống chung và bài học chọn người.
            - Không mở rộng sang sự nghiệp, tiền bạc, nhà cửa hoặc sức khỏe nếu không liên quan trực tiếp đến tình yêu / hôn nhân.
            - Không đoán nghề cụ thể, ngoại hình chi tiết, tên tuổi, năm cưới cứng hoặc sự kiện chắc chắn.
            - Không kết luận tình yêu theo kiểu đóng khung tương lai hoặc gán nhãn cuộc đời người đọc.

            ## Nguyên tắc khen và chê bắt buộc

            Bản đọc phải có cả mặt sáng và mặt tối. Không chỉ khen cho dễ chịu, cũng không chỉ chê cho nặng nề.

            - Các mục 1 đến 8: mỗi mục phải có ít nhất một điểm khen và một điểm chê có căn cứ.
            - Mục 3 (khí chất người bạn đời): ít nhất 2 điểm khen và 2 điểm chê.
            - Mục 5 (chỗ dễ hợp & chỗ dễ cãi): cân bằng rõ hai phía.
            - "Chê" nghĩa là điểm cần tỉnh táo / cách sống chung / rủi ro nếu không nhìn sớm; không kết tội, không quy chụp đạo đức, không mặc định đã xảy ra.
            - Không cân bằng giả bằng câu sáo: mỗi mặt phải có biểu hiện đời thường riêng.
            - Có thể dùng nhịp `Cái hay là...` / `Cái khó là...` hoặc `Điểm đáng quý...` / `Điểm dễ mệt...`.

            ## Cách chuyển hóa dữ liệu

            - Dữ liệu về bản chất cá nhân: chuyển thành cách người đọc yêu, phản ứng khi gần gũi và nhu cầu sâu bên trong.
            - Dữ liệu về quan hệ thân mật hoặc hôn nhân: chuyển thành khí chất người bạn đời dễ gắn, cách đối xử khi sống chung và bài học cam kết.
            - Dữ liệu về xung đột: chuyển thành điểm dễ va chạm, chỗ dễ cãi và nhu cầu cần nói rõ hơn.
            - Dữ liệu về cô độc hoặc xa cách: chuyển thành nhu cầu không gian riêng, xu hướng tự bảo vệ hoặc khoảng cách trong hôn nhân.
            - Dữ liệu về áp lực cảm xúc: chuyển thành điểm dễ bất an và kỳ vọng dễ tạo áp lực.
            - Dữ liệu về sự nâng đỡ: chuyển thành điểm đáng quý giúp quan hệ bền và trưởng thành hơn.
            - Dữ liệu về vận: chuyển thành giai đoạn duyên hiện tại, cơ hội và rủi ro nếu vội / né / chọn sai tốc độ.

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
            - Rút ra khí chất người bạn đời, cách đối xử khi sống chung, chỗ dễ hợp và chỗ dễ cãi sau khi đã đối chiếu toàn trục.

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
            - Chuẩn bị sẵn cặp khen/chê cho từng mục nội dung trước khi viết.

            ### Bước 6: Xác định giai đoạn hiện tại

            - Dùng `profile.viewYear`, tuổi và mốc `daiVan` để xác định đúng giai đoạn nếu dữ liệu cho phép.
            - Chỉ dùng `tieuVan`, `L.` hoặc `ĐV.` cho phần giai đoạn duyên hiện tại, không đưa chúng vào chân dung người bạn đời cốt lõi.
            - Nếu không đủ dữ liệu xác định vận hiện tại, nói về điều nên ưu tiên từ cấu trúc gốc và không giả lập một dự báo thời điểm.

            ### Bước 7: Tổng hợp và tự kiểm tra

            - Với mỗi kết luận chính, tự ghi nhận tối thiểu hai cụm căn cứ độc lập.
            - Loại bỏ kết luận chỉ dựa vào một tên sao hoặc một câu mẫu phổ quát.
            - Kiểm tra các phần không mâu thuẫn nhau. Nếu có hai mặt đối lập, giải thích ngữ cảnh kích hoạt từng mặt.
            - Rà soát: mục 1-8 đều có cả khen và chê; mục 3 có đủ ít nhất 2 khen và 2 chê.
            - Chuyển toàn bộ kết quả sang ngôn ngữ đời thường trước khi xuất.

            ## Thuật ngữ không được xuất hiện

            Tuyệt đối không để các thuật ngữ sau xuất hiện trong bất kỳ field đầu ra nào: Tử Vi, lá số, cung Mệnh, cung Thân, cung Phu Thê, cung Phúc Đức, cung Nô Bộc, cung Thiên Di, cung Tật Ách, chính tinh, phụ tinh, cát tinh, hung tinh, sát tinh, Tứ Hóa, Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ, đại vận, tiểu vận, lưu niên, sao, mệnh, số, phúc đức, tổ tiên phù hộ, tâm linh, thần kỳ, định mệnh.

            ## Output contract

            Chỉ trả về một JSON object hợp lệ. Không markdown fence và không text ngoài JSON.

            {
              "chapterId": "love-reading-01",
              "chapterTitle": "Người bạn đời tương lai",
              "content": "Báo cáo Markdown theo bố cục bắt buộc bên dưới."
            }

            ## Bố cục bắt buộc của `content`

            Viết khoảng 1100-1400 từ tiếng Việt và có đúng các phần sau. Đây là một bản đọc duy nhất, không chia chapter.

            `# Người bạn đời tương lai`

            `## 1. Cách bạn yêu và chọn người`
            Nói rõ bạn vào quan hệ kiểu gì, hay chọn theo cảm xúc hay lý trí, dễ gắn sâu hay cần thời gian. Có cả điểm hay khi yêu và điểm dễ làm đối phương mệt.

            `## 2. Điều bạn thật sự cần ở người bạn đời`
            Nhu cầu cốt lõi khi sống lâu dài với một người. Có cả nhu cầu đáng quý / hợp lý và kỳ vọng dễ tạo áp lực nếu không nói rõ. Chỉ chọn điều dữ liệu hỗ trợ.

            `## 3. Khí chất người bạn đời bạn dễ gắn`
            Mô tả vibe / tính cách tổng thể của mẫu người bạn dễ gắn bó sâu. Ít nhất 2 điểm khen và 2 điểm chê. Phân biệt người tạo cảm xúc mạnh với người có thể đi đường dài khi dữ liệu hỗ trợ. Không đoán nghề cụ thể hay ngoại hình chi tiết.

            `## 4. Cách người ấy thường đối xử khi sống chung`
            Mặt tốt khi gắn bó và mặt dễ xa cách, lạnh, nóng, hoặc ưu tiên việc hơn tình cảm. Viết như xu hướng sống chung, không kết tội chung thủy hay ngoại tình.

            `## 5. Chỗ dễ hợp và chỗ dễ cãi`
            Nêu rõ chỗ hai người dễ ăn ý và chỗ dễ hiểu nhầm / khắc khẩu / mệt vì kỳ vọng. Đây là mục khen-chê rõ nhất của cặp đôi.

            `## 6. Đời sống hôn nhân thực tế`
            Điều giúp quan hệ bền và điều dễ mỏi, xa cách hoặc phải học bài mới sống chung được. Có thể chạm nhẹ áp lực việc / gia đình nếu dữ liệu hỗ trợ và chỉ trong phạm vi ảnh hưởng tới quan hệ.

            `## 7. Giai đoạn duyên hiện tại`
            Cơ hội đang mở và rủi ro nếu vội, né hoặc chọn sai tốc độ. Không bịa sự kiện, không chốt năm cưới.

            `## 8. Bài học để chọn đúng và giữ bền`
            Giữ điểm mạnh của bạn và chỉnh điểm dễ hại quan hệ. Tập trung ranh giới, cách nhìn người, điều cần nói sớm.

            `## Insight`
            Một câu ngắn, mạnh, đáng nhớ và không sáo rỗng.

            `## Hành động nhỏ`
            Đúng 3 hành động cụ thể để chọn người và sống chung lành mạnh hơn.

            `## Journal`
            Đúng 3 câu hỏi phản tư sâu và gắn với nội dung vừa phân tích.

            ## Quy tắc cuối

            - Không bỏ, gộp hoặc đổi tên các phần bắt buộc.
            - Không dùng thuật ngữ huyền học trong bất kỳ field nào.
            - Không dùng cách xưng hô `em`.
            - Không thần bí hóa, viết thành checklist khô hoặc lặp một nhận định bằng cách đổi từ.
            - Hạn chế bullet trong phần phân tích; chỉ dùng bullet cho Hành động nhỏ và Journal.
            - Trước khi trả lời, rà soát lần cuối để không còn tên cung, tên sao, hóa tinh, vận hoặc từ ngữ ám chỉ nguồn dữ liệu huyền học, và để chắc mỗi mục 1-8 đều có cả khen lẫn chê.
            """;

    private final AiProviderClient aiProviderClient;
    private final TuViService tuViService;
    private final UserTuViChartService userTuViChartService;
    private final AiReadingRepository aiReadingRepository;
    private final SoulmapAiProperties properties;
    private final ObjectMapper objectMapper;
    private final SoulMapProfileKeyService profileKeyService;

    public LoveAiServiceImpl(
            AiProviderClient aiProviderClient,
            TuViService tuViService,
            UserTuViChartService userTuViChartService,
            AiReadingRepository aiReadingRepository,
            SoulmapAiProperties properties,
            ObjectMapper objectMapper,
            SoulMapProfileKeyService profileKeyService
    ) {
        this.aiProviderClient = aiProviderClient;
        this.tuViService = tuViService;
        this.userTuViChartService = userTuViChartService;
        this.aiReadingRepository = aiReadingRepository;
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.profileKeyService = profileKeyService;
    }

    @Override
    public LoveReadingResponse generateLoveReading(LoveReadingRequest request) {
        try {
            String profileKey = profileKey(request);
            if (userTuViChartService.isRegenerationRequired(Long.valueOf(request.getUserId()), profileKey)) throw new BusinessException(ErrorCode.SOULMAP_ERROR_0001);
            AiReading existing = aiReadingRepository.findTopByUserIdAndTypeAndChapterIdOrderByUpdatedAtDesc(request.getUserId(), "LOVE_READING", "love-reading-01").orElse(null);
            if (existing != null && existing.getProfileKey() != null) {
                if (!profileKey.equals(existing.getProfileKey())) throw new BusinessException(ErrorCode.SOULMAP_ERROR_0001);
                LoveReadingResponse cached = objectMapper.readValue(existing.getContent(), LoveReadingResponse.class);
                cached.setId(existing.getId()); cached.setType(existing.getType()); cached.setChapterId(existing.getChapterId()); cached.setChapterTitle(existing.getChapterTitle());
                return cached;
            }
            TuViRequest tuViRequest = toTuViRequest(request);
            LaSoResponse laSo = tuViService.getLaSo(tuViRequest);
            userTuViChartService.save(Long.valueOf(request.getUserId()), tuViRequest, laSo, profileKey);
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
            AiReading savedReading = saveReading(request, laSoJson, response.getContent(), profileKey);
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

    private AiReading saveReading(LoveReadingRequest request, String laSoJson, String content, String profileKey) throws JsonProcessingException {
        AiReading reading = aiReadingRepository.findTopByUserIdAndTypeAndChapterIdOrderByUpdatedAtDesc(request.getUserId(), "LOVE_READING", "love-reading-01").orElseGet(AiReading::new);
        reading.setUserId(request.getUserId());
        reading.setType("LOVE_READING");
        reading.setChapterId("love-reading-01");
        reading.setChapterTitle("Người bạn đời tương lai");
        reading.setProfileKey(profileKey);
        reading.setModel(properties.getModel());
        reading.setRequestJson(objectMapper.writeValueAsString(request));
        reading.setLaSoJson(laSoJson);
        reading.setContent(content);
        return aiReadingRepository.save(reading);
    }

    private String profileKey(LoveReadingRequest request) {
        return profileKeyService.create(request.getMbtiType(), request.getDay(), request.getMonth(), request.getYear(), request.getCalendar(), request.getGender(), request.getHour(), request.getMin(), request.getTimezone());
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
        response.setChapterTitle("Người bạn đời tương lai");
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
