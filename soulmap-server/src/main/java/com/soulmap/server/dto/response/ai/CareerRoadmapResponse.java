package com.soulmap.server.dto.response.ai;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CareerRoadmapResponse {
    private List<String> next3Months = new ArrayList<>();
    private List<String> next6Months = new ArrayList<>();
    private List<String> next12Months = new ArrayList<>();
    private List<String> next3Years = new ArrayList<>();
}
