import { api } from './api';
import type { Operacion, Produccion, Producto, ProductoWithRelations } from '../types';

interface ProductosParams {
  filter: string;
  tallerId?: number;
}

export const productoService = {
  async getAll(tallerId?: number): Promise<ProductoWithRelations[]> {
    const params: ProductosParams = {
      filter: JSON.stringify({
        include: ['cliente']
      })
    };

    if (tallerId) {
      params.tallerId = tallerId;
    }
    
    const response = await api.get('/productos', { params });
    return response.data;
  },

  async getById(id: number): Promise<ProductoWithRelations> {
    const response = await api.get(`/productos/${id}`, {
      params: {
        filter: JSON.stringify({
          include: ['cliente', 'operaciones']
        })
      }
    });
    return response.data;
  },

  async create(producto: Omit<Producto, 'id'>): Promise<Producto> {
    const response = await api.post('/productos', producto);
    return response.data;
  },

  async update(id: number, producto: Partial<Producto>): Promise<void> {
    await api.patch(`/productos/${id}`, producto);
  },

  async getOperaciones(productoId: number): Promise<Operacion[]> {
    const response = await api.get(`/productos/${productoId}/operaciones`);
    return response.data;
  },

  async getProducciones(productoId: number): Promise<Produccion[]> {
    const response = await api.get(`/productos/${productoId}/producciones`);
    return response.data;
  },

  async addOperacion(productoId: number, operacionId: number): Promise<void> {
    await api.post('/operaciones-producto', {
      productoId,
      operacionId
    });
  },

  async removeOperacion(productoId: number, operacionId: number): Promise<void> {
    await api.delete(`/productos/${productoId}/operaciones/${operacionId}`);
  }
};