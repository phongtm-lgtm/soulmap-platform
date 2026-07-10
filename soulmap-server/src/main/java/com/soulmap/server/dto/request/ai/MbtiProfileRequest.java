package com.soulmap.server.dto.request.ai;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class MbtiProfileRequest {
    private String type;
    private String summary;
    private List<String> strengths = new ArrayList<>();
    private List<String> workStyle = new ArrayList<>();
}
