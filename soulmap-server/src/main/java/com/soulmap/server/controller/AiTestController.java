package com.soulmap.server.controller;

import com.soulmap.server.client.ai.AiChatRequest;
import com.soulmap.server.client.ai.AiMessage;
import com.soulmap.server.client.ai.AiProviderClient;
import com.soulmap.server.config.SoulmapAiProperties;
import com.soulmap.server.dto.request.ai.AiTestRequest;
import com.soulmap.server.dto.response.ApiResponse;
import com.soulmap.server.dto.response.ai.AiTestResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "*")
public class AiTestController {
    private final AiProviderClient aiProviderClient;
    private final SoulmapAiProperties properties;

    public AiTestController(AiProviderClient aiProviderClient, SoulmapAiProperties properties) {
        this.aiProviderClient = aiProviderClient;
        this.properties = properties;
    }

    @PostMapping("/test")
    public ApiResponse<AiTestResponse> testAiService(@RequestBody(required = false) AiTestRequest request) {
        String message = request != null && request.getMessage() != null && !request.getMessage().isBlank()
                ? request.getMessage()
                : "Xin chao Linh Nhi";

        String rawContent = aiProviderClient.generateStructuredJson(new AiChatRequest(
                properties.getModel(),
                List.of(
                        new AiMessage("system", "Return only valid JSON with this shape: {\"reply\":\"string\"}."),
                        new AiMessage("user", message)
                ),
                properties.getTemperature(),
                properties.getStructuredOutputMode()
        ));

        AiTestResponse response = new AiTestResponse(properties.getProvider(), properties.getModel(), rawContent);
        return ApiResponse.of(HttpStatus.OK.value(), "Test AI service successfully", response);
    }
}
