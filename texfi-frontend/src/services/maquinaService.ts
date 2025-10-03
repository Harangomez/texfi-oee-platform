import { api } from './api';
import type { Maquina, MaquinaWithRelations, Produccion } from '../types';

export const maquinaService = {
  async getAll(): Promise<MaquinaWithRelations[]> {
    const response = await api.get('/maquinas');
    return response.data;
  },

  async getById(id: number): Promise<MaquinaWithRelations> {
    const response = await api.get(`/maquinas/${id}`);
    return response.data;
  },

  async create(maquina: Omit<Maquina, 'id'>): Promise<Maquina> {
    const response = await api.post('/maquinas', maquina);
    return response.data;
  },

  async update(id: number, maquina: Partial<Maquina>): Promise<void> {
    await api.patch(`/maquinas/${id}`, maquina);
  },

  async archive(id: number): Promise<void> {
    await api.patch(`/maquinas/${id}`, { activo: false });
  },

  async activate(id: number): Promise<void> {
    await api.patch(`/maquinas/${id}`, { activo: true });
  },

  async getProducciones(maquinaId: number): Promise<Produccion[]> {
    const response = await api.get(`/maquinas/${maquinaId}/producciones`);
    return response.data;
  }
};