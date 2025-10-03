import { api } from './api';
import type { Cliente, Maquina, Operario, Produccion, Taller, TallerWithRelations } from '../types';

export const tallerService = {
  async getAll(): Promise<TallerWithRelations[]> {
    const response = await api.get('/talleres');
    return response.data;
  },

  async getById(id: number): Promise<TallerWithRelations> {
    const response = await api.get(`/talleres/${id}`);
    return response.data;
  },

  async create(taller: Omit<Taller, 'id'>): Promise<Taller> {
    const response = await api.post('/talleres', taller);
    return response.data;
  },

  async update(id: number, taller: Partial<Taller>): Promise<void> {
    await api.patch(`/talleres/${id}`, taller);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/talleres/${id}`);
  },

  async getClientes(tallerId: number): Promise<Cliente[]> {
    const response = await api.get(`/talleres/${tallerId}/clientes`);
    return response.data;
  },

  async getMaquinas(tallerId: number): Promise<Maquina[]> {
    const response = await api.get(`/talleres/${tallerId}/maquinas`);
    return response.data;
  },

  async getOperarios(tallerId: number): Promise<Operario[]> {
    const response = await api.get(`/talleres/${tallerId}/operarios`);
    return response.data;
  },

  async getProducciones(tallerId: number): Promise<Produccion[]> {
    const response = await api.get(`/talleres/${tallerId}/producciones`);
    return response.data;
  }
};