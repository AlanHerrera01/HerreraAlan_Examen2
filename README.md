# Examen Parcial II - Sistema de Tickets de Soporte

## Descripción
Este proyecto es un sistema completo de gestión de tickets de soporte, desarrollado con React (Vite) para el frontend, Spring Boot para el backend y MySQL como base de datos. Todo el sistema está dockerizado y orquestado con Docker Compose.

## Estructura del Proyecto
```
frontend/                # Aplicación React (Vite)
HerreraAlanLeccion-extra/ # Backend Spring Boot
  └── src/main/java/...   # Código fuente Java
  └── src/main/resources/ # Configuración Spring
  └── Dockerfile          # Dockerfile backend
  └── ...
docker-compose.yml        # Orquestación de servicios
```

## Requisitos
- Docker y Docker Compose instalados
- (Opcional) Node.js y Maven para desarrollo local

## Variables de Entorno
- El frontend usa `VITE_API_URL` para la URL del backend.
  - En Docker: `VITE_API_URL=http://backend:9090/api/v1/support-tickets`
  - Local:     `VITE_API_URL=http://localhost:9090/api/v1/support-tickets`
- El backend usa variables de entorno para la conexión a MySQL (ver docker-compose.yml).

## Instrucciones para correr con Docker
1. Clona el repositorio y entra a la carpeta raíz del proyecto.
2. Asegúrate de que el archivo `frontend/.env` tenga:
   ```
   VITE_API_URL=http://backend:9090/api/v1/support-tickets
   ```
3. Construye y levanta todos los servicios:
   ```
   docker-compose up --build
   ```
4. Accede al frontend en tu navegador:
   - [http://localhost:8080](http://localhost:8080)
5. El backend estará disponible en:
   - [http://localhost:9090/api/v1/support-tickets](http://localhost:9090/api/v1/support-tickets)

## Desarrollo local (sin Docker)
1. Levanta la base de datos MySQL localmente (puerto 3307 o 3306).
2. En `frontend/.env.local` pon:
   ```
   VITE_API_URL=http://localhost:9090/api/v1/support-tickets
   ```
3. Inicia el backend con Maven:
   ```
   cd HerreraAlanLeccion-extra
   mvn spring-boot:run
   ```
4. Inicia el frontend con Vite:
   ```
   cd frontend
   npm install
   npm run dev
   ```

## Tecnologías utilizadas

### Frontend
- **React** (con Vite): Framework de JavaScript para construir interfaces de usuario modernas y reactivas.
- **React Router DOM**: Para navegación SPA sin recargar la página.
- **Vite**: Herramienta de desarrollo y build ultrarrápida para proyectos React.
- **Nginx**: Servidor web para servir la aplicación en producción y manejar rutas SPA.

#### Explicación del Frontend
El frontend es una aplicación SPA desarrollada en React y empaquetada con Vite. Permite crear, listar, filtrar, editar y eliminar tickets de soporte. Utiliza componentes reutilizables, validaciones en formularios y una interfaz moderna. La comunicación con el backend se realiza mediante fetch a la URL definida en la variable de entorno `VITE_API_URL`. En producción, Nginx sirve la app y redirige todas las rutas a `index.html` para soportar navegación SPA.

### Backend
- **Spring Boot**: Framework Java para crear APIs REST robustas y seguras.
- **Spring Data JPA**: Acceso y persistencia de datos con MySQL.
- **MySQL**: Base de datos relacional para almacenar los tickets.
- **Docker**: Contenerización del backend para despliegue fácil y reproducible.

#### Explicación del Backend
El backend es una API REST construida con Spring Boot. Expone endpoints para CRUD de tickets, soporta filtros avanzados y paginación. Utiliza Spring Data JPA para interactuar con MySQL y está configurado para aceptar variables de entorno (usuario, contraseña, URL de la base de datos). Incluye manejo de CORS para permitir peticiones desde el frontend. El backend se ejecuta en un contenedor Docker y se conecta automáticamente al servicio de base de datos definido en Docker Compose.

## Funcionalidades
- Crear, ver, editar y eliminar tickets de soporte
- Filtros avanzados y paginación
- Validaciones y mensajes de error claros
- Navegación SPA (Single Page Application)

## Notas
- Si tienes problemas de CORS, asegúrate que el backend permita orígenes desde el frontend (ver anotación `@CrossOrigin` en el controlador).
- Si recargas rutas internas como `/tickets` y ves error 404, asegúrate de tener la configuración de nginx para SPA en el frontend.

## Autor
Alan Herrera

