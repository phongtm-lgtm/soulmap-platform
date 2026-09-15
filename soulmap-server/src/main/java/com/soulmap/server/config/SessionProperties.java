package com.soulmap.server.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "soulmap.auth.session")
public class SessionProperties {
    private int durationDays = 14;
    private boolean secure = false;
    private String sameSite = "Lax";
}
