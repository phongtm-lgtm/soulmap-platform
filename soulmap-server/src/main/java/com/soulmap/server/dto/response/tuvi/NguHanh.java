package com.soulmap.server.dto.response.tuvi;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class NguHanh {
    private int id;
    private String name;

    @JsonProperty("color_code")
    @JsonAlias("colorCode")
    private String colorCode;
}
