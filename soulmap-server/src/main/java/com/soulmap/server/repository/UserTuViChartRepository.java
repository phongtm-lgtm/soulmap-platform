package com.soulmap.server.repository;

import com.soulmap.server.entity.UserTuViChart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserTuViChartRepository extends JpaRepository<UserTuViChart, Long> {
    Optional<UserTuViChart> findByUserId(Long userId);
}
