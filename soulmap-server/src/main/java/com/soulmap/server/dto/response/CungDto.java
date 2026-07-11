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
public class CungDto {
    private String key;
    private String gridClass;
    private String name;
    private String diaChi;
    private String hanhCung;
    private String daiVan;
    private String daiVanText;
    private String tieuVan;
    private String trangSinh;
    private List<String> chinhTinh;
    private List<String> catTinh;
    private List<String> hungTinh;
    private List<String> tuHoa;

}
