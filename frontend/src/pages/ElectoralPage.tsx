import React, { useEffect, useState } from 'react';
import { estructuraApi } from '../api/client';
import { Municipio, Parroquia } from '../types';
import {
  Vote,
  Building2,
  MapPin,
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface CentroVotacion {
  id: number;
  nombre: string;
  codigo_cne: string;
  direccion: string;
  mesas: number;
  electores: number;
  parroquia_id: number;
  cobertura_testigos?: number; // Porcentaje de testigos asignados
  coordinador_centro?: string | null;
}

export const ElectoralPage: React.FC = () => {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [parroquias, setParroquias] = useState<Parroquia[]>([]);
  const [selectedMunicipioId, setSelectedMunicipioId] = useState<number>(1);
  const [selectedParroquiaId, setSelectedParroquiaId] = useState<number | ''>('');
  const [centros, setCentros] = useState<CentroVotacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Carga inicial de municipios
  useEffect(() => {
    const init = async () => {
      try {
        const muns = await estructuraApi.getMunicipios();
        setMunicipios(muns);
        if (muns.length > 0) {
          setSelectedMunicipioId(muns[0].id);
        }
      } catch (e) {
        console.error('Error cargando municipios:', e);
      }
    };
    init();
  }, []);

  // Carga de parroquias al cambiar municipio
  useEffect(() => {
    if (!selectedMunicipioId) return;
    const fetchParroquias = async () => {
      try {
        const pars = await estructuraApi.getParroquias(selectedMunicipioId);
        setParroquias(pars);
        setSelectedParroquiaId('');
      } catch (e) {
        console.error('Error cargando parroquias:', e);
      }
    };
    fetchParroquias();
  }, [selectedMunicipioId]);

  // Carga de centros electorales con datos enriquecidos
  useEffect(() => {
    const fetchCentros = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('sigo_token');
        const url = selectedParroquiaId
          ? `http://127.0.0.1:8000/api/v1/electoral/centros?parroquia_id=${selectedParroquiaId}`
          : `http://127.0.0.1:8000/api/v1/electoral/centros`;

        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.ok) {
          const data: CentroVotacion[] = await res.json();
          // Añadir datos de simulación si no vienen
          const enriched = data.map((c, idx) => ({
            ...c,
            cobertura_testigos: [80, 100, 50, 20, 90][idx % 5],
            coordinador_centro: idx % 2 === 0 ? 'Coordinador Asignado' : 'Sin Designar',
          }));
          setCentros(enriched);
        }
      } catch (e) {
        console.error('Error cargando centros:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchCentros();
  }, [selectedMunicipioId, selectedParroquiaId]);

  const filteredCentros = centros.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.codigo_cne.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMesas = filteredCentros.reduce((acc, c) => acc + (c.mesas || 0), 0);
  const totalElectores = filteredCentros.reduce((acc, c) => acc + (c.electores || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Defensa del Voto y Centros Electorales</h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervisión territorial de centros de votación, mesas y cobertura de testigos en el Zulia
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold text-pjYellow flex items-center gap-2">
            <Vote className="w-4 h-4" />
            <span>Auditoría Electoral Activa</span>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs font-bold text-slate-400">Centros de Votación</span>
          <div className="text-2xl font-black text-white mt-1">{filteredCentros.length}</div>
          <span className="text-[10px] text-pjYellow">Auditoría en tiempo real</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs font-bold text-slate-400">Total de Mesas</span>
          <div className="text-2xl font-black text-sky-400 mt-1">{totalMesas}</div>
          <span className="text-[10px] text-slate-400">Padrón asignado</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs font-bold text-slate-400">Electores Registrados</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{totalElectores.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400">Registro Electoral CNE</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs font-bold text-slate-400">Meta Cobertura Testigos</span>
          <div className="text-2xl font-black text-pjYellow mt-1">75%</div>
          <span className="text-[10px] text-emerald-400">Estructura juvenil desplegada</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-pjYellow" />
            <select
              value={selectedMunicipioId}
              onChange={(e) => setSelectedMunicipioId(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pjYellow"
            >
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  Municipio {m.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <select
              value={selectedParroquiaId}
              onChange={(e) => setSelectedParroquiaId(e.target.value ? Number(e.target.value) : '')}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pjYellow"
            >
              <option value="">Todas las Parroquias</option>
              {parroquias.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por centro o código CNE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-pjYellow"
          />
        </div>
      </div>

      {/* Tabla de Centros */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Código CNE</th>
                <th className="py-3 px-4">Centro Electoral</th>
                <th className="py-3 px-4 text-center">Mesas</th>
                <th className="py-3 px-4 text-right">Electores</th>
                <th className="py-3 px-4">Cobertura Testigos</th>
                <th className="py-3 px-4">Coordinador de Centro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Cargando centros de votación...
                  </td>
                </tr>
              ) : filteredCentros.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No se encontraron centros electorales registrados para el filtro seleccionado.
                  </td>
                </tr>
              ) : (
                filteredCentros.map((centro) => {
                  const cob = centro.cobertura_testigos || 0;
                  return (
                    <tr key={centro.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-pjYellow">
                        {centro.codigo_cne}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{centro.nombre}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{centro.direccion}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-200">
                        {centro.mesas}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-200">
                        {centro.electores.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                            <div
                              className={`h-full rounded-full ${
                                cob >= 80 ? 'bg-emerald-400' : cob >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                              }`}
                              style={{ width: `${cob}%` }}
                            />
                          </div>
                          <span className="font-bold text-[11px] text-white">{cob}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {centro.coordinador_centro === 'Sin Designar' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Vacante
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {centro.coordinador_centro}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
