package com.soulmap.server.controller;

import com.soulmap.server.dto.request.TuViRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.LaSoResponse;
import com.soulmap.server.entity.User;
import com.soulmap.server.service.AuthSessionService;
import com.soulmap.server.service.CurrentUserService;
import com.soulmap.server.service.TuViService;
import com.soulmap.server.service.UserTuViChartService;
import com.soulmap.server.service.SoulMapProfileKeyService;
import com.soulmap.server.common.enums.ErrorCode;
import com.soulmap.server.common.error.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping()
@CrossOrigin(origins = "${SOULMAP_FRONTEND_ORIGIN:http://localhost:3000}", allowCredentials = "true")
public class TuViController {

    private final TuViService tuViService;
    private final CurrentUserService currentUserService;
    private final UserTuViChartService userTuViChartService;
    private final SoulMapProfileKeyService profileKeyService;

    public TuViController(
            TuViService tuViService,
            CurrentUserService currentUserService,
            UserTuViChartService userTuViChartService,
            SoulMapProfileKeyService profileKeyService
    ) {
        this.tuViService = tuViService;
        this.currentUserService = currentUserService;
        this.userTuViChartService = userTuViChartService;
        this.profileKeyService = profileKeyService;
    }

    @PostMapping("/la-so")
    public ApiResponse<LaSoResponse> createLaSo(
            @RequestBody TuViRequest request,
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        User currentUser = currentUserService.requireCurrentUser(sessionToken);
        return buildLaSoResponse(currentUser, request);
    }

    @GetMapping("/la-so")
    public ApiResponse<LaSoResponse> getLaSo(
            @ModelAttribute TuViRequest request,
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        User currentUser = currentUserService.requireCurrentUser(sessionToken);
        return buildLaSoResponse(currentUser, request);
    }

    @GetMapping("/la-so/me")
    public ApiResponse<LaSoResponse> getSavedLaSo(
            @CookieValue(name = AuthSessionService.COOKIE_NAME, required = false) String sessionToken
    ) {
        User currentUser = currentUserService.requireCurrentUser(sessionToken);
        LaSoResponse laSo = userTuViChartService.get(currentUser.getId());
        return ApiResponse.of(HttpStatus.OK.value(), "Get saved 'la so' successfully", laSo);
    }

    private ApiResponse<LaSoResponse> buildLaSoResponse(User currentUser, TuViRequest request) {
        request.setMbtiType(currentUser.getMbtiType());
        String profileKey = profileKeyService.create(request.getMbtiType(), request.getDay(), request.getMonth(), request.getYear(), request.getCalendar(), request.getGender(), request.getHour(), request.getMin(), request.getTimezone());
        LaSoResponse cached = userTuViChartService.getIfMatching(currentUser.getId(), profileKey);
        if (cached != null) return ApiResponse.of(HttpStatus.OK.value(), "Get cached 'la so' successfully", cached);
        if (userTuViChartService.isRegenerationRequired(currentUser.getId(), profileKey)) {
            throw new BusinessException(ErrorCode.SOULMAP_ERROR_0001);
        }
        LaSoResponse laSo = tuViService.getLaSo(request);
        userTuViChartService.save(currentUser.getId(), request, laSo, profileKey);
        return ApiResponse.of(HttpStatus.OK.value(), "Get 'la so' successfully", laSo);
    }
}
