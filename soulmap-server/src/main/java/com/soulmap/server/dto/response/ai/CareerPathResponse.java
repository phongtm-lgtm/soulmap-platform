package com.soulmap.server.dto.response.ai;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CareerPathResponse {
    private String name;
    private int fitScore;
    private String whyItFits;
    private List<String> skillsToBuild = new ArrayList<>();
    private String entryRoute;
    private List<String> risks = new ArrayList<>();
    private List<String> trialActions = new ArrayList<>();
}
