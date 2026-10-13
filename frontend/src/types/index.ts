export type UserRole =
  | 'SUPERADMIN'
  | 'REGIONAL_DIRECTOR'
  | 'MUNICIPAL_LEADER'
  | 'PARROQUIAL_LEADER'
  | 'OPERADOR';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  municipio_id: number | null;
  parroquia_id: number | null;
  avatar_url?: string | null;
}

export interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserProfile) => void;
  logout: () => void;
}

export interface Lead {
  id: string;
  tipo: string;
  nombre_completo: string;
  edad?: number | null;
  telefono: string;
  email?: string | null;
  municipio_texto: string;
  municipio_id?: number | null;
  area_interes?: string | null;
  mensaje?: string | null;
  estado: 'NUEVO' | 'CONTACTADO' | 'EN_CURSO' | 'CONVERTIDO' | 'DESCARTADO';
  asignado_a?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Militante {
  id: string;
  nacionalidad: 'V' | 'E';
  cedula: number;
  primer_nombre: string;
  segundo_nombre?: string | null;
  primer_apellido: string;
  segundo_apellido?: string | null;
  fecha_nacimiento: string;
  telefono: string;
  email?: string | null;
  ocupacion?: string | null;
  es_estudiante: boolean;
  universidad?: string | null;
  parroquia_id: number;
  centro_votacion_id?: number | null;
  rol_electoral: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CargoSeat {
  cargo_id: number;
  nombre_cargo: string;
  nivel: 'MUNICIPAL' | 'PARROQUIAL';
  orden_jerarquico: number;
  vacante: boolean;
  titular_id?: string | null;
  titular_nombre?: string | null;
  titular_telefono?: string | null;
  titular_cedula?: number | null;
  estado_asignacion?: string | null;
  fecha_nombramiento?: string | null;
}

export interface EstructuraTerritorio {
  nivel: 'MUNICIPAL' | 'PARROQUIAL';
  municipio_id?: number | null;
  parroquia_id?: number | null;
  total_cargos: number;
  cargos_ocupados: number;
  cargos_vacantes: number;
  porcentaje_cobertura: number;
  cargos: CargoSeat[];
}

export interface Municipio {
  id: number;
  nombre: string;
  subregion: string;
  created_at: string;
}

export interface Parroquia {
  id: number;
  municipio_id: number;
  nombre: string;
}

export interface SubregionMetric {
  subregion: string;
  militantes: number;
}

export interface DashboardMetrics {
  total_militantes: number;
  total_leads: number;
  leads_nuevos_mes: number;
  cobertura_cargos_municipales_pct: number;
  cobertura_centros_votacion_pct: number;
  distribucion_subregiones: SubregionMetric[];
}
