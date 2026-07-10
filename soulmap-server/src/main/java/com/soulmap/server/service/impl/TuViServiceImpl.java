package com.soulmap.server.service.impl;

import com.soulmap.server.common.error.TuViSourceException;
import com.soulmap.server.dto.request.TuViRequest;
import com.soulmap.server.dto.response.CungDto;
import com.soulmap.server.dto.response.LaSoResponse;
import com.soulmap.server.dto.response.LuanGiaiDto;
import com.soulmap.server.dto.response.tuvi.CungModel;
import com.soulmap.server.dto.response.tuvi.LuanGiai;
import com.soulmap.server.dto.response.tuvi.SaoInfo;
import com.soulmap.server.dto.response.tuvi.TuHoa;
import com.soulmap.server.dto.response.tuvi.TuViData;
import com.soulmap.server.dto.response.tuvi.TuViResponse;
import com.soulmap.server.service.TuViService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TuViServiceImpl implements TuViService {

    private static final Map<String, String> CUNG_KEYS = Map.ofEntries(
            Map.entry("Tý", "ty_b"),
            Map.entry("Sửu", "suu"),
            Map.entry("Dần", "dan"),
            Map.entry("Mão", "mao"),
            Map.entry("Thìn", "thin"),
            Map.entry("Tỵ", "ty"),
            Map.entry("Ngọ", "ngo"),
            Map.entry("Mùi", "mui"),
            Map.entry("Thân", "than"),
            Map.entry("Dậu", "dau"),
            Map.entry("Tuất", "tuat"),
            Map.entry("Hợi", "hoi")
    );
    private static final List<String> ORDERED_KEYS = Arrays.asList(
            "ty", "ngo", "mui", "than", "dau", "tuat", "hoi", "ty_b", "suu", "dan", "mao", "thin"
    );

    private final WebClient webClient;

    public TuViServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://tuvi.vn/api/v1")
                .defaultHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .build();
    }

    @Override
    public LaSoResponse getLaSo(TuViRequest request) {
        try {
            TuViResponse createResponse = webClient.post()
                    .uri("/la-so")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(buildRequestBody(request))
                    .retrieve()
                    .bodyToMono(TuViResponse.class)
                    .block();

            if (createResponse == null || createResponse.getData() == null || createResponse.getData().getSlug() == null) {
                throw new TuViSourceException("Khong the khoi tao la so tu tuvi.vn.");
            }

            TuViResponse detailResponse = webClient.get()
                    .uri("/la-so/{slug}", createResponse.getData().getSlug())
                    .retrieve()
                    .bodyToMono(TuViResponse.class)
                    .block();

            if (detailResponse == null || detailResponse.getData() == null) {
                throw new TuViSourceException("Khong the lay chi tiet la so tu tuvi.vn.");
            }

            return transformToLaSoResponse(detailResponse.getData());
        } catch (WebClientResponseException exception) {
            throw new TuViSourceException("Server nguon tra ve loi HTTP: " + exception.getStatusCode().value(), exception);
        } catch (TuViSourceException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new TuViSourceException("Loi ket noi API tuvi.vn: " + exception.getMessage(), exception);
        }
    }

    private Map<String, Object> buildRequestBody(TuViRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("name", request.getName());
        body.put("day", request.getDay());
        body.put("month", request.getMonth());
        body.put("year", request.getYear());
        body.put("solar_calendar", "solar".equalsIgnoreCase(request.getCalendar()) || "true".equalsIgnoreCase(request.getCalendar()));
        body.put("hour_id", getHourId(request.getHour()));
        body.put("male", "male".equalsIgnoreCase(request.getGender()) || "true".equalsIgnoreCase(request.getGender()));
        body.put("nam_xem", request.getViewYear());
        body.put("thang_xem", Calendar.getInstance().get(Calendar.MONTH) + 1);
        return body;
    }

    private LaSoResponse transformToLaSoResponse(TuViData data) {
        Map<String, CungDto> tempMap = Optional.ofNullable(data.getCungModel()).orElseGet(Collections::emptyList).stream()
                .filter(cungModel -> CUNG_KEYS.containsKey(cungModel.getName()))
                .collect(Collectors.toMap(cungModel -> CUNG_KEYS.get(cungModel.getName()), this::toCungDto, (first, second) -> first));

        List<CungDto> cungs = new ArrayList<>();
        for (String key : ORDERED_KEYS) {
            if (tempMap.containsKey(key)) {
                cungs.add(tempMap.get(key));
            }
        }

        return LaSoResponse.builder()
                .summary(data.getLaSoBrief())
                .gender(data.getGender())
                .timeFull(data.getTimeFull())
                .solarFull(data.getSolarFull())
                .currentTimeFull(data.getCurrentTimeFull())
                .canChiFull(data.getCanChiFull())
                .cucFull(data.getCucFull())
                .amDuong(data.getAmDuong())
                .loaiHanh(data.getLoaiHanh())
                .viTriCungMenh(data.getViTriCungMenh())
                .viTriCungThan(data.getViTriCungThan())
                .canXuong(data.getCanXuong())
                .laiNhanCung(data.getLaiNhanCung())
                .cungs(cungs)
                .cungXau(emptyIfNull(data.getCungXau()))
                .cungXauDetail(emptyIfNull(data.getCungXauDetail()))
                .daiVanXau(data.getDaiVanXau())
                .tieuVanXau(data.getTieuVanXau())
                .generalLuanGiai(toLuanGiaiDtos(data.getGeneralLg()))
                .menhLuanGiai(toLuanGiaiDtos(data.getMenhLg()))
                .daiVanLuanGiai(toLuanGiaiDtos(data.getDaiVanLg()))
                .build();
    }

    private CungDto toCungDto(CungModel cungModel) {
        String key = CUNG_KEYS.get(cungModel.getName());

        return CungDto.builder()
                .key(key)
                .gridClass("cung-" + key.replace("_", "-"))
                .name(cungModel.getCung() != null ? cungModel.getCung().getName() : "")
                .diaChi(cungModel.getFullName())
                .hanhCung(readHanhCung(cungModel))
                .daiVan(String.valueOf(cungModel.getDaiVan()))
                .daiVanText(cungModel.getDaiVanText())
                .tieuVan(cungModel.getLuuNien())
                .trangSinh(cungModel.getTrangSinh() != null ? cungModel.getTrangSinh().getName() : "")
                .chinhTinh(readStarNames(cungModel.getChinhTinh()))
                .catTinh(readStarsByStatus(cungModel.getSao(), "C"))
                .hungTinh(readStarsExceptStatus(cungModel.getSao(), "C"))
                .tuHoa(readTuHoa(cungModel.getTuHoaPhais()))
                .build();
    }

    private List<LuanGiaiDto> toLuanGiaiDtos(List<LuanGiai> luanGiaiList) {
        return Optional.ofNullable(luanGiaiList).orElseGet(Collections::emptyList).stream()
                .filter(luanGiai -> luanGiai.getTitle() != null || luanGiai.getContent() != null)
                .map(luanGiai -> LuanGiaiDto.builder()
                        .id(luanGiai.getId())
                        .title(luanGiai.getTitle())
                        .content(luanGiai.getContent())
                        .sourceId(luanGiai.getLuanGiaiSource() != null && luanGiai.getLuanGiaiSource().getId() > 0
                                ? luanGiai.getLuanGiaiSource().getId()
                                : null)
                        .sourceName(luanGiai.getLuanGiaiSource() != null ? luanGiai.getLuanGiaiSource().getName() : null)
                        .build())
                .collect(Collectors.toList());
    }

    private List<String> readTuHoa(List<TuHoa> tuHoaList) {
        return Optional.ofNullable(tuHoaList).orElseGet(Collections::emptyList).stream()
                .filter(tuHoa -> tuHoa.getSao() != null && tuHoa.getSao().getName() != null)
                .map(tuHoa -> tuHoa.getSao().getName() + (tuHoa.getCung() != null ? " - " + tuHoa.getCung() : ""))
                .collect(Collectors.toList());
    }

    private List<String> emptyIfNull(List<String> values) {
        return values == null ? Collections.emptyList() : values;
    }

    private String readHanhCung(CungModel cungModel) {
        if (cungModel.getCung() == null || cungModel.getCung().getNguHanh() == null) {
            return "";
        }

        return cungModel.getCung().getNguHanh().getName();
    }

    private List<String> readStarNames(List<SaoInfo> saoInfos) {
        return Optional.ofNullable(saoInfos).orElseGet(Collections::emptyList).stream()
                .filter(saoInfo -> saoInfo.getSao() != null && saoInfo.getSao().getName() != null)
                .map(saoInfo -> saoInfo.getSao().getName())
                .collect(Collectors.toList());
    }

    private List<String> readStarsByStatus(List<SaoInfo> saoInfos, String status) {
        return Optional.ofNullable(saoInfos).orElseGet(Collections::emptyList).stream()
                .filter(saoInfo -> saoInfo.getSao() != null && status.equals(saoInfo.getSao().getStatus()))
                .map(saoInfo -> saoInfo.getSao().getName())
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private List<String> readStarsExceptStatus(List<SaoInfo> saoInfos, String status) {
        return Optional.ofNullable(saoInfos).orElseGet(Collections::emptyList).stream()
                .filter(saoInfo -> saoInfo.getSao() != null && !status.equals(saoInfo.getSao().getStatus()))
                .map(saoInfo -> saoInfo.getSao().getName())
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private int getHourId(int hour) {
        if (hour >= 23 || hour < 1) return 1;
        if (hour >= 1 && hour < 3) return 2;
        if (hour >= 3 && hour < 5) return 3;
        if (hour >= 5 && hour < 7) return 4;
        if (hour >= 7 && hour < 9) return 5;
        if (hour >= 9 && hour < 11) return 6;
        if (hour >= 11 && hour < 13) return 7;
        if (hour >= 13 && hour < 15) return 8;
        if (hour >= 15 && hour < 17) return 9;
        if (hour >= 17 && hour < 19) return 10;
        if (hour >= 19 && hour < 21) return 11;
        return 12;
    }
}
