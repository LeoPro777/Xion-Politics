# Blueprint de Contexto para Sistema de Análisis y Gestión Regional Partidista (SIGO-PJ Zulia)

## 6. CATEGORÍA: Contratos de Integración y API (`06_api_spec.md`)

### 6.1. Especificación de Endpoints Principales

---

#### 1. `POST /api/v1/auth/google`

- **Propósito:** Intercambiar el token de Google por la sesión interna.
- **Autenticación:** Pública (No requiere token previo).
- **Entrada (Request Body):**

```json
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFhMmIz..."
}
```

- **Salida Exitosa (`200 OK`):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "token_type": "bearer",
  "user": {
    "id": "b2c6e1aa-8521-4d57-b087-c10424b9bbd0",
    "email": "usuario@pjzulia.org.ve",
    "full_name": "Leonard Hernández",
    "role": "SUPERADMIN",
    "municipio_id": null,
    "avatar_url": "https://lh3.googleusercontent.com/..."
  }
}
```

---

#### 2. `POST /api/v1/leads/public`

- **Propósito:** Ingesta de registros desde la Landing Page oficial (Voluntariado y Escuela de Formación).
- **Autenticación:** Pública (Sujeto a Rate Limiting y CORS).
- **Entrada (Payload Pydantic):**

```json
{
  "tipo": "VOLUNTARIADO_GENERAL",
  "nombre_completo": "Gabriel Torres",
  "edad": 22,
  "telefono": "+584141234567",
  "email": "gabriel.torres@gmail.com",
  "municipio": "San Francisco",
  "area_interes": "Defensa Electoral",
  "mensaje": "Deseo apoyar como testigo de mesa en La Coromoto."
}
```

- **Salida Exitosa (`201 Created`):**

```json
{
  "status": "success",
  "message": "Registro recibido exitosamente",
  "lead_id": "7f8b5490-2ff5-4e32-9cb8-9bcf576efda2"
}
```

---

#### 3. `GET /api/v1/dashboard/metrics`

- **Propósito:** Obtener indicadores clave de rendimiento (KPIs) para el Dashboard.
- **Cabecera requerida:** `Authorization: Bearer <TOKEN>`
- **Salida Exitosa (`200 OK`):**

```json
{
  "total_militantes": 1542,
  "total_leads": 389,
  "leads_nuevos_mes": 67,
  "cobertura_cargos_municipales_pct": 84.5,
  "cobertura_centros_votacion_pct": 62.1,
  "distribucion_subregiones": [
    { "subregion": "Metropolitana", "militantes": 810 },
    { "subregion": "Costa Oriental", "militantes": 420 },
    { "subregion": "Sur del Lago", "militantes": 172 },
    { "subregion": "Perijá y Guajira", "militantes": 140 }
  ]
}
```

---

### 6.2. Catálogo de Errores Estándar

Todos los errores responderán bajo la siguiente estructura unificada:

```json
{
  "error_code": "RESOURCE_NOT_FOUND",
  "detail": "El municipio solicitado con ID 99 no existe en el registro.",
  "timestamp": "2026-10-12T20:51:00Z"
}
```

#### Códigos HTTP de Error Soportados:

- **`400 Bad Request`**: Datos malformados o parámetros inválidos.
- **`401 Unauthorized`**: Token ausente, vencido o con firma inválida.
- **`403 Forbidden`**: El usuario autenticado carece de jerarquía territorial para el recurso solicitado.
- **`404 Not Found`**: Recurso no encontrado.
- **`422 Unprocessable Entity`**: Fallo de validación de esquemas Pydantic.
