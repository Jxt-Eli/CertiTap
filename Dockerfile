FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -U
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine AS runtime
WORKDIR /app
RUN addgroup -S springgroup && adduser -S springuser -G springgroup
COPY --from=build /app/target/*.jar ./app.jar
RUN chown -R springuser:springgroup /app
USER springuser
CMD ["java", "-jar", "app.jar"]

