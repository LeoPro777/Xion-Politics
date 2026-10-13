import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { SubregionMetric } from '../../types';

interface SubregionChartProps {
  data: SubregionMetric[];
}

const COLORS = ['#FFD200', '#38BDF8', '#34D399', '#A78BFA', '#F472B6'];

export const SubregionChart: React.FC<SubregionChartProps> = ({ data }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-6 flex items-center justify-between">
        <span>Militancia por Subregión Zuliana</span>
        <span className="text-xs text-pjYellow font-semibold bg-yellow-400/10 px-2 py-0.5 rounded">Estado Zulia</span>
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <XAxis
              dataKey="subregion"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#fff',
              }}
              cursor={{ fill: 'rgba(255, 210, 0, 0.05)' }}
            />
            <Bar dataKey="militantes" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
