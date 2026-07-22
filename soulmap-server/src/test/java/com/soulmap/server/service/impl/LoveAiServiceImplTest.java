package com.soulmap.server.service.impl;

import com.soulmap.server.dto.response.CungDto;
import com.soulmap.server.dto.response.LaSoResponse;
import com.soulmap.server.dto.request.ai.LoveReadingRequest;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class LoveAiServiceImplTest {

    @Test
    void lovePayloadKeepsRelevantCungsIncludingCungThan() {
        LaSoResponse laSo = LaSoResponse.builder()
                .gender("F")
                .viTriCungThan("Mão")
                .cungs(List.of(
                        cung("Mệnh", "C.Ngọ"),
                        cung("Phu Thê", "M.Thìn"),
                        cung("Phúc Đức", "N.Thân"),
                        cung("Nô Bộc", "G.Tuất"),
                        cung("Thiên Di", "B.Tý"),
                        cung("Tật Ách", "Ấ.Sửu"),
                        cung("Tử Tức", "Đ.Mão"),
                        cung("Quan Lộc", "T.Dậu")
                ))
                .generalLuanGiai(List.of())
                .cungXau(List.of("Phúc Đức"))
                .build();

        Map<String, Object> payload = LoveAiServiceImpl.buildLoveLaSoPayload(laSo);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> cungs = (List<Map<String, Object>>) payload.get("cungs");
        assertThat(cungs)
                .extracting(cung -> cung.get("name"))
                .containsExactly("Mệnh", "Phu Thê", "Phúc Đức", "Nô Bộc", "Thiên Di", "Tật Ách", "Tử Tức", "Quan Lộc");
        assertThat(payload)
                .doesNotContainKeys("generalLuanGiai", "menhLuanGiai", "daiVanLuanGiai", "cungXau");
    }

    @Test
    void loveCungPayloadExcludesUiMetadata() {
        CungDto phuThe = CungDto.builder()
                .key("thin")
                .gridClass("cung-thin")
                .name("Phu Thê")
                .diaChi("M.Thìn")
                .chinhTinh(List.of("Thiên Đồng"))
                .build();
        LaSoResponse laSo = LaSoResponse.builder().cungs(List.of(phuThe)).build();

        Map<String, Object> payload = LoveAiServiceImpl.buildLoveLaSoPayload(laSo);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> cungs = (List<Map<String, Object>>) payload.get("cungs");
        assertThat(cungs.getFirst())
                .containsEntry("chinhTinh", List.of("Thiên Đồng"))
                .doesNotContainKeys("key", "gridClass");
    }

    @Test
    void loveUserPayloadSeparatesProfileFromSelectedChartData() {
        LoveReadingRequest request = new LoveReadingRequest();
        request.setName(" Phong ");
        request.setGender("male");
        request.setDay(2);
        request.setMonth(2);
        request.setYear(2002);
        request.setCalendar("lunar");
        request.setHour(3);
        request.setMin(30);
        request.setTimezone(7);
        request.setViewYear(2026);
        LaSoResponse laSo = LaSoResponse.builder()
                .cungs(List.of(cung("Phu Thê", "M.Thìn")))
                .build();

        Map<String, Object> payload = LoveAiServiceImpl.buildLoveUserPayload(request, laSo);

        @SuppressWarnings("unchecked")
        Map<String, Object> profile = (Map<String, Object>) payload.get("profile");
        @SuppressWarnings("unchecked")
        Map<String, Object> selectedLaSo = (Map<String, Object>) payload.get("laSo");
        assertThat(profile)
                .containsEntry("name", "Phong")
                .containsEntry("viewYear", 2026)
                .containsEntry("timezone", 7);
        assertThat(selectedLaSo).containsKey("cungs");
        assertThat(payload).containsOnlyKeys("profile", "laSo");
    }

    private CungDto cung(String name, String diaChi) {
        return CungDto.builder().name(name).diaChi(diaChi).build();
    }
}
