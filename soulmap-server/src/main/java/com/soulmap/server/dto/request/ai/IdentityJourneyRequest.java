package com.soulmap.server.dto.request.ai;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IdentityJourneyRequest extends LoveReadingRequest {
    private String goal;
    private String currentConcern;
}
