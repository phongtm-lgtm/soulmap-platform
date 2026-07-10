package com.soulmap.server.dto.response.tuvi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class CungDetail {
    private int id;
    private String name;

    @JsonProperty("ngu_hanh")
    private NguHanh nguHanh;

    private String slug;
}
