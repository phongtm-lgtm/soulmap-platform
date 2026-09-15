package com.soulmap.server.repository;

import com.soulmap.server.entity.MentorConversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MentorConversationRepository extends JpaRepository<MentorConversation, Long> {
    List<MentorConversation> findByUserIdOrderByUpdatedAtDesc(Long userId);

    Optional<MentorConversation> findByIdAndUserId(Long id, Long userId);
}
