package com.soulmap.server.dto.response.tuvi;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class Sao {
    private int id;
    private String name;
    private String type;

    @JsonProperty("color_code")
    @JsonAlias("colorCode")
    private String colorCode;

    @JsonProperty("am_duong")
    @JsonAlias("amDuong")
    private String amDuong;

    private String status;

    @JsonProperty("is_special")
    @JsonAlias("special")
    private boolean special;
}
