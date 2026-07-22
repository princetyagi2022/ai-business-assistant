# ---------- Build Stage ----------
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src src

RUN mvn clean package -DskipTests

# ---------- Run Stage ----------
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Create directories for CSV data and file uploads
RUN mkdir -p /app/ml-models/data /app/uploads /app/documents

EXPOSE 8081

# Use Spring profile and allow env-based configuration
ENV SPRING_PROFILES_ACTIVE=prod
ENV SERVER_PORT=8081

ENTRYPOINT ["java","-jar","app.jar"]