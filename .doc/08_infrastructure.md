# Blueprint de Contexto para Sistema de Análisis y Gestión Regional Partidista (SIGO-PJ Zulia)

## 8. CATEGORÍA: Infraestructura, DevOps y Resiliencia (`08_infrastructure.md`)

### 8.1. Variables de Entorno (`.env.example`)

```bash
# Backend Config
PROJECT_NAME="SIGO PJ ZULIA"
ENVIRONMENT=production
DEBUG=False
API_V1_STR="/api/v1"
SECRET_KEY="super-secret-jwt-key-replace-in-prod"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Google OAuth
GOOGLE_CLIENT_ID="123456789-xxxxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxxxxx"

# Base de Datos
POSTGRES_SERVER=db
POSTGRES_PORT=5432
POSTGRES_USER=sigo_admin
POSTGRES_PASSWORD=sigo_secure_pass_2026
POSTGRES_DB=sigo_zulia_db
DATABASE_URL=postgresql+asyncpg://sigo_admin:sigo_secure_pass_2026@db:5432/sigo_zulia_db

# CORS
CORS_ORIGINS=["https://juventud.pjzulia.org.ve","http://localhost:5173"]
```

---

### 8.2. Containerización (`docker-compose.yml`)

```yaml
version: '3.9'

services:
  db:
    image: postgres:16-alpine
    container_name: sigo_postgres
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: sigo_api
    restart: always
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SECRET_KEY=${SECRET_KEY}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
    depends_on:
      - db
    ports:
      - "8000:8000"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: sigo_spa
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

### 8.3. Mecanismo de Logs y Monitoreo

- Configuración de alertas para errores `500 Internal Server Error` o caídas en la conexión hacia la base de datos PostgreSQL.
- Uso de la librería `structlog` o módulo estándar formateado en **JSON estructurado** para facilitar la ingesta por analizadores de logs:

```json
{"timestamp": "2026-10-12T20:51:10Z", "level": "INFO", "event": "lead_created", "lead_id": "7f8b5490", "municipio": "San Francisco"}
```

---

### 8.4. Resiliencia de Red y Conectividad Local

- **En la SPA (React):** Cacheo de peticiones geográficas estáticas (listado de municipios y parroquias) mediante `TanStack Query (React Query)` para evitar llamadas redundantes y optimizar el consumo de ancho de banda.
- **En la Landing Page:** En caso de corte eléctrico o fallo temporal de conexión a internet al enviar un registro de voluntariado, el script de la landing guarda el payload en `localStorage` y programa un intento de reenvío automático (`Retry Pattern`) en cuanto se detecte el evento `window.addEventListener('online', ...)`.
