package com.soulmap.server.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TuViRequest {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String mbtiType;

    //TODO: add validate

    @Schema(defaultValue = "Phong")
    private String name = "Phong";

    @Schema(defaultValue = "15")
    private int day;

    @Schema(defaultValue = "7")
    private int month;

    @Schema(defaultValue = "2002")
    private int year;

    @Schema(defaultValue = "lunar")
    private String calendar;

    @Schema(defaultValue = "male")
    private String gender = "male";

    @Schema(defaultValue = "0")
    private int hour;

    @Schema(defaultValue = "0")
    private int min;

    @Schema(defaultValue = "1")
    private int timezone;

    @Schema(defaultValue = "2026")
    private int viewYear;
}
