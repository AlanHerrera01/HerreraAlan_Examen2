
# HerreraAlanLeccion1 - API de Tickets de Soporte

API REST para la gestión de tickets de soporte, desarrollada con Spring Boot 3, MySQL y Docker.

## Requisitos del entorno
- Java 17+
- Maven 3.8+
- Docker (recomendado Docker Desktop)
- MySQL 8+ (puedes usar Docker para levantar la base de datos)

## Construcción de la imagen Docker

1. Clona el repositorio:
   ```sh
   git clone https://github.com/avherrera3/HerreraAlanLeccion1.git
   cd HerreraAlanLeccion1
   ```
2. Construye la imagen Docker:
   ```sh
   docker build -t avherrera3/herreraalanleccion1 .
   ```

## Ejecución del contenedor


### 1. Levanta una base de datos MySQL (opcional con Docker):
Si quieres usar MySQL sin contraseña para root (como en el .env por defecto), usa:
```sh
docker run --name mysql-soporte -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -e MYSQL_DATABASE=soporte_db -p 3306:3306 -d mysql:8
```
Si prefieres usar contraseña, reemplaza por `-e MYSQL_ROOT_PASSWORD=tu_clave` y actualiza el `.env`.

### 2. Ejecuta la API (ajusta las variables de entorno según tu entorno):
```sh
docker run -p 9090:9090 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/soporte_db?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=tu_clave \
  avherrera3/herreraalanleccion1:latest
```

O usando un archivo `.env`:
```sh
docker run --env-file .env -p 9090:9090 avherrera3/herreraalanleccion1:latest
```

La API estará disponible en:
```
http://localhost:9090/api/v1/support-tickets
```

## Uso desde Docker Hub

Puedes ejecutar la API directamente desde Docker Hub sin necesidad de clonar el repositorio ni construir la imagen:

```sh
docker run -p 9090:9090 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/soporte_db?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD= \
  avherrera3/herreraalanleccion1:latest
```

## URL base de la API

```
http://localhost:9090/api/v1/support-tickets
```

## Ejemplos de consumo (según colección Postman)

- **Crear ticket:**
  ```http
  POST /api/v1/support-tickets
  Content-Type: application/json
  {
    "requesterName": "Juan Perez",
    "status": "OPEN",
    "priority": "HIGH",
    "category": "SOFTWARE",
    "estimatedCost": 120.50,
    "currency": "USD",
    "dueDate": "2025-12-20"
  }
  ```

- **Buscar por texto (q):**
  ```http
  GET /api/v1/support-tickets?q=chicaiza
  ```

- **Filtrar por estado (status):**
  ```http
  GET /api/v1/support-tickets?status=OPEN
  ```

- **Filtrar por moneda (currency):**
  ```http
  GET /api/v1/support-tickets?currency=USD
  ```

- **Monto mínimo (minCost):**
  ```http
  GET /api/v1/support-tickets?minCost=50
  ```

- **Monto máximo (maxCost):**
  ```http
  GET /api/v1/support-tickets?maxCost=300
  ```

- **Filtro combinado de fechas (from y to):**
  ```http
  GET /api/v1/support-tickets?from=2025-01-01T00:00:00&to=2025-06-30T23:59:59
  ```

- **Paginación y ordenamiento:**
  ```http
  GET /api/v1/support-tickets?page=0&size=10&sort=createdAt,desc
  ```

- **Filtros combinados (ejemplo completo):**
  ```http
  GET /api/v1/support-tickets?q=juan&status=OPEN&currency=USD&minCost=100&maxCost=200&from=2025-01-01T00:00:00&to=2025-12-31T23:59:59&page=0&size=10&sort=createdAt,desc
  ```

---

> Por defecto, la contraseña en el archivo `.env` está vacía. Si tu base de datos tiene contraseña, edita el valor de `SPRING_DATASOURCE_PASSWORD` en `.env` o pásala como variable de entorno.
> Puedes consultar más ejemplos en la colección Postman incluida en el repositorio.
