package com.soulmap.server.dto.response.tuvi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class LuanGiai {
    private int id;
    private String title;
    private String content;

    @com.fasterxml.jackson.annotation.JsonProperty("luan_giai_source")
    private LuanGiaiSource luanGiaiSource;
}
