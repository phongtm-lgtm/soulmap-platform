package com.soulmap.server.dto.request.ai;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoveReadingRequest {
    private String userId;
    private String mode = "LOVE_READING";
    private String language = "vi";

    @NotBlank
    private String name;

    @Min(1)
    @Max(31)
    private int day;

    @Min(1)
    @Max(12)
    private int month;

    @Min(1900)
    @Max(2100)
    private int year;

    private String calendar = "lunar";
    private String gender = "male";

    @Min(0)
    @Max(23)
    private int hour;

    @Min(0)
    @Max(59)
    private int min;

    private int timezone = 1;
    private int viewYear = 2026;
}
