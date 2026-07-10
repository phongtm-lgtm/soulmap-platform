package com.soulmap.server.dto.response.tuvi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class CungModel {
    private int id;
    private String name;

    @JsonProperty("full_name")
    private String fullName;

    private CungDetail cung;

    private Chi chi;

    @JsonProperty("dai_van")
    private int daiVan;

    @JsonProperty("khoi_tieu_han")
    private String khoiTieuHan;

    @JsonProperty("khoi_nguyet_han")
    private String khoiNguyetHan;

    @JsonProperty("chinh_tinh")
    private List<SaoInfo> chinhTinh;

    private List<SaoInfo> sao;

    @JsonProperty("dai_van_text")
    private String daiVanText;

    @JsonProperty("luu_nien")
    private String luuNien;

    @JsonProperty("trang_sinh")
    private TrangSinh trangSinh;

    @JsonProperty("tu_hoa_phais")
    private List<TuHoa> tuHoaPhais;
}
