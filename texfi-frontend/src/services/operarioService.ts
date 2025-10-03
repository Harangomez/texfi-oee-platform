import { api } from './api';
import type { Operario, OperarioWithRelations, Produccion } from '../types';

export const operarioService = {
  async getAll(): Promise<OperarioWithRelations[]> {
    const response = await api.get('/operarios');
    return response.data;
  },

  async getById(id: number): Promise<OperarioWithRelations> {
    const response = await api.get(`/operarios/${id}`);
    return response.data;
  },

  async create(operario: Omit<Operario, 'id'>): Promise<Operario> {
    const response = await api.post('/operarios', operario);
    return response.data;
  },

  async update(id: number, operario: Partial<Operario>): Promise<void> {
    await api.patch(`/operarios/${id}`, operario);
  },

  async archive(id: number): Promise<void> {
    await api.patch(`/operarios/${id}`, { activo: false });
  },

  async activate(id: number): Promise<void> {
    await api.patch(`/operarios/${id}`, { activo: true });
  },

  async getProducciones(operarioId: number): Promise<Produccion[]> {
    const response = await api.get(`/operarios/${operarioId}/producciones`);
    return response.data;
  }
};