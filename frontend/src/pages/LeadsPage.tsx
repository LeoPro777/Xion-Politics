import React, { useEffect, useState } from 'react';
import { leadsApi, estructuraApi } from '../api/client';
import { Lead, Municipio } from '../types';
import {
  Phone,
  Mail,
  MessageSquare,
  Filter,
  RefreshCw,
  Kanban,
  List as ListIcon,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

export const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [selectedMunicipio, setSelectedMunicipio] = useState<number | ''>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsData, munData] = await Promise.all([
        leadsApi.list({
          municipio_id: selectedMunicipio !== '' ? Number(selectedMunicipio) : undefined,
          estado: selectedEstado || undefined,
        }),
        estructuraApi.getMunicipios(),
      ]);
      setLeads(leadsData);
      setMunicipios(munData);
    } catch (err) {
      console.error('Error cargando leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMunicipio, selectedEstado]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await leadsApi.updateStatus(leadId, newStatus);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, estado: newStatus as any } : l))
      );
    } catch (err) {
      alert('Error al actualizar estado del lead');
    }
  };

  const kanbanColumns = [
    { id: 'NUEVO', label: 'Nuevos Registros', color: 'border-blue-500', badge: 'bg-blue-500/10 text-blue-400' },
    { id: 'CONTACTADO', label: 'Contactados', color: 'border-amber-500', badge: 'bg-amber-500/10 text-amber-400' },
    { id: 'EN_CURSO', label: 'En Formación', color: 'border-purple-500', badge: 'bg-purple-500/10 text-purple-400' },
    { id: 'CONVERTIDO', label: 'Promovidos a Militante', color: 'border-pjYellow', badge: 'bg-yellow-400/10 text-pjYellow' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Captación e Ingesta de Leads</h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión y seguimiento de aspirantes juveniles con flujo Kanban y vista tabular
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Switch de Vistas */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'kanban'
                  ? 'bg-pjYellow text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'table'
                  ? 'bg-pjYellow text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>Tabla</span>
            </button>
          </div>

          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-yellow-500/40 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refrescar</span>
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Filter className="w-4 h-4 text-pjYellow" />
            <span>Filtros Territoriales:</span>
          </div>
          <select
            value={selectedMunicipio}
            onChange={(e) => setSelectedMunicipio(e.target.value ? Number(e.target.value) : '')}
            className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pjYellow"
          >
            <option value="">Todos los Municipios</option>
            {municipios.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} ({m.subregion})
              </option>
            ))}
          </select>

          {viewMode === 'table' && (
            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pjYellow"
            >
              <option value="">Todos los Estados</option>
              <option value="NUEVO">Nuevos</option>
              <option value="CONTACTADO">Contactados</option>
              <option value="EN_CURSO">En Formación</option>
              <option value="CONVERTIDO">Convertidos</option>
              <option value="DESCARTADO">Descartados</option>
            </select>
          )}
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Total aspirantes: <strong className="text-pjYellow">{leads.length}</strong>
        </div>
      </div>

      {/* VISTA KANBAN */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map((col) => {
            const colLeads = leads.filter((l) => l.estado === col.id);
            return (
              <div
                key={col.id}
                className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3 border-t-4 ${col.color}`}
              >
                {/* Header de columna */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-xs font-black uppercase text-white tracking-wider">{col.label}</h3>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                    {colLeads.length}
                  </span>
                </div>

                {/* Lista de tarjetas */}
                <div className="space-y-3 min-h-[350px]">
                  {colLeads.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-[11px] text-slate-600 italic">
                      Sin aspirantes en esta etapa
                    </div>
                  ) : (
                    colLeads.map((lead) => {
                      const cleanPhone = lead.telefono.replace(/\D/g, '');
                      const waUrl = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(
                        lead.nombre_completo
                      )},%20te%20escribo%20de%20la%20Coordinaci%C3%B3n%20Juvenil%20Primero%20Justicia%20Zulia.`;

                      return (
                        <div
                          key={lead.id}
                          className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-3.5 space-y-2.5 transition shadow-sm"
                        >
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-pjYellow">
                              {lead.municipio_texto}
                            </span>
                            <h4 className="text-sm font-bold text-white leading-tight mt-0.5">
                              {lead.nombre_completo}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              {lead.edad ? `${lead.edad} años · ` : ''}
                              {lead.area_interes || 'General'}
                            </p>
                          </div>

                          {lead.mensaje && (
                            <p className="text-[11px] text-slate-300 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800 line-clamp-2">
                              "{lead.mensaje}"
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-emerald-400 hover:text-white flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-600 px-2.5 py-1 rounded-lg transition border border-emerald-500/20"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>

                            {/* Botón rápido de avanzar fase */}
                            {col.id === 'NUEVO' && (
                              <button
                                onClick={() => handleStatusChange(lead.id, 'CONTACTADO')}
                                className="text-[10px] font-bold text-slate-300 hover:text-white flex items-center gap-0.5 bg-slate-700 px-2 py-1 rounded-lg"
                                title="Avanzar a Contactado"
                              >
                                <span>Contactar</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                            {col.id === 'CONTACTADO' && (
                              <button
                                onClick={() => handleStatusChange(lead.id, 'EN_CURSO')}
                                className="text-[10px] font-bold text-slate-300 hover:text-white flex items-center gap-0.5 bg-slate-700 px-2 py-1 rounded-lg"
                                title="Avanzar a Formación"
                              >
                                <span>A Formación</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                            {col.id === 'EN_CURSO' && (
                              <button
                                onClick={() => handleStatusChange(lead.id, 'CONVERTIDO')}
                                className="text-[10px] font-bold text-black bg-pjYellow hover:bg-pjYellowHover px-2 py-1 rounded-lg flex items-center gap-0.5 font-black"
                                title="Promover a Militante"
                              >
                                <UserCheck className="w-3 h-3" />
                                <span>Militante</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VISTA TABLA */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">Aspirante</th>
                  <th className="py-3.5 px-4">Municipio</th>
                  <th className="py-3.5 px-4">Área de Interés</th>
                  <th className="py-3.5 px-4">Contacto</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 font-semibold">
                      {loading ? 'Cargando registros...' : 'No se encontraron leads con los filtros seleccionados.'}
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const cleanPhone = lead.telefono.replace(/\D/g, '');
                    const waUrl = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(
                      lead.nombre_completo
                    )},%20te%20escribo%20de%20la%20Coordinaci%C3%B3n%20Juvenil%20Primero%20Justicia%20Zulia.`;

                    return (
                      <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-4 px-4">
                          <div className="font-bold text-white text-sm">{lead.nombre_completo}</div>
                          <span className="text-[11px] text-slate-400">
                            {lead.edad ? `${lead.edad} años · ` : ''}
                            {lead.tipo.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-200">
                          {lead.municipio_texto}
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-300">
                          {lead.area_interes || 'General'}
                        </td>
                        <td className="py-4 px-4 space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Phone className="w-3.5 h-3.5 text-pjYellow" />
                            <span>{lead.telefono}</span>
                          </div>
                          {lead.email && (
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <Mail className="w-3.5 h-3.5" />
                              <span>{lead.email}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={lead.estado}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:border-pjYellow"
                          >
                            <option value="NUEVO">Nuevo</option>
                            <option value="CONTACTADO">Contactado</option>
                            <option value="EN_CURSO">En Curso</option>
                            <option value="CONVERTIDO">Convertido</option>
                            <option value="DESCARTADO">Descartado</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold transition text-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
