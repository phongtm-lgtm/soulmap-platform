package com.soulmap.server.service;


import com.soulmap.server.dto.request.TuViRequest;
import com.soulmap.server.dto.response.LaSoResponse;

public interface TuViService {

    LaSoResponse getLaSo(TuViRequest request);
}
