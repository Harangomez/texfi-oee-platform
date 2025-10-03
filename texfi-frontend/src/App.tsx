import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ConfiguracionPage } from './pages/ConfiguracionPage';
import { ProduccionPage } from './pages/ProduccionPage';
import { InformesPage } from './pages/InformesPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Cargando...</div>;
  }
  
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/configuracion" 
            element={
              <ProtectedRoute>
                <ConfiguracionPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/produccion" 
            element={
              <ProtectedRoute>
                <ProduccionPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/informes" 
            element={
              <ProtectedRoute>
                <InformesPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;