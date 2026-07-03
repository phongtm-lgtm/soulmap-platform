package com.soulmap.server.controller;

import com.soulmap.server.dto.request.TuViRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.CungDto;
import com.soulmap.server.service.TuViService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping()
@CrossOrigin(origins = "*")
public class TuViController {

    private final TuViService tuViService;

    public TuViController(TuViService tuViService) {
        this.tuViService = tuViService;
    }

    @GetMapping("/la-so")
    public ResponseEntity<ApiResponse<Map<String, CungDto>>> getLaSo(@ModelAttribute TuViRequest request) {
        Map<String, CungDto> laSo = tuViService.getLaSo(request);
        //TODO: change CungDto by la so
        return ResponseEntity.ok(
                ApiResponse.of(HttpStatus.OK.value(), "Get 'la so' successfully", laSo)
        );
    }
}
