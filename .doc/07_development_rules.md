# Blueprint de Contexto para Sistema de Análisis y Gestión Regional Partidista (SIGO-PJ Zulia)

## 7. CATEGORÍA: Reglas de Desarrollo y Estilo (`07_development_rules.md`)

### 7.1. Stack Tecnológico Estricto

- **Landing Page:**
    - HTML5 semántico.
    - Tailwind CSS (vía CDN o build optimizado).
    - JavaScript ES6+ Vanilla.
- **Frontend SPA:**
    - `React 18.3+` / `TypeScript 5.3+`
    - Empaquetador: `Vite 5+`
    - Estilos: `Tailwind CSS 3.4+`
    - Gestor de Estado: `Zustand`
    - Iconos: `FontAwesome 6.5` / `Lucide React`
    - Gráficos: `Recharts`
- **Backend:**
    - Python `3.12+`
    - Framework: `FastAPI >= 0.110.0`
    - Validación de datos: `Pydantic v2 (pydantic >= 2.6.0)`
    - ORM: `SQLAlchemy 2.0+` (con soporte `asyncpg`)
    - Migraciones: `Alembic`
    - Tokens y Criptografía: `PyJWT` / `python-jose`, `passlib`
    - Cliente Google: `google-auth`

---

### 7.2. Convenciones de Código

- **TypeScript / React:**
    - Nombres de componentes en `PascalCase` (ej. `DashboardMetricsCard.tsx`).
    - Interfaces y tipos en `PascalCase` con prefijo `I` o descriptivo (ej. `MilitanteData`).
    - **Prohibido el uso de `any`**: definir tipos explícitos para todas las respuestas de API.
- **Python:**
    - Estándar `PEP 8`. Formato mediante `Black` y orden de imports con `isort`.
    - **Tipado Estricto:** Uso mandatorio de Type Hints en todas las firmas de funciones y servicios (`def get_lead(id: UUID) -> LeadResponse:`).
    - Modelos ORM en `snake_case`; esquemas Pydantic en `PascalCase`.

---

### 7.3. Estrategia de Manejo de Errores

- Todo acceso a base de datos asíncrono debe encapsularse con control de rollback en caso de error transaccional.
- Implementar un Exception Handler centralizado en FastAPI para capturar excepciones de dominio (`EntityNotFoundException`, `PermissionDeniedException`) y mapearlas al catálogo estándar JSON.

---

### 7.4. Lista de Prohibiciones Estrictas (Strict Rules)

1. **NO guardar contraseñas locales:** La autenticación se realiza exclusivamente vía delegación con Google OAuth 2.0.
2. **NO omitir validaciones en el Backend:** La validación que haga el frontend o la Landing Page es puramente de usabilidad; el backend debe re-validar exhaustivamente formatos, longitud, rango de edad y tipos mediante Pydantic.
3. **NO escribir consultas SQL manuales concatenando strings:** Se exige el uso del query builder de SQLAlchemy para evitar inyecciones SQL.
4. **NO subir secretos al control de versiones:** Archivos `.env` deben permanecer excluidos mediante `.gitignore`.
