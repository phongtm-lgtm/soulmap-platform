package com.soulmap.server.dto.response.tuvi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class TuHoa {
    private Sao sao;
    private BasicName can;

    @JsonProperty("sao_tu_hoa")
    private BasicName saoTuHoa;

    private String cung;

    @JsonProperty("ngu_hanh")
    private NguHanh nguHanh;
}
