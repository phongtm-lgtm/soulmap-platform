package com.soulmap.server;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;

@Slf4j
@SpringBootApplication
public class SoulmapServerApplication {

	private final Environment environment;

	public SoulmapServerApplication(Environment environment) {
		this.environment = environment;
	}

	public static void main(String[] args) {
		SpringApplication.run(SoulmapServerApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void logSwaggerUrls() {
		String port = environment.getProperty("local.server.port", environment.getProperty("server.port", "8080"));
		log.info("Swagger UI: http://localhost:{}/swagger-ui/index.html", port);
		log.info("OpenAPI Docs: http://localhost:{}/v3/api-docs", port);
	}

}
