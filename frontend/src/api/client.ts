import axios from 'axios';
import {
  DashboardMetrics,
  EstructuraTerritorio,
  Lead,
  Militante,
  Municipio,
  Parroquia,
  UserProfile,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar token Bearer
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sigo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para redirección en caso de 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('sigo_token');
      localStorage.removeItem('sigo_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Endpoints de la API tipados
export const authApi = {
  loginGoogle: async (googleToken: string): Promise<{ access_token: string; user: UserProfile }> => {
    const res = await apiClient.post('/auth/google', { token: googleToken });
    return res.data;
  },
  getMe: async (): Promise<UserProfile> => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};

export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const res = await apiClient.get('/dashboard/metrics');
    return res.data;
  },
};

export const leadsApi = {
  list: async (params?: { municipio_id?: number; estado?: string }): Promise<Lead[]> => {
    const res = await apiClient.get('/leads', { params });
    return res.data;
  },
  updateStatus: async (leadId: string, estado: string): Promise<Lead> => {
    const res = await apiClient.patch(`/leads/${leadId}/status`, { estado });
    return res.data;
  },
};

export const militantesApi = {
  list: async (params?: { municipio_id?: number; parroquia_id?: number; search?: string }): Promise<Militante[]> => {
    const res = await apiClient.get('/militantes', { params });
    return res.data;
  },
  getById: async (id: string): Promise<Militante> => {
    const res = await apiClient.get(`/militantes/${id}`);
    return res.data;
  },
  create: async (data: Partial<Militante>): Promise<Militante> => {
    const res = await apiClient.post('/militantes', data);
    return res.data;
  },
};

export const estructuraApi = {
  getMunicipios: async (): Promise<Municipio[]> => {
    const res = await apiClient.get('/estructura/municipios');
    return res.data;
  },
  getParroquias: async (municipioId?: number): Promise<Parroquia[]> => {
    const res = await apiClient.get('/estructura/parroquias', {
      params: municipioId ? { municipio_id: municipioId } : {},
    });
    return res.data;
  },
  getEstructuraMunicipio: async (municipioId: number): Promise<EstructuraTerritorio> => {
    const res = await apiClient.get(`/estructura/municipios/${municipioId}`);
    return res.data;
  },
  getEstructuraParroquia: async (parroquiaId: number): Promise<EstructuraTerritorio> => {
    const res = await apiClient.get(`/estructura/parroquias/${parroquiaId}`);
    return res.data;
  },
  asignarCargo: async (data: {
    cargo_id: number;
    militante_id: string;
    municipio_id?: number | null;
    parroquia_id?: number | null;
    fecha_nombramiento: string;
  }) => {
    const res = await apiClient.post('/estructura/asignaciones', data);
    return res.data;
  },
};
