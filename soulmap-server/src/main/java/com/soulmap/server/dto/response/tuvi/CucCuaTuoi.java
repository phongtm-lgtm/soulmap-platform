package com.soulmap.server.dto.response.tuvi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class CucCuaTuoi {
    private int id;
    private String name;
    private int number;
}
