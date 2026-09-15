package com.soulmap.server.dto.response.ai;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class MentorMessageResponse {
    private Long id;
    private String role;
    private String content;
    private Instant createdAt;
}
