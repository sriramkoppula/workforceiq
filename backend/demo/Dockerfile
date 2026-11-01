FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw clean package -DskipTests
EXPOSE 8080
CMD ["sh", "-c", "java -XX:+TieredCompilation -XX:TieredStopAtLevel=1 -Xms128m -Xmx384m -XX:+UseSerialGC -jar target/*.jar"]
