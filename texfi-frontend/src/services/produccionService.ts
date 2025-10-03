import { api } from './api';
import type { Produccion, ProduccionWithRelations, DetalleProduccion } from '../types';

// Interface para errores de Axios
interface AxiosError {
  response?: {
    data?: unknown;
  };
}

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'response' in error;
}

export const produccionService = {
  async getAll(): Promise<ProduccionWithRelations[]> {
    const response = await api.get('/producciones');
    return response.data;
  },

  async getById(id: number): Promise<ProduccionWithRelations> {
    const response = await api.get(`/producciones/${id}`);
    return response.data;
  },

  async create(produccion: Omit<Produccion, 'id'>): Promise<Produccion> {
    const response = await api.post('/producciones', produccion);
    return response.data;
  },

  async update(id: number, produccion: Partial<Produccion>): Promise<void> {
    await api.patch(`/producciones/${id}`, produccion);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/producciones/${id}`);
  },

  async getDetalles(produccionId: number): Promise<DetalleProduccion[]> {
    const response = await api.get(`/producciones/${produccionId}/detalles`);
    return response.data;
  },

  async addDetalle(produccionId: number, detalle: Omit<DetalleProduccion, 'id'>): Promise<DetalleProduccion> {
    try {
      console.log('Agregando detalle a producción:', { produccionId, detalle });
      const response = await api.post('/detalles-produccion', {
        ...detalle,
        produccionId
      });
      console.log('Detalle agregado exitosamente:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error('Error agregando detalle:', error.response?.data);
      } else {
        console.error('Error agregando detalle:', error);
      }
      throw error;
    }
  },

  async updateDetalle(id: number, detalle: Partial<DetalleProduccion>): Promise<void> {
    await api.patch(`/detalles-produccion/${id}`, detalle);
  },

  async deleteDetalle(id: number): Promise<void> {
    await api.delete(`/detalles-produccion/${id}`);
  },

  // Endpoints para cálculos de OEE
  async getCalculosOEE(filters: {
    tallerId?: number;
    fechaInicio?: string;
    fechaFin?: string;
    periodo?: 'dia' | 'semana' | 'mes' | 'año';
  }): Promise<{
    oee: number;
    disponibilidad: number;
    rendimiento: number;
    calidad: number;
    tiempoPlanificado: number;
    tiempoOperativo: number;
    tiempoParo: number;
    unidadesProducidas: number;
    unidadesDefectuosas: number;
  }>{
    const response = await api.get('/producciones/calculos-oee', { params: filters });
    return response.data;
  },

  async getMetricasDashboard(filters: {
    tallerId?: number;
    periodo?: 'dia' | 'semana' | 'mes' | 'año';
  }): Promise<{
    oee: number;
    disponibilidad: number;
    rendimiento: number;
    calidad: number;
    metricasAdicionales: Record<string, number>;
  }> {
    const response = await api.get('/dashboard/metricas', { params: filters });
    return response.data;
  },

  async agregarMaquina(produccionId: number, maquinaId: number): Promise<void> {
    try {
      console.log('Agregando máquina a producción:', { produccionId, maquinaId });
      const response = await api.post('/produccion-maquinas', {
        produccionId,
        maquinaId
      });
      console.log('Máquina agregada exitosamente:', response.data);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error('Error agregando máquina:', error.response?.data);
      } else {
        console.error('Error agregando máquina:', error);
      }
      throw error;
    }
  },

  async agregarOperario(produccionId: number, operarioId: number): Promise<void> {
    try {
      console.log('Agregando operario a producción:', { produccionId, operarioId });
      const response = await api.post('/produccion-operarios', {
        produccionId,
        operarioId
      });
      console.log('Operario agregado exitosamente:', response.data);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error('Error agregando operario:', error.response?.data);
      } else {
        console.error('Error agregando operario:', error);
      }
      throw error;
    }
  },
}