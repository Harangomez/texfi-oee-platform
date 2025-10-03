import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // CAMBIAR la ruta de importación

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};