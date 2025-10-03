import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getUserDisplayName = () => {
    if (!user) return '';
    
    if (user.rol === 'taller' && user.taller) {
      return `${user.nombre} - ${user.taller.nombre}`;
    } else if (user.rol === 'cliente' && user.cliente) {
      return `${user.nombre} - ${user.cliente.nombre}`;
    }
    
    return user.nombre;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/logo.png" alt="Texfi" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Texfi</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {getUserDisplayName()}
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
