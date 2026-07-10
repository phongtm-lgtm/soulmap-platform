package com.soulmap.server.dto.request.ai;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class SoulProfileRequest {
    private String summary;
    private List<String> coreThemes = new ArrayList<>();
    private List<String> strengths = new ArrayList<>();
    private List<String> challenges = new ArrayList<>();
    private List<String> values = new ArrayList<>();
}
