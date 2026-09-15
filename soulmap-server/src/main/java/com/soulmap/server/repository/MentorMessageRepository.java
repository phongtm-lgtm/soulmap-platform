package com.soulmap.server.repository;

import com.soulmap.server.entity.MentorMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MentorMessageRepository extends JpaRepository<MentorMessage, Long> {
    List<MentorMessage> findByConversationIdOrderByCreatedAtAsc(Long conversationId);

    List<MentorMessage> findTop20ByConversationIdOrderByCreatedAtDesc(Long conversationId);

    Optional<MentorMessage> findFirstByConversationIdAndRoleOrderByCreatedAtDesc(Long conversationId, String role);
}
