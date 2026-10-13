# Blueprint de Contexto para Sistema de Análisis y Gestión Regional Partidista (SIGO-PJ Zulia)

## 3. CATEGORÍA: Especificación Modular y Requerimientos (`03_modules.md`)

### 3.1. Listado de Módulos

1. **Módulo 01:** Autenticación, Usuarios y Permisos (Auth & RBAC)
2. **Módulo 02:** Captación e Ingesta de Leads (Landing Integration)
3. **Módulo 03:** Estructura Orgánica y Cargos (Juntas Regional, Municipal y Parroquial)
4. **Módulo 04:** Padrón de Militantes y Centros de Votación (Electoral)
5. **Módulo 05:** Panel Analítico, Métricas y Visualización (BI Dashboard)

---

### 3.2. Detalle por Módulo

#### Módulo 01: Autenticación, Usuarios y Permisos

- **3.2.1. Requerimientos Funcionales:**
    - **RF-01:** El usuario directivo debe poder iniciar sesión usando su cuenta institucional o autorizada de Google.
    - **RF-02:** El sistema debe validar que el email de Google pertenezca a un usuario pre-aprobado en el sistema; de lo contrario, rechaza el acceso (HTTP 403).
    - **RF-03:** Emisión de par de tokens (Access Token de 30 minutos y Refresh Token de 7 días).
- **3.2.2. Flujo de Datos / Algoritmo:**
    1. El usuario hace clic en "Continuar con Google" en el Frontend (React).
    2. Google emite el `id_token` o `code`.
    3. El Frontend envía el token al backend: `POST /api/v1/auth/google`.
    4. El backend valida la firma criptográfica contra los servidores de Google (`google-auth-library`).
    5. Se extrae `email` y `sub`. Se consulta la tabla `users`. Si está activo, se actualiza `last_login`.
    6. Se genera un `access_token` JWT con claims: `sub`, `email`, `role`, `municipio_id`, `parroquia_id`.
    7. Se responde al frontend con el token y perfil del usuario.
- **3.2.3. Wireframe / UI Concept:**
    - Pantalla limpia, fondo azul marino (`#0F172A`), tarjeta central con isotipo PJ en amarillo (`#FFD200`), botón estandarizado con el logo de Google: *"Iniciar Sesión con Google"*, pie de página con indicación de confidencialidad institucional.

---

#### Módulo 02: Captación e Ingesta de Leads (Landing Integration)

- **3.2.1. Requerimientos Funcionales:**
    - **RF-04:** Recibir solicitudes del formulario de Voluntariado y Formación de la Landing Page sin requerir autenticación previa.
    - **RF-05:** Clasificar el lead según su municipio y área de interés (`Voluntariado`, `Formación`, `Electoral`, `Universitario`).
    - **RF-06:** Permitir a los coordinadores municipales y parroquiales cambiar el estado del lead (`Nuevo`, `Contactado`, `Verificado`, `Convertido en Militante`, `Descartado`).
- **3.2.2. Flujo de Datos / Algoritmo:**
    1. La landing page envía `POST /api/v1/leads/public` con payload JSON.
    2. El backend sanitiza los campos de texto, normaliza el número telefónico a formato internacional (`+584...`).
    3. Se evalúa duplicidad por teléfono o correo en la tabla `leads`. Si existe, se anexa una nota de contacto recurrente sin abortar con error.
    4. Se almacena el registro con estado `NUEVO`.
- **3.2.3. Wireframe / UI Concept:**
    - Vista tipo Kanban o Data Grid en React. Columnas: *Nuevos*, *Contactados*, *En Formación*, *Promovidos a Militante*. Filtros rápidos por Municipio y Parroquia con badges de color.

---

#### Módulo 03: Estructura Orgánica y Cargos

- **3.2.1. Requerimientos Funcionales:**
    - **RF-07:** Mapear la Junta Municipal con un límite estricto de 13 cargos estatutarios.
    - **RF-08:** Mapear la Junta Parroquial con un límite estricto de 9 cargos estatutarios.
    - **RF-09:** Generar alerta de vacante si un cargo estatutario no tiene asignado un militante activo.
- **3.2.2. Flujo de Datos / Algoritmo:**
    1. El usuario solicita la estructura de un municipio: `GET /api/v1/estructura/municipios/{id}`.
    2. El backend consulta los 13 puestos reglamentarios y realiza un `LEFT JOIN` con las designaciones vigentes.
    3. Si un puesto carece de titular, se marca con la bandera `vacante = true`.
- **3.2.3. Wireframe / UI Concept:**
    - Organigrama interactivo y lista tipo tabla jerárquica. Las casillas vacantes se resaltan con borde discontinuo rojo/ámbar; los cargos asignados muestran la foto, nombre y teléfono del titular con botón de llamada o WhatsApp directo.

---

#### Módulo 04: Padrón de Militantes y Centros de Votación

- **3.2.1. Requerimientos Funcionales:**
    - **RF-10:** Registrar militantes con cédula de identidad, fecha de nacimiento, datos de contacto, ocupación y Centro de Votación asignado.
    - **RF-11:** Consultar la cobertura electoral calculando el porcentaje de testigos asignados por centro de votación.
- **3.2.2. Flujo de Datos / Algoritmo:**
    1. Creación de militante: `POST /api/v1/militantes`.
    2. Validación de unicidad de Cédula de Identidad (`cedula`).
    3. Asignación al Comité Justiciero de su centro de votación natural.
- **3.2.3. Wireframe / UI Concept:**
    - Data Table paginada con búsqueda instantánea por cédula o nombre. Modales laterales (Drawers) para ver la ficha completa del militante, historial formativo y rol electoral.

---

#### Módulo 05: Panel Analítico y Visualización (BI Dashboard)

- **3.2.1. Requerimientos Funcionales:**
    - **RF-12:** Mostrar KPIs consolidados: Total Militantes, Total Leads Mes, % Cobertura de Cargos Municipales, % Cobertura de Centros de Votación.
    - **RF-13:** Gráfica de barras por municipio ordenados por volumen de militancia.
    - **RF-14:** Embudo (Funnel) de conversión de formación política.
- **3.2.2. Flujo de Datos / Algoritmo:**
    1. Consulta consolidada mediante `GET /api/v1/dashboard/metrics`.
    2. Ejecución de queries de agregación (`COUNT`, `GROUP BY`) con caché en memoria o ejecución indexada rápida.
- **3.2.3. Wireframe / UI Concept:**
    - Cuadrícula superior con 4 tarjetas de métricas en fondo oscuro con acentos amarillos. Gráficas interactivas Recharts (barras y pastel) y tabla de resumen con semáforo por subregión (Metropolitana, COL, Perijá, Sur del Lago).
