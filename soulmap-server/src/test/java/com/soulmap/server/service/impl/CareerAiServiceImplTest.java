package com.soulmap.server.service.impl;

import com.soulmap.server.dto.response.CungDto;
import com.soulmap.server.dto.response.LaSoResponse;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class CareerAiServiceImplTest {

    @Test
    void careerPayloadKeepsRelevantCungsIncludingCungThan() {
        LaSoResponse laSo = LaSoResponse.builder()
                .gender("F")
                .viTriCungThan("Dần")
                .cungs(List.of(
                        cung("Mệnh", "C.Ngọ"),
                        cung("Quan Lộc", "G.Tuất"),
                        cung("Tài Bạch", "B.Dần"),
                        cung("Thiên Di", "B.Tý"),
                        cung("Phúc Đức", "N.Thân"),
                        cung("Phu Thê", "M.Thìn")
                ))
                .generalLuanGiai(List.of())
                .cungXau(List.of("Phúc Đức"))
                .build();

        Map<String, Object> payload = CareerAiServiceImpl.buildCareerLaSoPayload(laSo);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> cungs = (List<Map<String, Object>>) payload.get("cungs");
        assertThat(cungs)
                .extracting(cung -> cung.get("name"))
                .containsExactly("Mệnh", "Quan Lộc", "Tài Bạch", "Thiên Di", "Phúc Đức");
        assertThat(payload)
                .doesNotContainKeys("generalLuanGiai", "menhLuanGiai", "daiVanLuanGiai", "cungXau");
    }

    @Test
    void careerPayloadAddsCungAtThanPositionWhenItIsNotInDefaultSet() {
        LaSoResponse laSo = LaSoResponse.builder()
                .viTriCungThan("Thìn")
                .cungs(List.of(
                        cung("Mệnh", "C.Ngọ"),
                        cung("Phu Thê", "M.Thìn"),
                        cung("Tử Tức", "Đ.Mão")
                ))
                .build();

        Map<String, Object> payload = CareerAiServiceImpl.buildCareerLaSoPayload(laSo);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> cungs = (List<Map<String, Object>>) payload.get("cungs");
        assertThat(cungs)
                .extracting(cung -> cung.get("name"))
                .containsExactly("Mệnh", "Phu Thê");
    }

    @Test
    void careerCungPayloadExcludesUiMetadata() {
        CungDto menh = CungDto.builder()
                .key("ngo")
                .gridClass("cung-ngo")
                .name("Mệnh")
                .diaChi("C.Ngọ")
                .chinhTinh(List.of("Văn Xương"))
                .build();
        LaSoResponse laSo = LaSoResponse.builder().cungs(List.of(menh)).build();

        Map<String, Object> payload = CareerAiServiceImpl.buildCareerLaSoPayload(laSo);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> cungs = (List<Map<String, Object>>) payload.get("cungs");
        assertThat(cungs.getFirst())
                .containsEntry("chinhTinh", List.of("Văn Xương"))
                .doesNotContainKeys("key", "gridClass");
    }

    private CungDto cung(String name, String diaChi) {
        return CungDto.builder().name(name).diaChi(diaChi).build();
    }
}
