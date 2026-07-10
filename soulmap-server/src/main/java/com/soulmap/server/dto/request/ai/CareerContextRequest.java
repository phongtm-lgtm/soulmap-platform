package com.soulmap.server.dto.request.ai;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CareerContextRequest {
    @NotBlank
    private String careerStage;

    private String currentRole;
    private String currentIndustry;

    @Min(1)
    @Max(10)
    private Integer satisfactionScore;

    private List<String> mainConcerns = new ArrayList<>();
    private List<String> existingSkills = new ArrayList<>();
    private List<String> desiredSkills = new ArrayList<>();
    private List<String> preferredEnvironments = new ArrayList<>();
    private List<String> goals = new ArrayList<>();
    private List<String> constraints = new ArrayList<>();
}
