package com.soulmap.server.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "soulmap.auth.google")
public class GoogleAuthProperties {
    private String clientId;
}
