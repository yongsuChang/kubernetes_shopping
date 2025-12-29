FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# JAR 빌드는 CI 호스트에서 수행하므로 복사만 합니다.
COPY build/libs/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]