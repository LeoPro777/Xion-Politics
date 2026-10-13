import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuthStore();

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'Superadministrador';
      case 'REGIONAL_DIRECTOR':
        return 'Director Regional';
      case 'MUNICIPAL_LEADER':
        return 'Líder Municipal';
      case 'PARROQUIAL_LEADER':
        return 'Líder Parroquial';
      default:
        return 'Operador';
    }
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-pjYellow hidden sm:inline-block">
          Plataforma de Operaciones Zulia
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-sm font-semibold text-white leading-tight">{user?.full_name}</p>
            <span className="text-[11px] font-bold text-pjYellow uppercase flex items-center gap-1 justify-end">
              <Shield className="w-3 h-3" />
              {getRoleLabel(user?.role)}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-yellow-500/30 flex items-center justify-center text-pjYellow font-bold text-sm">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <UserIcon className="w-4 h-4" />
            )}
          </div>
        </div>

        <button
          onClick={logout}
          title="Cerrar Sesión"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
