import React from 'react';

interface BadgeProps {
  status: string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const getBadgeStyle = (st: string) => {
    switch (st.toUpperCase()) {
      case 'NUEVO':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'CONTACTADO':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'EN_CURSO':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'CONVERTIDO':
      case 'ACTIVO':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'DESCARTADO':
      case 'SUSPENDIDO':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeStyle(
        status
      )}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};
