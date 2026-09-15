package com.soulmap.server.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.soulmap.server.common.error.ResourceNotFoundException;
import com.soulmap.server.dto.request.TuViRequest;
import com.soulmap.server.dto.response.LaSoResponse;
import com.soulmap.server.entity.UserTuViChart;
import com.soulmap.server.repository.UserTuViChartRepository;
import org.springframework.stereotype.Service;

@Service
public class UserTuViChartService {
    private final UserTuViChartRepository chartRepository;
    private final ObjectMapper objectMapper;

    public UserTuViChartService(UserTuViChartRepository chartRepository, ObjectMapper objectMapper) {
        this.chartRepository = chartRepository;
        this.objectMapper = objectMapper;
    }

    public void save(Long userId, TuViRequest request, LaSoResponse chart, String profileKey) {
        try {
            UserTuViChart savedChart = chartRepository.findByUserId(userId).orElseGet(UserTuViChart::new);
            savedChart.setUserId(userId);
            savedChart.setProfileKey(profileKey);
            savedChart.setBirthDataJson(objectMapper.writeValueAsString(request));
            savedChart.setChartJson(objectMapper.writeValueAsString(chart));
            chartRepository.save(savedChart);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Unable to save Tu Vi chart", exception);
        }
    }

    public LaSoResponse getIfMatching(Long userId, String profileKey) {
        try {
            UserTuViChart chart = chartRepository.findByUserId(userId).orElse(null);
            if (chart == null || chart.getProfileKey() == null || !profileKey.equals(chart.getProfileKey())) return null;
            return objectMapper.readValue(chart.getChartJson(), LaSoResponse.class);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Unable to read Tu Vi chart", exception);
        }
    }

    public boolean isRegenerationRequired(Long userId, String profileKey) {
        return chartRepository.findByUserId(userId)
                .map(chart -> chart.getProfileKey() != null && !profileKey.equals(chart.getProfileKey()))
                .orElse(false);
    }

    public LaSoResponse get(Long userId) {
        try {
            UserTuViChart chart = chartRepository.findByUserId(userId)
                    .orElseThrow(ResourceNotFoundException::new);
            return objectMapper.readValue(chart.getChartJson(), LaSoResponse.class);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Unable to read Tu Vi chart", exception);
        }
    }
}
