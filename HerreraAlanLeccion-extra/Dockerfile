# Use an official OpenJDK 17 image as base
FROM eclipse-temurin:17-jdk-alpine

# Set the working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY mvnw* pom.xml ./
COPY .mvn .mvn

# Copy the source code
COPY src src

# Package the application
RUN ./mvnw clean package -DskipTests

# Use a smaller image for running the app
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=0 /app/target/*.jar app.jar

# Expose port 9090
EXPOSE 9090

# Run the application
# Puedes pasar variables de entorno al ejecutar el contenedor, por ejemplo:
# docker run -p 9090:9090 -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/soporte_db -e SPRING_DATASOURCE_USERNAME=root -e SPRING_DATASOURCE_PASSWORD=tu_clave herreraalanleccion1
ENTRYPOINT ["java", "-jar", "app.jar"]
