import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../api/client';
import { DashboardMetrics } from '../types';
import { StatsCard } from '../components/common/StatsCard';
import { SubregionChart } from '../components/dashboard/SubregionChart';
import { ConversionFunnel } from '../components/dashboard/ConversionFunnel';
import { Users, UserPlus, Award, Vote, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await dashboardApi.getMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Error al cargar métricas del dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Tablero Analítico Regional</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitoreo territorial y operativo en tiempo real de Primero Justicia en el Estado Zulia
          </p>
        </div>
        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-yellow-500/40 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar Datos</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Militantes"
          value={metrics?.total_militantes ?? '...'}
          subtitle="Jóvenes en padrón activo"
          icon={Users}
          badge="100% Auditado"
        />
        <StatsCard
          title="Leads del Mes"
          value={metrics?.leads_nuevos_mes ?? '...'}
          subtitle="Aspirantes registrados en portal"
          icon={UserPlus}
          badge="+14% vs anterior"
        />
        <StatsCard
          title="Cobertura Cargos"
          value={`${metrics?.cobertura_cargos_municipales_pct ?? 0}%`}
          subtitle="21 Juntas Municipales"
          icon={Award}
          badge="13 cargos estatutarios"
        />
        <StatsCard
          title="Centros de Votación"
          value={`${metrics?.cobertura_centros_votacion_pct ?? 0}%`}
          subtitle="Testigos y coordinadores asignados"
          icon={Vote}
          badge="Comités Justicieros"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubregionChart data={metrics?.distribucion_subregiones || []} />
        <ConversionFunnel
          totalLeads={metrics?.total_leads || 0}
          contactados={Math.round((metrics?.total_leads || 0) * 0.7)}
          enFormacion={Math.round((metrics?.total_leads || 0) * 0.45)}
          militantesActivos={metrics?.total_militantes || 0}
        />
      </div>

      {/* Subregion breakdown table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
          Resumen de Despliegue por Subregiones Zulianas
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Subregión</th>
                <th className="py-3 px-4">Militancia Juvenil</th>
                <th className="py-3 px-4">Estado Operativo</th>
                <th className="py-3 px-4">Prioridad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {metrics?.distribucion_subregiones.map((sub, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-semibold text-white">{sub.subregion}</td>
                  <td className="py-3 px-4 font-bold text-pjYellow">{sub.militantes} líderes</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Desplegado
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-medium">Consolidación de Comités</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
