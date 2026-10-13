import React, { useEffect, useState } from 'react';
import { estructuraApi, militantesApi } from '../api/client';
import { CargoSeat, EstructuraTerritorio, Militante, Municipio } from '../types';
import { Modal } from '../components/common/Modal';
import {
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  Phone,
  UserCheck,
  UserPlus,
  Calendar,
} from 'lucide-react';

export const EstructuraPage: React.FC = () => {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [selectedMunicipioId, setSelectedMunicipioId] = useState<number>(1);
  const [estructura, setEstructura] = useState<EstructuraTerritorio | null>(null);
  const [militantes, setMilitantes] = useState<Militante[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de designación de titular
  const [selectedCargo, setSelectedCargo] = useState<CargoSeat | null>(null);
  const [selectedMilitanteId, setSelectedMilitanteId] = useState<string>('');
  const [fechaNombramiento, setFechaNombramiento] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [assigning, setAssigning] = useState(false);

  const fetchMunicipios = async () => {
    try {
      const data = await estructuraApi.getMunicipios();
      setMunicipios(data);
      if (data.length > 0) {
        setSelectedMunicipioId(data[0].id);
      }
    } catch (err) {
      console.error('Error cargando municipios:', err);
    }
  };

  const fetchEstructura = async (muniId: number) => {
    setLoading(true);
    try {
      const [data, militantesData] = await Promise.all([
        estructuraApi.getEstructuraMunicipio(muniId),
        militantesApi.list({ municipio_id: muniId }),
      ]);
      setEstructura(data);
      setMilitantes(militantesData);
    } catch (err) {
      console.error('Error cargando estructura municipal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMunicipios();
  }, []);

  useEffect(() => {
    if (selectedMunicipioId) {
      fetchEstructura(selectedMunicipioId);
    }
  }, [selectedMunicipioId]);

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCargo || !selectedMilitanteId) return;

    setAssigning(true);
    try {
      await estructuraApi.asignarCargo({
        cargo_id: selectedCargo.cargo_id,
        militante_id: selectedMilitanteId,
        municipio_id: selectedMunicipioId,
        fecha_nombramiento: fechaNombramiento,
      });
      setSelectedCargo(null);
      setSelectedMilitanteId('');
      fetchEstructura(selectedMunicipioId);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al asignar cargo en la junta directiva.');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Estructura Orgánica y Cargos</h1>
          <p className="text-xs text-slate-400 mt-1">
            Auditoría de 13 cargos estatutarios municipales con semaforización de vacantes y designación de titulares
          </p>
        </div>

        {/* Municipality selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400">Municipio:</label>
          <select
            value={selectedMunicipioId}
            onChange={(e) => setSelectedMunicipioId(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-white font-bold rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-pjYellow shadow-lg"
          >
            {municipios.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} ({m.subregion})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-xl">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase">Cargos Estatutarios</span>
          <p className="text-2xl font-black text-white">{estructura?.total_cargos ?? 13}</p>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase">Cargos Ocupados</span>
          <p className="text-2xl font-black text-emerald-400">{estructura?.cargos_ocupados ?? 0}</p>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase">Plazas Vacantes</span>
          <p className="text-2xl font-black text-amber-400">{estructura?.cargos_vacantes ?? 13}</p>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase">Cobertura Territorial</span>
          <p className="text-2xl font-black text-pjYellow">{estructura?.porcentaje_cobertura ?? 0}%</p>
        </div>
      </div>

      {/* Seats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-semibold text-xs">
            Cargando puestos estatutarios...
          </div>
        ) : (
          estructura?.cargos.map((cargo) => {
            const isVacant = cargo.vacante;
            const waUrl = cargo.titular_telefono
              ? `https://wa.me/${cargo.titular_telefono.replace(/\D/g, '')}`
              : '#';

            return (
              <div
                key={cargo.cargo_id}
                className={`rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between ${
                  isVacant
                    ? 'bg-slate-900/60 border-2 border-dashed border-amber-500/40 hover:border-amber-500'
                    : 'bg-slate-900 border border-slate-800 hover:border-yellow-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      Jerarquía #{cargo.orden_jerarquico}
                    </span>
                    {isVacant ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        VACANTE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        DESIGNADO
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-white leading-snug mb-3">
                    {cargo.nombre_cargo}
                  </h3>

                  {isVacant ? (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-400 italic bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                        Plaza vacante. Se requiere designación oficial por la Secretaría de Organización.
                      </p>
                      <button
                        onClick={() => setSelectedCargo(cargo)}
                        className="w-full bg-yellow-400/10 hover:bg-pjYellow text-pjYellow hover:text-black border border-pjYellow/30 font-bold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Designar Titular</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 text-xs">
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-pjYellow" />
                        <span>{cargo.titular_nombre}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Cédula: <span className="font-mono text-slate-300">V-{cargo.titular_cedula}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-pjYellow" />
                        <span>{cargo.titular_telefono}</span>
                      </div>
                    </div>
                  )}
                </div>

                {!isVacant && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold transition text-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Contactar Titular</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL DE DESIGNACIÓN DE TITULAR */}
      {selectedCargo && (
        <Modal
          isOpen={Boolean(selectedCargo)}
          onClose={() => setSelectedCargo(null)}
          title={`Designación Estatutaria: ${selectedCargo.nombre_cargo}`}
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 space-y-1">
              <span className="text-[10px] uppercase font-bold text-pjYellow">Cargo a Ocupar:</span>
              <p className="font-bold text-white text-sm">{selectedCargo.nombre_cargo}</p>
              <p className="text-[11px] text-slate-400">Orden jerárquico #{selectedCargo.orden_jerarquico}</p>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                Seleccionar Militante Activo *
              </label>
              <select
                required
                value={selectedMilitanteId}
                onChange={(e) => setSelectedMilitanteId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-pjYellow"
              >
                <option value="">Seleccione un militante del padrón...</option>
                {militantes.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.primer_nombre} {m.primer_apellido} (C.I: {m.cedula}) - {m.telefono}
                  </option>
                ))}
              </select>
              {militantes.length === 0 && (
                <p className="text-[11px] text-amber-400 mt-1">
                  Nota: No hay militantes inscritos en este municipio. Inscriba uno en el módulo "Padrón de Militantes".
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-pjYellow" />
                <span>Fecha Oficial de Nombramiento *</span>
              </label>
              <input
                type="date"
                required
                value={fechaNombramiento}
                onChange={(e) => setFechaNombramiento(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-pjYellow"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={assigning || !selectedMilitanteId}
                className="w-full bg-pjYellow hover:bg-pjYellowHover text-black font-black py-3 rounded-xl transition duration-200 disabled:opacity-50"
              >
                {assigning ? 'Formalizando Designación...' : 'Formalizar Nombramiento Estatutario'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
