package com.soulmap.server.client.ai;

import com.soulmap.server.common.enums.ErrorCode;
import com.soulmap.server.common.error.AiServiceException;
import com.soulmap.server.config.SoulmapAiProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class NineRouterAiClient implements AiProviderClient {
    private final SoulmapAiProperties properties;
    private final WebClient webClient;

    public NineRouterAiClient(WebClient.Builder webClientBuilder, SoulmapAiProperties properties) {
        this.properties = properties;
        if (!StringUtils.hasText(properties.getBaseUrl())) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0001);
        }

        WebClient.Builder builder = webClientBuilder
                .baseUrl(properties.getBaseUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        if (StringUtils.hasText(properties.getApiKey())) {
            builder.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getApiKey());
        }

        this.webClient = builder.build();
    }

    @Override
    public String generateStructuredJson(AiChatRequest request) {
        try {
            long startedAt = System.currentTimeMillis();
            log.info("Calling AI provider: provider={}, baseUrl={}, model={}, structuredOutputMode={}",
                    properties.getProvider(), properties.getBaseUrl(), request.model(), request.structuredOutputMode());

            var responseMono = webClient.post()
                    .uri("/chat/completions")
                    .bodyValue(buildRequestBody(request))
                    .retrieve()
                    .bodyToMono(ChatCompletionResponse.class);

            if (properties.getTimeoutSeconds() > 0) {
                responseMono = responseMono.timeout(Duration.ofSeconds(properties.getTimeoutSeconds()));
            }

            ChatCompletionResponse response = responseMono.block();

            long latencyMs = System.currentTimeMillis() - startedAt;
            log.info("AI provider response received: provider={}, model={}, latencyMs={}",
                    properties.getProvider(), request.model(), latencyMs);

            if (response == null || response.choices() == null || response.choices().isEmpty()
                    || response.choices().getFirst().message() == null
                    || response.choices().getFirst().message().content() == null) {
                throw new AiServiceException(ErrorCode.AI_ERROR_0002);
            }

            return response.choices().getFirst().message().content();
        } catch (AiServiceException exception) {
            throw exception;
        } catch (WebClientResponseException exception) {
            log.error("AI provider HTTP error: status={}, body={}", exception.getStatusCode().value(), exception.getResponseBodyAsString(), exception);
            throw new AiServiceException(ErrorCode.AI_ERROR_0001, exception);
        } catch (Exception exception) {
            if (exception.getCause() instanceof java.util.concurrent.TimeoutException timeoutException) {
                throw new AiServiceException(ErrorCode.AI_ERROR_0004, timeoutException);
            }
            log.error("AI provider unexpected error", exception);
            throw new AiServiceException(ErrorCode.AI_ERROR_0001, exception);
        }
    }

    private Map<String, Object> buildRequestBody(AiChatRequest request) {
        Map<String, Object> body = new java.util.LinkedHashMap<>();
        body.put("model", request.model());
        body.put("messages", request.messages());
        body.put("temperature", request.temperature());

        if ("json_object".equalsIgnoreCase(request.structuredOutputMode())) {
            body.put("response_format", Map.of("type", "json_object"));
        }

        return body;
    }

    private record ChatCompletionResponse(List<Choice> choices) {
    }

    private record Choice(AiMessage message) {
    }
}
