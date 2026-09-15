package com.soulmap.server.client.ai;

public interface AiProviderClient {
    String generateStructuredJson(AiChatRequest request);

    /** Plain-text chat completion (no JSON response_format). */
    String generateText(AiChatRequest request);
}
