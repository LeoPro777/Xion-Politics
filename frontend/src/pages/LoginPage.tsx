import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/client';
import { ShieldCheck, AlertCircle, Loader2, KeyRound, Shield, Building2, MapPin } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Función de inicio de sesión con token mock o Google
  const handleLogin = async (mockEmail?: string) => {
    setLoading(true);
    setError(null);
    try {
      const email = mockEmail || 'admin@pjzulia.org.ve';
      const token = `mock_token_${email}`;
      const response = await authApi.loginGoogle(token);
      setAuth(response.access_token, response.user);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'No se pudo autenticar. Verifique autorización institucional.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Soporte de bypass automático por URL (?bypass=admin|municipal|parroquial)
  useEffect(() => {
    const bypassParam = searchParams.get('bypass');
    if (bypassParam === 'admin') {
      handleLogin('admin@pjzulia.org.ve');
    } else if (bypassParam === 'municipal') {
      handleLogin('municipal@pjzulia.org.ve');
    } else if (bypassParam === 'parroquial') {
      handleLogin('parroquial@pjzulia.org.ve');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4 selection:bg-pjYellow selection:text-black">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card central */}
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center border-t-4 border-t-pjYellow">
          {/* Isotipo PJ */}
          <div className="w-16 h-16 rounded-2xl bg-pjYellow flex items-center justify-center font-black text-3xl text-black mx-auto mb-6 shadow-lg shadow-pjYellow/20 border-2 border-black">
            PJ
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">
            SIGO-PJ <span className="text-pjYellow">ZULIA</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1 mb-6">
            Sistema de Información Geográfica y Operativa
          </p>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-400 text-xs text-left">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Botón estandarizado Google OAuth */}
          <div className="space-y-4">
            <button
              onClick={() => handleLogin('admin@pjzulia.org.ve')}
              disabled={loading}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Iniciar Sesión con Google</span>
            </button>

            {/* SECCIÓN DE BYPASS DIRECTO / DEMO ROLES */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-pjYellow uppercase tracking-wider mb-3">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Acceso Rápido / Bypass por Roles (Dev)</span>
              </div>

              <div className="grid grid-cols-1 gap-2 text-left">
                <button
                  type="button"
                  onClick={() => handleLogin('admin@pjzulia.org.ve')}
                  disabled={loading}
                  className="w-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-yellow-500/40 p-2.5 rounded-xl transition flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-pjYellow" />
                    <div>
                      <p className="font-bold text-white">Superadmin Regional</p>
                      <p className="text-[10px] text-slate-400">Control total Zulia (21 Municipios)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-yellow-400/10 text-pjYellow px-2 py-0.5 rounded">Entrar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLogin('municipal@pjzulia.org.ve')}
                  disabled={loading}
                  className="w-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/40 p-2.5 rounded-xl transition flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-sky-400" />
                    <div>
                      <p className="font-bold text-white">Líder Municipal</p>
                      <p className="text-[10px] text-slate-400">Jurisdicción Maracaibo (18 Parroquias)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-sky-400/10 text-sky-400 px-2 py-0.5 rounded">Entrar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLogin('parroquial@pjzulia.org.ve')}
                  disabled={loading}
                  className="w-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/40 p-2.5 rounded-xl transition flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="font-bold text-white">Líder Parroquial</p>
                      <p className="text-[10px] text-slate-400">Jurisdicción Parroquia Chiquinquirá</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-400/10 text-emerald-400 px-2 py-0.5 rounded">Entrar</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 space-y-2">
            <p className="flex items-center justify-center gap-1.5 font-medium text-slate-400">
              <ShieldCheck className="w-4 h-4 text-pjYellow" />
              Acceso exclusivo para directivos autorizados.
            </p>
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs text-slate-400 hover:text-pjYellow font-semibold transition underline underline-offset-4"
              >
                ← Volver a la Landing Page Pública
              </button>
            </div>
          </div>
        </div>

        {/* Pie de página con indicación de confidencialidad */}
        <p className="text-[11px] text-slate-500 text-center mt-6">
          Información confidencial de la estructura partidista regional.
          <br />
          Primero Justicia Estado Zulia · Secretaría Juvenil Regional
        </p>
      </div>
    </div>
  );
};
