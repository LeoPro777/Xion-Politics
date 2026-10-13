# Blueprint de Contexto para Sistema de Análisis y Gestión Regional Partidista (SIGO-PJ Zulia)

## 5. CATEGORÍA: Seguridad, Autenticación y Sesiones (`05_security_auth.md`)

### 5.1. Estrategia de Autenticación

- **Proveedor de Identidad:** Google Identity Services (OAuth 2.0).
- **Flujo:**
    1. El Frontend obtiene el `credential` (Google ID Token firmado) desde el SDK de Google.
    2. El Frontend envía dicho token a la ruta interna del Backend: `POST /api/v1/auth/google`.
    3. El Backend valida criptográficamente el token con la clave pública de Google:
    
    ```python
    from google.oauth2 import id_token
    from google.auth.transport import requests

    idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
    email = idinfo['email']
    ```
    
    4. Si el email está autorizado en la tabla `users` y `is_active = True`, se procede a la emisión de sesión interna. De lo contrario, se rechaza la solicitud (`403 Forbidden`).

---

### 5.2. Ciclo de Vida de la Sesión

- **Access Token:** Formato JWT firmado con algoritmo `HS256`. Caducidad de **30 minutos**.
- **Refresh Token:** Formato JWT con caducidad de **7 días**.
- **Estructura de Claims del JWT:**

```json
{
  "sub": "b2c6e1aa-8521-4d57-b087-c10424b9bbd0",
  "email": "coordinador.maracaibo@pjzulia.org.ve",
  "role": "MUNICIPAL_LEADER",
  "municipio_id": 1,
  "parroquia_id": null,
  "exp": 1776000000,
  "iat": 1775998200
}
```

- **Almacenamiento del Token:** El `access_token` se maneja en memoria dentro del estado de React (Zustand); el `refresh_token` se almacena como una cookie `HttpOnly`, `Secure`, `SameSite=Strict`.

---

### 5.3. Modelo de Autorización (RBAC) y Matriz de Permisos

| Módulo / Recurso | SUPERADMIN | REGIONAL_DIRECTOR | MUNICIPAL_LEADER | PARROQUIAL_LEADER |
| :--- | :--- | :--- | :--- | :--- |
| **Configuración de Usuarios y Roles** | CRUD Completo | Solo Lectura | Prohibido | Prohibido |
| **Leads Landing (Públicos)** | CRUD Global | CRUD Global | CRUD (Solo su municipio) | CRUD (Solo su parroquia) |
| **Estructura Directiva** | Modificación Global | Modificación Global | Modificación (Su municipio) | Solo Lectura (Su parroquia) |
| **Padrón de Militantes** | Consulta / Export Global | Consulta / Export Global | Consulta / Modif (Su municipio) | Modif (Solo su parroquia) |
| **Centros de Votación / Testigos** | Global | Global | Local Municipio | Local Parroquia |
| **Exportación CSV / Excel** | Habilitado | Habilitado | Habilitado (Filtrado) | Deshabilitado |
