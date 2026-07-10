package com.soulmap.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LaSoResponse {
    private String summary;
    private String gender;
    private String timeFull;
    private String solarFull;
    private String currentTimeFull;
    private String canChiFull;

    private String cucFull;
    private String amDuong;
    private String loaiHanh;
    private String viTriCungMenh;
    private String viTriCungThan;
    private String canXuong;
    private String laiNhanCung;

    private List<CungDto> cungs;
    private List<String> cungXau;
    private List<String> cungXauDetail;
    private String daiVanXau;
    private String tieuVanXau;

    private List<LuanGiaiDto> generalLuanGiai;
    private List<LuanGiaiDto> menhLuanGiai;
    private List<LuanGiaiDto> daiVanLuanGiai;
}
