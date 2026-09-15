package com.soulmap.server.service.impl;

import com.soulmap.server.dto.request.ai.IdentityJourneyRequest;
import com.soulmap.server.dto.response.CungDto;
import com.soulmap.server.dto.response.LaSoResponse;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class IdentityJourneyServiceImplTest {
    @Test
    void identityPayloadIncludesCorePalacesAndPalaceContainingThan() {
        IdentityJourneyRequest request = new IdentityJourneyRequest();
        request.setName(" Phong ");
        request.setMbtiType("ENTJ");
        request.setGoal("Hiểu bản thân");
        request.setViewYear(2026);
        LaSoResponse laSo = LaSoResponse.builder()
                .viTriCungMenh("Sửu")
                .viTriCungThan("Mão")
                .cungs(List.of(
                        cung("Mệnh", "Q.Sửu"), cung("Quan Lộc", "A.Tỵ"),
                        cung("Tài Bạch", "K.Dậu"), cung("Thiên Di", "Đ.Mùi"),
                        cung("Phúc Đức", "Q.Mão"), cung("Phu Thê", "T.Hợi")
                ))
                .build();

        Map<String, Object> payload = IdentityJourneyServiceImpl.buildIdentityUserPayload(request, laSo);

        @SuppressWarnings("unchecked")
        Map<String, Object> profile = (Map<String, Object>) payload.get("profile");
        @SuppressWarnings("unchecked")
        Map<String, Object> chart = (Map<String, Object>) payload.get("laSo");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> cungs = (List<Map<String, Object>>) chart.get("cungs");
        assertThat(profile).containsEntry("name", "Phong").containsEntry("mbtiType", "ENTJ");
        assertThat(cungs).extracting(cung -> cung.get("name"))
                .containsExactly("Mệnh", "Quan Lộc", "Tài Bạch", "Thiên Di", "Phúc Đức");
    }

    private CungDto cung(String name, String diaChi) {
        return CungDto.builder().name(name).diaChi(diaChi).build();
    }
}
