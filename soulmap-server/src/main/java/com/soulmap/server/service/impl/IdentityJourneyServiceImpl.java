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
import com.soulmap.server.dto.request.ai.IdentityJourneyRequest;
import com.soulmap.server.dto.response.CungDto;
import com.soulmap.server.dto.response.LaSoResponse;
import com.soulmap.server.dto.response.ai.IdentityJourneyResponse;
import com.soulmap.server.entity.AiReading;
import com.soulmap.server.repository.AiReadingRepository;
import com.soulmap.server.service.IdentityJourneyService;
import com.soulmap.server.service.TuViService;
import com.soulmap.server.service.UserTuViChartService;
import com.soulmap.server.service.SoulMapProfileKeyService;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class IdentityJourneyServiceImpl implements IdentityJourneyService {
    private static final Set<String> IDENTITY_CUNG_NAMES = Set.of(
            "Mệnh", "Quan Lộc", "Tài Bạch", "Thiên Di", "Phúc Đức", "Tật Ách"
    );

    private static final String IDENTITY_PROMPT = """
            Bạn là Linh Nhi, người viết hành trình tự nhận thức cho SoulMap.

            Dùng dữ liệu lá số trong user message để tạo hành trình "Tôi là ai" dành riêng cho một người. MBTI chỉ để đối chiếu hoặc diễn đạt dễ hiểu hơn, không thay thế căn cứ từ lá số.

            Quy tắc:
            - Viết 8 đến 10 chapter thành một mạch truyện. Không dùng title chung cho mọi người.
            - Mỗi chapter có cả strength và watchOut. Điểm cần lưu ý phải là mặt dễ mất cân bằng, không phán xét, không hù dọa và có hướng điều chỉnh thực tế.
            - Mọi nhận định phải bám dữ liệu trong JSON. Không bịa sao, trạng thái miếu/vượng/hãm, hội chiếu hay sự kiện đời người.
            - Ưu tiên Mệnh, Thân, Mệnh - Quan Lộc - Tài Bạch - Thiên Di, Phúc Đức, Tứ Hóa và đại vận hiện tại. Chỉ dùng yếu tố L. hoặc ĐV. để nói về giai đoạn hiện tại, không coi là tính cách gốc.
            - Câu title phải nói trực tiếp, cụ thể với người đọc. Ví dụ tốt: "Bạn không hợp sống trong một khuôn có sẵn", "Bạn dễ mệt khi phải mạnh quá lâu". Không dùng: "Chân dung cốt lõi", "La bàn giá trị", "Điểm mạnh của bạn".
            - strength và watchOut viết đời thường, rõ ràng, không liệt kê thuật ngữ Tử Vi dày đặc. Không chẩn đoán sức khỏe; nếu dùng Tật Ách chỉ nói về áp lực, nhịp sống và nhu cầu hồi phục.
            - Không nói định mệnh, không khẳng định tuyệt đối. Dùng "có thể", "dễ", "khi thiếu cân bằng" khi nêu rủi ro.
            - Gọi người đọc là "bạn". Không tự xưng là AI, trợ lý, hệ thống hay ChatGPT.

            Chỉ trả về JSON hợp lệ, không markdown fence hay nội dung ngoài JSON:
            {
              "journeyTitle": "Tôi là ai",
              "tagline": "Một câu ngắn viết riêng cho người này",
              "coreNarrative": "Tóm tắt 2-3 câu về trục phát triển nổi bật.",
              "chapters": [
                {
                  "order": 1,
                  "title": "Tiêu đề cá nhân hóa",
                  "strength": { "title": "Điểm đáng phát huy", "content": "Diễn giải đời thường." },
                  "watchOut": { "title": "Mặt cần giữ cân bằng", "content": "Diễn giải đời thường kèm hướng điều chỉnh." }
                }
              ],
              "closing": "Lời kết 80-120 từ, không định mệnh hóa."
            }
            """;

    private final AiProviderClient aiProviderClient;
    private final TuViService tuViService;
    private final UserTuViChartService userTuViChartService;
    private final AiReadingRepository aiReadingRepository;
    private final SoulmapAiProperties properties;
    private final ObjectMapper objectMapper;
    private final SoulMapProfileKeyService profileKeyService;

    public IdentityJourneyServiceImpl(
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
    public IdentityJourneyResponse generateIdentityJourney(IdentityJourneyRequest request) {
        try {
            String profileKey = profileKey(request);
            if (userTuViChartService.isRegenerationRequired(Long.valueOf(request.getUserId()), profileKey)) throw new BusinessException(ErrorCode.SOULMAP_ERROR_0001);
            AiReading existing = aiReadingRepository.findTopByUserIdAndTypeAndChapterIdOrderByUpdatedAtDesc(request.getUserId(), "IDENTITY_JOURNEY", "identity-journey-01").orElse(null);
            if (existing != null && existing.getProfileKey() != null) {
                if (!profileKey.equals(existing.getProfileKey())) throw new BusinessException(ErrorCode.SOULMAP_ERROR_0001);
                IdentityJourneyResponse cached = objectMapper.readValue(existing.getContent(), IdentityJourneyResponse.class);
                cached.setId(existing.getId()); cached.setType(existing.getType());
                return cached;
            }
            TuViRequest tuViRequest = toTuViRequest(request);
            LaSoResponse laSo = tuViService.getLaSo(tuViRequest);
            userTuViChartService.save(Long.valueOf(request.getUserId()), tuViRequest, laSo, profileKey);
            String payloadJson = objectMapper.writeValueAsString(buildIdentityUserPayload(request, laSo));
            String rawJson = aiProviderClient.generateStructuredJson(new AiChatRequest(
                    properties.getModel(),
                    List.of(new AiMessage("system", IDENTITY_PROMPT), new AiMessage("user", payloadJson)),
                    properties.getTemperature(),
                    properties.getStructuredOutputMode()
            ));

            IdentityJourneyResponse response = objectMapper.readValue(extractJson(rawJson), IdentityJourneyResponse.class);
            normalizeAndValidate(response);
            AiReading reading = saveReading(request, payloadJson, response, profileKey);
            response.setId(reading.getId());
            response.setType(reading.getType());
            return response;
        } catch (AiServiceException exception) {
            throw exception;
        } catch (JsonProcessingException exception) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0002, exception);
        }
    }

    static Map<String, Object> buildIdentityUserPayload(IdentityJourneyRequest request, LaSoResponse laSo) {
        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("name", request.getName().trim());
        profile.put("mbtiType", request.getMbtiType());
        profile.put("goal", request.getGoal());
        profile.put("currentConcern", request.getCurrentConcern());
        profile.put("viewYear", request.getViewYear());

        Map<String, Object> chart = new LinkedHashMap<>();
        chart.put("cucFull", laSo.getCucFull());
        chart.put("amDuong", laSo.getAmDuong());
        chart.put("viTriCungMenh", laSo.getViTriCungMenh());
        chart.put("viTriCungThan", laSo.getViTriCungThan());
        chart.put("cungs", laSo.getCungs() == null ? List.of() : laSo.getCungs().stream()
                .filter(cung -> isIdentityCung(cung, laSo.getViTriCungThan()))
                .map(IdentityJourneyServiceImpl::toCungPayload)
                .toList());

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("profile", profile);
        payload.put("laSo", chart);
        return payload;
    }

    private TuViRequest toTuViRequest(IdentityJourneyRequest request) {
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

    private AiReading saveReading(
            IdentityJourneyRequest request,
            String payloadJson,
            IdentityJourneyResponse response,
            String profileKey
    ) throws JsonProcessingException {
        AiReading reading = new AiReading();
        reading.setUserId(request.getUserId());
        reading.setType("IDENTITY_JOURNEY");
        reading.setChapterId("identity-journey-01");
        reading.setChapterTitle("Tôi là ai");
        reading.setProfileKey(profileKey);
        reading.setModel(properties.getModel());
        reading.setRequestJson(objectMapper.writeValueAsString(request));
        reading.setLaSoJson(payloadJson);
        reading.setContent(objectMapper.writeValueAsString(response));
        return aiReadingRepository.save(reading);
    }

    private String profileKey(IdentityJourneyRequest request) {
        return profileKeyService.create(request.getMbtiType(), request.getDay(), request.getMonth(), request.getYear(), request.getCalendar(), request.getGender(), request.getHour(), request.getMin(), request.getTimezone());
    }

    private String extractJson(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0002);
        }
        String trimmed = raw.trim().replaceFirst("^```(?:json)?", "").replaceFirst("```$", "").trim();
        int start = trimmed.indexOf('{');
        int end = trimmed.lastIndexOf('}');
        if (start < 0 || end <= start) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0002);
        }
        return trimmed.substring(start, end + 1);
    }

    private void normalizeAndValidate(IdentityJourneyResponse response) {
        if (response == null || response.getChapters() == null
                || response.getChapters().size() < 8 || response.getChapters().size() > 10) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        for (IdentityJourneyResponse.IdentityJourneyChapter chapter : response.getChapters()) {
            if (chapter.getTitle() == null || chapter.getTitle().isBlank()
                    || chapter.getStrength() == null || chapter.getWatchOut() == null) {
                throw new AiServiceException(ErrorCode.AI_ERROR_0003);
            }
        }
        response.setJourneyTitle("Tôi là ai");
    }

    private static boolean isIdentityCung(CungDto cung, String viTriCungThan) {
        if (cung == null) return false;
        return IDENTITY_CUNG_NAMES.contains(cung.getName()) || isAtPosition(cung.getDiaChi(), viTriCungThan);
    }

    private static boolean isAtPosition(String diaChi, String position) {
        if (diaChi == null || position == null || position.isBlank()) return false;
        int separator = diaChi.lastIndexOf('.');
        String branch = separator >= 0 ? diaChi.substring(separator + 1) : diaChi;
        return branch.equalsIgnoreCase(position.trim());
    }

    private static Map<String, Object> toCungPayload(CungDto cung) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("name", cung.getName());
        payload.put("diaChi", cung.getDiaChi());
        payload.put("daiVan", cung.getDaiVan());
        payload.put("daiVanText", cung.getDaiVanText());
        payload.put("tieuVan", cung.getTieuVan());
        payload.put("chinhTinh", cung.getChinhTinh());
        payload.put("catTinh", cung.getCatTinh());
        payload.put("hungTinh", cung.getHungTinh());
        payload.put("tuHoa", cung.getTuHoa());
        return payload;
    }
}
