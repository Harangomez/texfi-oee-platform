import { api } from './api';
import type { LoginData, RegisterData, Usuario } from '../types';

export const authService = {
  async login(credentials: LoginData): Promise<{ token: string; user: Usuario }> {
    const response = await api.post('/login', {
      email: credentials.email,
      password: credentials.password
    });
    return response.data;
  },

  async register(data: RegisterData): Promise<{ token: string; user: Usuario }> {
    const requestData = {
      nombre: data.usuario.nombre,
      password: data.usuario.password,
      rol: data.usuario.rol,
      plan: data.usuario.plan,
      datos: data.usuario.rol === 'taller' ? data.taller : data.cliente
    };
    
    const response = await api.post('/register', requestData);
    return response.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/reset-password', { token, newPassword });
  },

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};