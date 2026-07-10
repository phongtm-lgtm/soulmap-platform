package com.soulmap.server.dto.response.tuvi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class TuViData {
    private Long id;
    private String slug;
    private String hour;

    @JsonProperty("hour_id")
    private int hourId;

    private String name;
    private String year;
    private String month;
    private String day;

    @JsonProperty("solar_year")
    private int solarYear;

    @JsonProperty("solar_month")
    private int solarMonth;

    @JsonProperty("solar_day")
    private int solarDay;

    @JsonProperty("lunar_year")
    private int lunarYear;

    @JsonProperty("lunar_month")
    private int lunarMonth;

    @JsonProperty("lunar_day")
    private int lunarDay;

    private String gender;

    @JsonProperty("time_full")
    private String timeFull;

    @JsonProperty("solar_full")
    private String solarFull;

    @JsonProperty("current_time_full")
    private String currentTimeFull;

    @JsonProperty("can_chi_full")
    private String canChiFull;

    @JsonProperty("am_duong_cua_ban_menh")
    private String amDuong;

    @JsonProperty("loai_hanh_cua_ban_menh")
    private String loaiHanh;

    @JsonProperty("vi_tri_cung_menh")
    private String viTriCungMenh;

    @JsonProperty("vi_tri_cung_than")
    private String viTriCungThan;

    @JsonProperty("cuc_full")
    private String cucFull;

    @JsonProperty("cuc_cua_tuoi")
    private CucCuaTuoi cucCuaTuoi;

    @JsonProperty("than_cu")
    private String thanCu;

    @JsonProperty("menh_chu")
    private String menhChuText;

    @JsonProperty("than_chu")
    private String thanChuText;

    @JsonProperty("diem_huyen_khi")
    private int diemHuyenKhi;

    @JsonProperty("diem_cung_khi")
    private int diemCungKhi;

    @JsonProperty("can_xuong")
    private String canXuong;

    @JsonProperty("lai_nhan_cung")
    private String laiNhanCung;

    @JsonProperty("cung_model")
    private List<CungModel> cungModel;

    @JsonProperty("chu_menh")
    private BasicName chuMenh;

    @JsonProperty("chu_than")
    private BasicName chuThan;

    @JsonProperty("total_view")
    private int totalView;

    @JsonProperty("general_lg")
    private List<LuanGiai> generalLg;

    @JsonProperty("menh_lg")
    private List<LuanGiai> menhLg;

    @JsonProperty("dai_van_lg")
    private List<LuanGiai> daiVanLg;

    @JsonProperty("la_so_brief")
    private String laSoBrief;

    @JsonProperty("is_saved")
    private boolean saved;

    @JsonProperty("cung_xau")
    private List<String> cungXau;

    @JsonProperty("cung_xau_detail")
    private List<String> cungXauDetail;

    @JsonProperty("dai_van_xau")
    private String daiVanXau;

    @JsonProperty("tieu_van_xau")
    private String tieuVanXau;

    @JsonProperty("dai_han_tuoi")
    private int daiHanTuoi;
}
