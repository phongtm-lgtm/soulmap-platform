package com.soulmap.server.service;

import com.soulmap.server.dto.request.ai.IdentityJourneyRequest;
import com.soulmap.server.dto.response.ai.IdentityJourneyResponse;

public interface IdentityJourneyService {
    IdentityJourneyResponse generateIdentityJourney(IdentityJourneyRequest request);
}
