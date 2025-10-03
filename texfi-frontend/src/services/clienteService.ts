import { api } from './api';
import type { Cliente, ClienteWithRelations, Producto, Taller } from '../types';

export const clienteService = {
  async getAll(): Promise<ClienteWithRelations[]> {
    const response = await api.get('/clientes');
    return response.data;
  },

  async getById(id: number): Promise<ClienteWithRelations> {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  async create(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    const response = await api.post('/clientes', cliente);
    return response.data;
  },

  async update(id: number, cliente: Partial<Cliente>): Promise<void> {
    await api.patch(`/clientes/${id}`, cliente);
  },

  async getTalleres(clienteId: number): Promise<Taller[]> {
    const response = await api.get(`/clientes/${clienteId}/talleres`);
    return response.data;
  },

  async getProductos(clienteId: number): Promise<Producto[]> {
    const response = await api.get(`/clientes/${clienteId}/productos`);
    return response.data;
  },

  // Endpoint especial para buscar clientes por taller
  async getByTaller(tallerId: number): Promise<Cliente[]> {
    const response = await api.get(`/clientes/por-taller/${tallerId}`);
    return response.data;
  }
};