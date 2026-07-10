package com.soulmap.server.client.ai;

import java.util.List;

public record AiChatRequest(
        String model,
        List<AiMessage> messages,
        double temperature,
        String structuredOutputMode
) {
}
