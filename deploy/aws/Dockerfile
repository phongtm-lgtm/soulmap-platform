# syntax=docker/dockerfile:1.7

FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /workspace

COPY soulmap-server/pom.xml soulmap-server/pom.xml
RUN --mount=type=cache,target=/root/.m2 \
    mvn -f soulmap-server/pom.xml dependency:go-offline

COPY soulmap-server soulmap-server
RUN --mount=type=cache,target=/root/.m2 \
    mvn -f soulmap-server/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S soulmap && adduser -S -G soulmap soulmap
WORKDIR /app

COPY --from=build /workspace/soulmap-server/target/*.jar /app/app.jar

USER soulmap
EXPOSE 8090

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=55", "-XX:InitialRAMPercentage=20", "-XX:+ExitOnOutOfMemoryError", "-jar", "/app/app.jar"]
