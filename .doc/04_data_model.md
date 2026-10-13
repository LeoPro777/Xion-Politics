# Blueprint de Contexto para Sistema de Análisis y Gestión Regional Partidista (SIGO-PJ Zulia)

## 4. CATEGORÍA: Modelo y Estado de Datos (`04_data_model.md`)

### 4.1. Motor de Base de Datos

- **Motor Primario:** PostgreSQL 16+ (soporte nativo para UUID, JSONB e índices GiST/B-tree).

---

### 4.2. Esquema Detallado (DDL Lógico)

```sql
-- Extensión para generación de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Catálogo Geográfico: Municipios
CREATE TABLE municipios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    subregion VARCHAR(50) NOT NULL, -- Metropolitana, COL, Sur del Lago, Perija, Guajira
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Tabla de Catálogo Geográfico: Parroquias
CREATE TABLE parroquias (
    id SERIAL PRIMARY KEY,
    municipio_id INT NOT NULL REFERENCES municipios(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    CONSTRAINT uq_municipio_parroquia UNIQUE (municipio_id, nombre)
);

-- 3. Catálogo de Centros de Votación (CV)
CREATE TABLE centros_votacion (
    id SERIAL PRIMARY KEY,
    parroquia_id INT NOT NULL REFERENCES parroquias(id) ON DELETE CASCADE,
    codigo_cne VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    direccion TEXT,
    mesas_electorales INT DEFAULT 1,
    votantes_esperados INT DEFAULT 0
);

-- 4. Usuarios del Sistema (Gestores y Directivos)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(150) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    google_id VARCHAR(100) UNIQUE,
    avatar_url TEXT,
    role VARCHAR(30) NOT NULL DEFAULT 'OPERADOR_PARROQUIAL',
    -- Roles: SUPERADMIN, REGIONAL_DIRECTOR, MUNICIPAL_LEADER, PARROQUIAL_LEADER, OPERADOR
    municipio_id INT REFERENCES municipios(id) ON DELETE SET NULL,
    parroquia_id INT REFERENCES parroquias(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    last_login TIMESTAMP WITH TIME ZONE
);

-- 5. Padrón de Militantes
CREATE TABLE militantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nacionalidad CHAR(1) DEFAULT 'V' CHECK (nacionalidad IN ('V', 'E')),
    cedula INT UNIQUE NOT NULL,
    primer_nombre VARCHAR(60) NOT NULL,
    segundo_nombre VARCHAR(60),
    primer_apellido VARCHAR(60) NOT NULL,
    segundo_apellido VARCHAR(60),
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    ocupacion VARCHAR(100),
    es_estudiante BOOLEAN DEFAULT FALSE,
    universidad VARCHAR(100),
    parroquia_id INT NOT NULL REFERENCES parroquias(id),
    centro_votacion_id INT REFERENCES centros_votacion(id),
    rol_electoral VARCHAR(40) DEFAULT 'NO_ASIGNADO', -- TESTIGO, COORDINADOR_CENTRO, LOGISTICA
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Estructura Orgánica y Cargos (Juntas Directivas)
CREATE TABLE cargos_estructura (
    id SERIAL PRIMARY KEY,
    nivel VARCHAR(20) NOT NULL, -- MUNICIPAL o PARROQUIAL
    nombre_cargo VARCHAR(100) NOT NULL,
    orden_jerarquico INT NOT NULL
);

CREATE TABLE asignaciones_cargos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cargo_id INT NOT NULL REFERENCES cargos_estructura(id),
    militante_id UUID NOT NULL REFERENCES militantes(id) ON DELETE CASCADE,
    municipio_id INT REFERENCES municipios(id),
    parroquia_id INT REFERENCES parroquias(id),
    estado VARCHAR(20) DEFAULT 'ACTIVO', -- ACTIVO, SUPLENTE, SUSPENDIDO
    fecha_nombramiento DATE NOT NULL,
    CONSTRAINT uq_cargo_territorio UNIQUE (cargo_id, municipio_id, parroquia_id)
);

-- 7. Ingesta de Leads desde Landing Page
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL, -- VOLUNTARIADO_GENERAL, FORMACION_POLITICA
    nombre_completo VARCHAR(150) NOT NULL,
    edad INT,
    telefono VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    municipio_texto VARCHAR(100) NOT NULL,
    municipio_id INT REFERENCES municipios(id),
    area_interes VARCHAR(100),
    mensaje TEXT,
    estado VARCHAR(30) DEFAULT 'NUEVO', -- NUEVO, CONTACTADO, EN_CURSO, CONVERTIDO, DESCARTADO
    asignado_a UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

---

### 4.3. Relaciones y Cardinalidad

- `municipios` $\rightarrow$ `parroquias`: **1 a N** (Un municipio agrupa varias parroquias).
- `parroquias` $\rightarrow$ `centros_votacion`: **1 a N** (Cada parroquia contiene múltiples centros electorales).
- `centros_votacion` $\rightarrow$ `militantes`: **1 a N** (Varios militantes votan en el mismo centro).
- `militantes` $\leftrightarrow$ `cargos_estructura`: **1 a 1** por instancia territorial a través de `asignaciones_cargos`.
- `municipios` $\rightarrow$ `leads`: **1 a N** (Un lead se asocia a su municipio para gestión descentralizada).

---

### 4.4. Seeders (Datos Iniciales Obligatorios)

1. **Municipios del Zulia (21):**
   - Maracaibo, San Francisco, Cabimas, Lagunillas, Machiques de Perijá, Colón, Santa Rita, Mara, Baralt, Valmore Rodríguez, Miranda, Simón Bolívar, Rosario de Perijá, Jesús Enrique Lossada, La Cañada de Urdaneta, Guajira, Catatumbo, Francisco Javier Pulgar, Sucre, Jesús María Semprúm, Almirante Padilla.

2. **Cargos Estatutarios Municipales (13):**
   - Coordinador Juvenil Municipal
   - Coordinador Adjunto Juvenil Municipal
   - Coordinador de Asuntos Políticos
   - Coordinador de Organización
   - Coordinador de Formación
   - Coordinador de Comunicación
   - Coordinador de Asuntos Universitarios
   - Coordinador de Activismo
   - Coordinador Electoral
   - Coordinador de Asuntos Sociales
   - Coordinador de DDHH
   - Coordinador de Ambiente y Desarrollo
   - Coordinadores Políticos (2 plazas)

3. **Cargos Estatutarios Parroquiales (9):**
   - Coordinador Juvenil Parroquial
   - Coordinador Adjunto Juvenil Parroquial
   - Coordinador de Asuntos Políticos
   - Coordinador de Organización
   - Coordinador de Formación
   - Coordinador de Comunicación
   - Coordinador de Activismo
   - Coordinador Electoral
   - Coordinadores Políticos (2 plazas)

4. **Usuario Administrador Semilla:**
   - Email institucional habilitado para autorización inmediata con rol `SUPERADMIN`.
