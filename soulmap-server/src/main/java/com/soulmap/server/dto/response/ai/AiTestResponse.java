package com.soulmap.server.dto.response.ai;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiTestResponse {
    private String provider;
    private String model;
    private String rawContent;
}
