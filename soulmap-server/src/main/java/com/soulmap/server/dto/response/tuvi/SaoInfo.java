package com.soulmap.server.dto.response.tuvi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class SaoInfo {
    private Sao sao;

    @JsonProperty("vi_tri")
    private Chi viTri;

    @JsonProperty("do_sang")
    private DoSang doSang;
}
