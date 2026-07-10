package com.soulmap.server.controller;

import com.soulmap.server.dto.request.TuViRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.LaSoResponse;
import com.soulmap.server.service.TuViService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping()
@CrossOrigin(origins = "*")
public class TuViController {

    private final TuViService tuViService;

    public TuViController(TuViService tuViService) {
        this.tuViService = tuViService;
    }

    @PostMapping("/la-so")
    public ApiResponse<LaSoResponse> createLaSo(@RequestBody TuViRequest request) {
        return buildLaSoResponse(request);
    }

    @GetMapping("/la-so")
    public ApiResponse<LaSoResponse> getLaSo(@ModelAttribute TuViRequest request) {
        return buildLaSoResponse(request);
    }

    private ApiResponse<LaSoResponse> buildLaSoResponse(TuViRequest request) {
        LaSoResponse laSo = tuViService.getLaSo(request);
        return ApiResponse.of(HttpStatus.OK.value(), "Get 'la so' successfully", laSo);
    }
}
