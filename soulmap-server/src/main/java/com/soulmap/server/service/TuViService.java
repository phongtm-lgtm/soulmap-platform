package com.soulmap.server.service;


import com.soulmap.server.dto.request.TuViRequest;
import com.soulmap.server.dto.response.CungDto;

import java.util.Map;

public interface TuViService {

    Map<String, CungDto> getLaSo(TuViRequest request);
}
