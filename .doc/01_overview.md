# Blueprint de Contexto para Sistema de Análisis y Gestión Regional Partidista (SIGO-PJ Zulia)

## 1. CATEGORÍA: Visión General y Alcance (`01_overview.md`)

### 1.1. Propósito del Sistema

El **Sistema de Información Geográfica y Operativa (SIGO-PJ Zulia)** es una plataforma integral diseñada para resolver la fragmentación operativa, la pérdida de datos de captación ciudadana y la falta de visibilidad territorial en tiempo real de la estructura partidista juvenil en el Estado Zulia.

- **Objetivo Principal:** Centralizar el censo de militantes, auditar el despliegue de las 13 coordinaciones municipales y 9 parroquiales, monitorear la cobertura de centros de votación / comités justicieros, y transformar los registros de la Landing Page pública en oportunidades de captación estructuradas mediante tableros analíticos e interactivos.

---

### 1.2. Alcance del Proyecto

#### En Alcance (In Scope):
- **Ingesta de Leads:** Recepción y procesamiento de registros públicos provenientes de la Landing Page oficial (Voluntariado y Escuela de Formación).
- **Seguridad y Accesos:** Autenticación federada mediante **Google OAuth 2.0** con emisión de tokens de sesión **JWT**.
- **Control de Acceso Territorial (RBAC):** Delimitación territorial estricta (Regional, Municipal, Parroquial).
- **Estructura Orgánica:** Directorio y semaforización de juntas directivas (Regional, 21 Municipios, 109 Parroquias).
- **Padrón Electoral y Militancia:** Padrón de militancia y asignación a Comités Justicieros / Centros de Votación.
- **Inteligencia de Negocio:** Dashboard ejecutivo con métricas de captación, embudos de formación y visualización analítica.
- **Reportes:** Exportación de padrones y reportes en formato CSV/Excel y PDF.

#### Fuera de Alcance (Out of Scope - Fase 1):
- Pasarela de pagos o recepción de donaciones financieras.
- Integración directa de mensajería SMS masiva (se prioriza protocolo URL directo a WhatsApp API).
- Escrutinio paralelo automatizado con OCR de actas físicas (planificado para Fase Electoral posterior).

---

### 1.3. Reglas de Negocio Globales

1. **Aislamiento Territorial:** Un directivo de nivel Parroquial jamás puede ver, editar ni exportar registros pertenecientes a otra parroquia o municipio. Un directivo Municipal solo tiene visibilidad de las parroquias bajo su jurisdicción.
2. **Validación de Edad y Elegibilidad:** Los militantes de la estructura juvenil deben registrarse con edades comprendidas entre los 14 y los 35 años cumplidos.
3. **No Pérdida de Leads (Landing Page Resilient):** La Landing Page debe permitir la captura de datos offline/fallback (almacenamiento local temporal) y sincronizarlos cuando la conexión hacia la API REST esté activa.
4. **Trazabilidad y Auditoría:** Toda modificación a la estructura directiva o reasignación de centro electoral debe registrar `created_by`, `updated_by` y marca temporal UTC.

---

### 1.4. Glosario de Términos

- **Militante:** Ciudadano registrado formalmente en el censo con datos validados.
- **Lead / Aspirante:** Registro originado en la Landing Page que aún no ha sido contactado ni asignado formalmente por la Secretaría de Organización.
- **Comité Justiciero:** Célula básica de organización partidista vinculada a un Centro de Votación específico.
- **Centro de Votación (CV):** Infraestructura electoral oficial registrada ante el CNE en una parroquia determinada.
- **Testigo de Mesa:** Militante o voluntario acreditado para defender el voto en una mesa electoral.
