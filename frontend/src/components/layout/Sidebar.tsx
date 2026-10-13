import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  GitFork,
  Vote,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard General', icon: LayoutDashboard },
    { to: '/leads', label: 'Leads y Voluntariado', icon: UserPlus },
    { to: '/militantes', label: 'Padrón de Militantes', icon: Users },
    { to: '/estructura', label: 'Estructura y Cargos', icon: GitFork },
    { to: '/electoral', label: 'Defensa y Centros', icon: Vote },
  ];

  return (
    <>
      {/* Backdrop para móviles */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pjYellow flex items-center justify-center font-black text-black text-sm">
              PJ
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-white block leading-none">
                SIGO-PJ
              </span>
              <span className="text-[10px] font-bold text-pjYellow uppercase tracking-wider">
                Estado Zulia
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
            aria-label="Cerrar menú lateral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-pjYellow text-black font-bold shadow-md shadow-pjYellow/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          Juventud Primero Justicia Zulia © 2026
        </div>
      </aside>
    </>
  );
};
