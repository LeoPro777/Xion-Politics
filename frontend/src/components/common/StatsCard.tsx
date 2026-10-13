import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-yellow-500/30 transition-all shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="w-9 h-9 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-pjYellow">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
          {badge && (
            <span className="text-xs font-bold text-pjYellow bg-yellow-400/10 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};
