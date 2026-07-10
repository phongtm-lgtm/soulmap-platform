package com.soulmap.server.repository;

import com.soulmap.server.entity.AiReading;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AiReadingRepository extends JpaRepository<AiReading, Long> {
    Optional<AiReading> findTopByUserIdAndTypeAndChapterIdOrderByUpdatedAtDesc(String userId, String type, String chapterId);
}
