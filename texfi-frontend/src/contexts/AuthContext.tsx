import React, { createContext, useState, useEffect } from 'react';
import type { Usuario, Taller, Cliente, RegisterData } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: Usuario | null;
  taller: Taller | null;
  cliente: Cliente | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [taller, setTaller] = useState<Taller | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      setTaller(userObj.taller || null);
      setCliente(userObj.cliente || null);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await authService.login({ email, password });
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setTaller(user.taller || null);
    setCliente(user.cliente || null);
  };

  const register = async (data: RegisterData) => {
    const { token, user } = await authService.register(data);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setTaller(user.taller || null);
    setCliente(user.cliente || null);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setTaller(null);
    setCliente(null);
  };

  return (
    <AuthContext.Provider value={{ user, taller, cliente, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext }; // AGREGAR ESTA LÍNEA