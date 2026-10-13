import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/guards/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsPage } from './pages/LeadsPage';
import { MilitantesPage } from './pages/MilitantesPage';
import { EstructuraPage } from './pages/EstructuraPage';
import { ElectoralPage } from './pages/ElectoralPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública principal: Landing Page por defecto */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas (SIGO-PJ) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/militantes" element={<MilitantesPage />} />
            <Route path="/estructura" element={<EstructuraPage />} />
            <Route path="/electoral" element={<ElectoralPage />} />
          </Route>
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
