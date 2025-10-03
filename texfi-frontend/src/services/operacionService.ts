import { api } from './api';
import type { Operacion, OperacionWithRelations, Producto } from '../types';

export const operacionService = {
  async getAll(): Promise<OperacionWithRelations[]> {
    const response = await api.get('/operaciones');
    return response.data;
  },

  async getById(id: number): Promise<OperacionWithRelations> {
    const response = await api.get(`/operaciones/${id}`);
    return response.data;
  },

  async create(operacion: Omit<Operacion, 'id'>): Promise<Operacion> {
    const response = await api.post('/operaciones', operacion);
    return response.data;
  },

  async update(id: number, operacion: Partial<Operacion>): Promise<void> {
    await api.patch(`/operaciones/${id}`, operacion);
  },

  async getProductos(operacionId: number): Promise<Producto[]> {
    const response = await api.get(`/operaciones/${operacionId}/productos`);
    return response.data;
  }
};