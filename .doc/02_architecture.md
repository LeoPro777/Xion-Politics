# Blueprint de Contexto para Sistema de Análisis y Gestión Regional Partidista (SIGO-PJ Zulia)

## 2. CATEGORÍA: Arquitectura y Estructura (`02_architecture.md`)

### 2.1. Patrón Arquitectónico

- **Estilo:** Arquitectura en Capas Limpias (Clean Architecture / N-Tier) desacoplada:
    - **Capa Pública:** Landing Page estática optimizada (HTML5 + Tailwind CSS + JS vanilla modular).
    - **Capa Frontend SPA:** React 18+ con TypeScript, Tailwind CSS, Vite y Zustand (Gestor de Estado).
    - **Capa Backend API:** FastAPI (Python 3.12+) organizado bajo el patrón Router-Service-Repository con esquemas Pydantic v2.
    - **Capa de Persistencia:** PostgreSQL 16 relacional gestionado a través de SQLAlchemy 2.0 (Async/Await) y migraciones con Alembic.

---

### 2.2. Árbol de Directorios Objetivo

```
sigo-pj-zulia/
├── landing/                           # Portal Público de Captación
│   ├── assets/
│   │   ├── css/
│   │   └── img/
│   ├── index.html
│   └── js/
│       └── landing-leads.js
├── backend/                           # API REST FastAPI
│   ├── alembic/                       # Migraciones de Base de Datos
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py                # Inyección de dependencias (DB, current_user, roles)
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── auth.py
│   │   │       │   ├── dashboard.py
│   │   │       │   ├── electoral.py
│   │   │       │   ├── leads.py
│   │   │       │   ├── militantes.py
│   │   │       │   └── estructura.py
│   │   │       └── router.py
│   │   ├── core/
│   │   │   ├── config.py              # Settings vía Pydantic BaseSettings
│   │   │   ├── database.py            # Async engine y SessionLocal
│   │   │   └── security.py            # Hashing, JWT encode/decode, OAuth validation
│   │   ├── models/                    # Modelos Declarativos SQLAlchemy
│   │   │   ├── base.py
│   │   │   ├── estructura.py
│   │   │   ├── lead.py
│   │   │   ├── militante.py
│   │   │   └── user.py
│   │   ├── repositories/              # Patrón Repositorio (SQLAlchemy queries)
│   │   │   ├── lead_repo.py
│   │   │   ├── militante_repo.py
│   │   │   └── user_repo.py
│   │   ├── schemas/                   # Modelos de Validación Pydantic v2
│   │   │   ├── auth.py
│   │   │   ├── dashboard.py
│   │   │   ├── lead.py
│   │   │   ├── militante.py
│   │   │   └── user.py
│   │   ├── services/                  # Lógica de Negocio Pura
│   │   │   ├── auth_service.py
│   │   │   ├── lead_service.py
│   │   │   └── militante_service.py
│   │   └── main.py                    # Punto de entrada de la aplicación FastAPI
│   ├── tests/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── pyproject.toml
├── frontend/                          # Panel Administrativo y Analítico SPA
│   ├── public/
│   ├── src/
│   │   ├── api/                       # Clientes Axios / Fetch tipados
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/                # Botones, Modales, Tablas, Badges
│   │   │   ├── dashboard/             # Gráficos (Recharts), KPIs, Mapas
│   │   │   ├── layout/                # Sidebar, Navbar, Breadcrumbs
│   │   │   └── guards/                # ProtectedRoute, RoleGuard
│   │   ├── hooks/                     # Custom Hooks (useAuth, useFetch)
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── EstructuraPage.tsx
│   │   │   ├── LeadsPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── MilitantesPage.tsx
│   │   ├── routes/
│   │   ├── stores/                    # Zustand (authStore, filterStore)
│   │   ├── types/                     # Interfaces TypeScript
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── docker-compose.yml
```

---

### 2.3. Responsabilidad de Componentes

- **Endpoints (`/api/v1/endpoints`):** Únicamente deserializan solicitudes HTTP, inyectan dependencias, llaman al servicio correspondiente y devuelven el código de estado adecuado. Prohibido ejecutar sentencias SQL aquí.
- **Servicios (`/services`):** Contienen las reglas de negocio (validar cuotas de coordinadores, cálculo de estados de captación, hashing y orquestación de llamadas a repositorios).
- **Repositorios (`/repositories`):** Aislan el acceso a datos. Utilizan SQLAlchemy asíncrono para ejecutar operaciones CRUD y consultas complejas.
- **Esquemas (`/schemas`):** Clases Pydantic que garantizan validación de tipos, coerción, saneamiento de strings y serialización de salida.
- **Zustand Stores (`/stores`):** Manejan el estado de la sesión activa (tokens en memoria, datos del usuario) y filtros globales de visualización territorial.

---

### 2.4. Protocolos y Canales de Comunicación

- **Landing Page $\rightarrow$ Backend:** Peticiones HTTP POST públicas sobre TLS (`/api/v1/leads/public`) con cabeceras de rate limiting y validación CORS restringida.
- **SPA $\rightarrow$ Backend:** REST API sobre HTTPS con cabecera `Authorization: Bearer <JWT_ACCESS_TOKEN>`.
- **Google OAuth:** Flujo Authorization Code Flow con PKCE o verificación de Token ID vía endpoint `/api/v1/auth/google`.
