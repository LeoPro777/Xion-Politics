import React from 'react';

interface ConversionFunnelProps {
  totalLeads: number;
  contactados: number;
  enFormacion: number;
  militantesActivos: number;
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({
  totalLeads,
  contactados,
  enFormacion,
  militantesActivos,
}) => {
  const steps = [
    { label: 'Ingesta de Leads (Landing)', count: totalLeads, color: 'bg-blue-500' },
    { label: 'Contactados por Coordinación', count: contactados, color: 'bg-amber-500' },
    { label: 'En Escuela de Formación', count: enFormacion, color: 'bg-purple-500' },
    { label: 'Promovidos al Padrón Activo', count: militantesActivos, color: 'bg-pjYellow' },
  ];

  const maxVal = Math.max(totalLeads, 1);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-6">
        Embudo de Formación y Conversión Partidista
      </h3>
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const pct = Math.min(100, Math.round((step.count / maxVal) * 100));
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">{step.label}</span>
                <span className="text-white font-bold">{step.count} ({pct}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${step.color} transition-all duration-500 rounded-full`}
                  style={{ width: `${Math.max(pct, 4)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
