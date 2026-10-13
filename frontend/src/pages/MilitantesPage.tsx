import React, { useEffect, useState } from 'react';
import { militantesApi, estructuraApi } from '../api/client';
import { Militante, Municipio } from '../types';
import { Modal } from '../components/common/Modal';
import { Search, Plus, Vote, Phone, Mail, Building2, Download } from 'lucide-react';

export const MilitantesPage: React.FC = () => {
  const [militantes, setMilitantes] = useState<Militante[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [selectedMunicipio, setSelectedMunicipio] = useState<number | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal de detalle
  const [selectedMilitante, setSelectedMilitante] = useState<Militante | null>(null);

  // Modal de registro rápido
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMilitante, setNewMilitante] = useState<{
    nacionalidad: 'V' | 'E';
    cedula: string;
    primer_nombre: string;
    primer_apellido: string;
    fecha_nacimiento: string;
    telefono: string;
    email: string;
    parroquia_id: number;
    rol_electoral: string;
  }>({
    nacionalidad: 'V',
    cedula: '',
    primer_nombre: '',
    primer_apellido: '',
    fecha_nacimiento: '2004-01-01',
    telefono: '',
    email: '',
    parroquia_id: 1,
    rol_electoral: 'NO_ASIGNADO',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [militantesData, munData] = await Promise.all([
        militantesApi.list({
          municipio_id: selectedMunicipio !== '' ? Number(selectedMunicipio) : undefined,
          search: searchTerm || undefined,
        }),
        estructuraApi.getMunicipios(),
      ]);
      setMilitantes(militantesData);
      setMunicipios(munData);
    } catch (err) {
      console.error('Error cargando padrón:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedMunicipio]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await militantesApi.create({
        ...newMilitante,
        cedula: Number(newMilitante.cedula),
        parroquia_id: Number(newMilitante.parroquia_id),
      });
      setShowAddModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al inscribir militante en el padrón.');
    }
  };

  const exportCSV = () => {
    const headers = [
      'Nacionalidad',
      'Cedula',
      'Primer Nombre',
      'Primer Apellido',
      'Telefono',
      'Email',
      'Ocupacion',
      'Rol Electoral',
      'Estado',
    ];
    const rows = militantes.map((m) => [
      m.nacionalidad,
      m.cedula,
      `"${m.primer_nombre}"`,
      `"${m.primer_apellido}"`,
      `"${m.telefono}"`,
      `"${m.email || ''}"`,
      `"${m.ocupacion || ''}"`,
      `"${m.rol_electoral}"`,
      m.activo ? 'ACTIVO' : 'INACTIVO',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `padron_militantes_zulia_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Padrón de Militancia Juvenil</h1>
          <p className="text-xs text-slate-400 mt-1">
            Registro oficial territorial y asignación a Comités Justicieros y Centros de Votación
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            disabled={militantes.length === 0}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-50"
            title="Descargar padrón en formato CSV"
          >
            <Download className="w-3.5 h-3.5 text-pjYellow" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-pjYellow hover:bg-pjYellowHover text-black font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Inscribir Militante</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por Cédula o Nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-pjYellow"
          />
        </div>

        <select
          value={selectedMunicipio}
          onChange={(e) => setSelectedMunicipio(e.target.value ? Number(e.target.value) : '')}
          className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-pjYellow"
        >
          <option value="">Todos los Municipios</option>
          {municipios.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3.5 px-4">Cédula</th>
                <th className="py-3.5 px-4">Nombre Completo</th>
                <th className="py-3.5 px-4">Teléfono</th>
                <th className="py-3.5 px-4">Rol Electoral</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {militantes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-semibold">
                    {loading ? 'Cargando padrón...' : 'No se encontraron militantes registrados.'}
                  </td>
                </tr>
              ) : (
                militantes.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 font-mono font-bold text-pjYellow">
                      {m.nacionalidad}-{m.cedula.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">
                        {m.primer_nombre} {m.primer_apellido}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {m.ocupacion || (m.es_estudiante ? 'Estudiante' : 'Militante')}
                      </span>
                    </td>
                    <td className="py-4 px-4">{m.telefono}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        <Vote className="w-3 h-3 text-pjYellow" />
                        {m.rol_electoral.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        Activo
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedMilitante(m)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl font-bold transition text-xs"
                      >
                        Ver Ficha
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ficha Completa */}
      {selectedMilitante && (
        <Modal
          isOpen={Boolean(selectedMilitante)}
          onClose={() => setSelectedMilitante(null)}
          title={`Ficha de Militante: ${selectedMilitante.primer_nombre} ${selectedMilitante.primer_apellido}`}
        >
          <div className="space-y-4 text-xs text-slate-300">
            <div className="grid grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <div>
                <span className="text-slate-400 block font-semibold">Cédula de Identidad:</span>
                <p className="font-mono text-base font-bold text-pjYellow">
                  {selectedMilitante.nacionalidad}-{selectedMilitante.cedula}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Fecha Nacimiento:</span>
                <p className="font-semibold text-white">{selectedMilitante.fecha_nacimiento}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pjYellow" />
                <span>{selectedMilitante.telefono}</span>
              </div>
              {selectedMilitante.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-pjYellow" />
                  <span>{selectedMilitante.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-pjYellow" />
                <span>Ocupación: {selectedMilitante.ocupacion || 'No especificada'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-400 font-semibold block mb-1">Rol Electoral Asignado:</span>
              <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-pjYellow font-bold flex items-center gap-2">
                <Vote className="w-4 h-4" />
                <span>{selectedMilitante.rol_electoral.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Inscribir Militante */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Inscripción de Nuevo Militante Juvenil"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nac.</label>
                <select
                  value={newMilitante.nacionalidad}
                  onChange={(e) => setNewMilitante({ ...newMilitante, nacionalidad: e.target.value as 'V' | 'E' })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="V">V</option>
                  <option value="E">E</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Cédula *</label>
                <input
                  type="number"
                  required
                  value={newMilitante.cedula}
                  onChange={(e) => setNewMilitante({ ...newMilitante, cedula: e.target.value })}
                  placeholder="28123456"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Primer Nombre *</label>
                <input
                  type="text"
                  required
                  value={newMilitante.primer_nombre}
                  onChange={(e) => setNewMilitante({ ...newMilitante, primer_nombre: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Primer Apellido *</label>
                <input
                  type="text"
                  required
                  value={newMilitante.primer_apellido}
                  onChange={(e) => setNewMilitante({ ...newMilitante, primer_apellido: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">F. Nacimiento (14 a 35 años) *</label>
                <input
                  type="date"
                  required
                  value={newMilitante.fecha_nacimiento}
                  onChange={(e) => setNewMilitante({ ...newMilitante, fecha_nacimiento: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Teléfono *</label>
                <input
                  type="tel"
                  required
                  value={newMilitante.telefono}
                  onChange={(e) => setNewMilitante({ ...newMilitante, telefono: e.target.value })}
                  placeholder="0414-XXXXXXX"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-pjYellow hover:bg-pjYellowHover text-black font-extrabold py-3 rounded-xl transition duration-200 mt-2"
            >
              Guardar en Padrón Activo
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
