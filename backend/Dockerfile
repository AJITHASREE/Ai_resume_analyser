FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw clean install -DskipTests
EXPOSE 8080
CMD ["java", "-Xmx300m", "-Xms100m", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]