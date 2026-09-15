package com.soulmap.server.dto.request.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendMentorMessageRequest {
    @NotBlank
    @Size(max = 8000)
    private String content;
}
