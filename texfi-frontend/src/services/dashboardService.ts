// services/dashboardService.ts - VERSIÓN CORREGIDA
import { api } from './api';
import type { Produccion, DetalleProduccion, Producto } from '../types';

// Nuevo tipo de periodo
type Periodo = 'ultimo-dia' | 'ultima-semana' | 'ultimo-mes' | 'ultimo-año';

export interface OeeData {
  oee: number;
  disponibilidad: number;
  rendimiento: number;
  calidad: number;
  tiempoPlanificado: number;
  tiempoOperativo: number;
  tiempoParo: number;
  unidadesProducidas: number;
  unidadesDefectuosas: number;
  unidadesAprobadas: number;
  fechaCalculo?: string;
  periodoCalculo?: string; // NUEVO: Para indicar el tipo de cálculo
}

export interface TrendData {
  fecha: string;
  oee: number;
  disponibilidad: number;
  rendimiento: number;
  calidad: number;
}

export interface TimeTrendData {
  fecha: string;
  tiempoPlanificado: number;
  tiempoOperativo: number;
  tiempoParo: number;
}

export interface ProductionTrendData {
  fecha: string;
  unidadesProducidas: number;
  unidadesDefectuosas: number;
  unidadesAprobadas: number;
}

interface ApiFilters {
  tallerId?: number;
  'fecha[gte]'?: string;
  'fecha[lte]'?: string;
}

// Función para calcular OEE - VERSIÓN COMPLETAMENTE CORREGIDA
const calcularOEE = (
  producciones: Produccion[], 
  detalles: DetalleProduccion[], 
  productos: Producto[],
  fechaCalculo?: string,
  periodoCalculo?: string
): OeeData => {
  if (producciones.length === 0 || detalles.length === 0) {
    return {
      oee: 0,
      disponibilidad: 0,
      rendimiento: 0,
      calidad: 0,
      tiempoPlanificado: 0,
      tiempoOperativo: 0,
      tiempoParo: 0,
      unidadesProducidas: 0,
      unidadesDefectuosas: 0,
      unidadesAprobadas: 0,
      fechaCalculo,
      periodoCalculo
    };
  }

  console.log('🔍 INICIO calcularOEE - Datos brutos recibidos:');
  console.log('Producciones:', producciones.length);
  console.log('Detalles:', detalles.length);
  console.log('Productos:', productos.length);

  // Cálculos de tiempos - VERIFICAR UNIDADES (deben ser minutos)
  const tiempoPlanificado = producciones.reduce((sum: number, p: Produccion) => {
    return sum + (p.tiempoPlanificado || 0);
  }, 0);
  
  const tiempoParo = producciones.reduce((sum: number, p: Produccion) => {
    return sum + (p.tiempoParo || 0);
  }, 0);
  
  const tiempoOperativo = tiempoPlanificado - tiempoParo;

  console.log('⏰ Tiempos calculados:', { 
    tiempoPlanificado, 
    tiempoParo, 
    tiempoOperativo
  });

  // Filtrar detalles que pertenecen a las producciones del taller
  const produccionIds = producciones.map(p => p.id);
  const detallesFiltrados = detalles.filter((d: DetalleProduccion) => 
    produccionIds.includes(d.produccionId)
  );

  console.log('📊 Detalles filtrados:', detallesFiltrados.length, 'detalles');

  // Cálculos de unidades
  const unidadesProducidas = detallesFiltrados.reduce((sum: number, d: DetalleProduccion) => {
    return sum + (d.cantidadProducida || 0);
  }, 0);
  
  const unidadesDefectuosas = detallesFiltrados.reduce((sum: number, d: DetalleProduccion) => {
    return sum + (d.unidadesDefectuosas || 0);
  }, 0);
  
  const unidadesAprobadas = unidadesProducidas - unidadesDefectuosas;

  console.log('📦 Unidades calculadas:', { 
    unidadesProducidas, 
    unidadesDefectuosas, 
    unidadesAprobadas 
  });

  // CÁLCULOS OEE - VERIFICAR CADA PASO
  // 1. DISPONIBILIDAD = Tiempo operativo / Tiempo planificado
  const disponibilidad = tiempoPlanificado > 0 ? tiempoOperativo / tiempoPlanificado : 0;

  // 2. RENDIMIENTO = Tiempo estándar total / Tiempo operativo
  const tiempoEstandarTotal = detallesFiltrados.reduce((sum: number, d: DetalleProduccion) => {
    const producto = productos.find((p: Producto) => p.id === d.productoId);
    const tiempoEstandar = producto?.tiempoEstandar || 0;
    const cantidadProducida = d.cantidadProducida || 0;
    return sum + (cantidadProducida * tiempoEstandar);
  }, 0);
  
  const rendimiento = tiempoOperativo > 0 ? tiempoEstandarTotal / tiempoOperativo : 0;

  // 3. CALIDAD = Unidades aprobadas / Unidades producidas
  const calidad = unidadesProducidas > 0 ? unidadesAprobadas / unidadesProducidas : 0;

  // 4. OEE = Disponibilidad × Rendimiento × Calidad
  const oee = disponibilidad * rendimiento * calidad;

  console.log('🎯 OEE Final (%):', {
    oee: oee * 100,
    disponibilidad: disponibilidad * 100,
    rendimiento: rendimiento * 100,
    calidad: calidad * 100,
    tiempoPlanificado,
    tiempoOperativo,
    unidadesProducidas,
    fechaCalculo,
    periodoCalculo
  });

  return {
    oee: oee * 100,
    disponibilidad: disponibilidad * 100,
    rendimiento: rendimiento * 100,
    calidad: calidad * 100,
    tiempoPlanificado,
    tiempoOperativo,
    tiempoParo,
    unidadesProducidas,
    unidadesDefectuosas,
    unidadesAprobadas,
    fechaCalculo,
    periodoCalculo
  };
};

// FUNCIONES DE FECHA (MANTENER LAS EXISTENTES)
const getFechaInicioPeriodo = (periodo?: Periodo): string => {
  const fecha = new Date();
  
  switch (periodo) {
    case 'ultimo-dia': {
      fecha.setDate(fecha.getDate() - 1);
      fecha.setHours(0, 0, 0, 0);
      break;
    }
    case 'ultima-semana': {
      fecha.setDate(fecha.getDate() - 7 - fecha.getDay() + 1);
      fecha.setHours(0, 0, 0, 0);
      break;
    }
    case 'ultimo-mes': {
      fecha.setMonth(fecha.getMonth() - 1);
      fecha.setDate(1);
      fecha.setHours(0, 0, 0, 0);
      break;
    }
    case 'ultimo-año': {
      fecha.setFullYear(fecha.getFullYear() - 1);
      fecha.setMonth(0);
      fecha.setDate(1);
      fecha.setHours(0, 0, 0, 0);
      break;
    }
    default: {
      fecha.setDate(fecha.getDate() - 1);
      fecha.setHours(0, 0, 0, 0);
    }
  }
  
  console.log('📅 Fecha inicio calculada para', periodo, ':', fecha.toISOString());
  return fecha.toISOString();
};

const getFechaFinPeriodo = (periodo?: Periodo): string => {
  const fecha = new Date();
  
  switch (periodo) {
    case 'ultimo-dia': {
      fecha.setDate(fecha.getDate() - 1);
      fecha.setHours(23, 59, 59, 999);
      break;
    }
    case 'ultima-semana': {
      fecha.setDate(fecha.getDate() - fecha.getDay());
      fecha.setHours(23, 59, 59, 999);
      break;
    }
    case 'ultimo-mes': {
      fecha.setMonth(fecha.getMonth() - 1);
      fecha.setDate(0);
      fecha.setHours(23, 59, 59, 999);
      break;
    }
    case 'ultimo-año': {
      fecha.setFullYear(fecha.getFullYear() - 1);
      fecha.setMonth(11);
      fecha.setDate(31);
      fecha.setHours(23, 59, 59, 999);
      break;
    }
    default: {
      fecha.setDate(fecha.getDate() - 1);
      fecha.setHours(23, 59, 59, 999);
    }
  }
  
  console.log('📅 Fecha fin calculada para', periodo, ':', fecha.toISOString());
  return fecha.toISOString();
};

const getFechaInicioTrend = (periodo?: Periodo, limite?: number): string => {
  const fecha = new Date();
  const cantidad = limite || 12;
  
  switch (periodo) {
    case 'ultimo-dia': {
      fecha.setDate(fecha.getDate() - cantidad);
      break;
    }
    case 'ultima-semana': {
      fecha.setDate(fecha.getDate() - cantidad * 7);
      break;
    }
    case 'ultimo-mes': {
      fecha.setMonth(fecha.getMonth() - cantidad);
      break;
    }
    case 'ultimo-año': {
      fecha.setFullYear(fecha.getFullYear() - cantidad);
      break;
    }
    default: {
      fecha.setDate(fecha.getDate() - cantidad);
    }
  }
  
  fecha.setHours(0, 0, 0, 0);
  return fecha.toISOString();
};

// Función para agrupar datos por periodo (MANTENER EXISTENTE)
const agruparPorPeriodo = (producciones: Produccion[], periodo: Periodo) => {
  const grupos: { [key: string]: Produccion[] } = {};

  producciones.forEach(produccion => {
    const fecha = new Date(produccion.fecha);
    let clave = '';

    switch (periodo) {
      case 'ultimo-dia': {
        clave = fecha.toISOString().split('T')[0];
        break;
      }
      case 'ultima-semana': {
        const semana = getWeekNumber(fecha);
        clave = `${fecha.getFullYear()}-W${semana}`;
        break;
      }
      case 'ultimo-mes': {
        clave = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
      }
      case 'ultimo-año': {
        clave = fecha.getFullYear().toString();
        break;
      }
      default: {
        clave = fecha.toISOString().split('T')[0];
      }
    }

    if (!grupos[clave]) {
      grupos[clave] = [];
    }
    grupos[clave].push(produccion);
  });

  return grupos;
};

const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const dashboardService = {
  async getOeeData(filters: {
    tallerId?: number;
    periodo?: Periodo;
    fecha?: string;
  }): Promise<OeeData> {
    try {
      const params: ApiFilters = {};
      if (filters.tallerId) {
        params.tallerId = filters.tallerId;
      }
      
      const fechaInicio = getFechaInicioPeriodo(filters.periodo);
      const fechaFin = getFechaFinPeriodo(filters.periodo);
      
      if (fechaInicio) {
        params['fecha[gte]'] = fechaInicio;
      }
      if (fechaFin) {
        params['fecha[lte]'] = fechaFin;
      }

      console.log('🔴🔴🔴 getOeeData - PARÁMETROS:', JSON.stringify(params, null, 2));
      console.log('🔴🔴🔴 getOeeData - FILTROS:', filters);
      console.log('🔴🔴🔴 getOeeData - PERIODO:', filters.periodo);

      const [produccionesResponse, detallesResponse, productosResponse] = await Promise.all([
        api.get('/producciones', { params }),
        api.get('/detalles-produccion', { params }),
        api.get('/productos', { params })
      ]);
      
      console.log('🔴🔴🔴 getOeeData - RESPUESTA:', {
        produccionesCount: produccionesResponse.data.length,
        periodo: filters.periodo,
        rangoFechas: `${fechaInicio} a ${fechaFin}`
      });

      const producciones = produccionesResponse.data;
      const detalles = detallesResponse.data;
      const productos = productosResponse.data;

      // 🚨 CORRECCIÓN PRINCIPAL: Lógica diferente según el período
      if (producciones.length === 0) {
        console.log('📭 No hay producciones en el período seleccionado');
        return calcularOEE([], [], [], undefined, filters.periodo);
      }

      // PARA "ÚLTIMO DÍA": Calcular solo el último día disponible
      if (filters.periodo === 'ultimo-dia') {
        console.log('📅 Modo: Último día - calculando solo el día más reciente');
        
        // Ordenar producciones por fecha (más reciente primero)
        const produccionesOrdenadas = [...producciones].sort((a, b) => 
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        
        // Obtener la fecha más reciente
        const fechaMasReciente = produccionesOrdenadas[0].fecha.split('T')[0];
        
        // Filtrar producciones del día más reciente
        const produccionesDelDia = produccionesOrdenadas.filter(p => 
          p.fecha.startsWith(fechaMasReciente)
        );
        
        console.log('📊 Producciones del día más reciente:', {
          fecha: fechaMasReciente,
          cantidad: produccionesDelDia.length
        });
        
        return calcularOEE(produccionesDelDia, detalles, productos, fechaMasReciente, 'ultimo-dia');
      } 
      // PARA OTROS PERÍODOS (semana, mes, año): Calcular AGRUPADO de todo el período
      else {
        console.log('📊 Modo: Período extendido - calculando AGREGADO de todo el período');
        console.log('📈 Producciones en el período:', producciones.length);
        
        return calcularOEE(producciones, detalles, productos, undefined, filters.periodo);
      }

    } catch (error) {
      console.error('Error calculando OEE:', error);
      throw error;
    }
  },

  async getOeeTrend(filters: {
    tallerId?: number;
    periodo?: Periodo;
    limite?: number;
  }): Promise<TrendData[]> {
    try {
      const params: ApiFilters = {};
      if (filters.tallerId) {
        params.tallerId = filters.tallerId;
      }
      
      const fechaInicio = getFechaInicioTrend(filters.periodo, filters.limite);
      if (fechaInicio) {
        params['fecha[gte]'] = fechaInicio;
      }

      console.log('🔵🔵🔵 getOeeTrend - PARÁMETROS:', JSON.stringify(params, null, 2));
      console.log('🔵🔵🔵 getOeeTrend - FILTROS:', filters);

      const [produccionesResponse, detallesResponse, productosResponse] = await Promise.all([
        api.get('/producciones', { params }),
        api.get('/detalles-produccion', { params }),
        api.get('/productos', { params })
      ]);
      
      console.log('🔵🔵🔵 getOeeTrend - RESPUESTA:', {
        produccionesCount: produccionesResponse.data.length
      });
      
      const producciones = produccionesResponse.data;
      const detalles = detallesResponse.data;
      const productos = productosResponse.data;

      const grupos = agruparPorPeriodo(producciones, filters.periodo || 'ultimo-dia');
      
      const trendData: TrendData[] = Object.entries(grupos)
        .slice(-(filters.limite || 12))
        .map(([fecha, produccionesGrupo]) => {
          const produccionIdsGrupo = produccionesGrupo.map((p: Produccion) => p.id);
          const detallesGrupo = detalles.filter((d: DetalleProduccion) => 
            produccionIdsGrupo.includes(d.produccionId)
          );
          
          const oeeData = calcularOEE(produccionesGrupo, detallesGrupo, productos, fecha);
          
          return {
            fecha,
            oee: oeeData.oee,
            disponibilidad: oeeData.disponibilidad,
            rendimiento: oeeData.rendimiento,
            calidad: oeeData.calidad
          };
        });

      return trendData;
    } catch (error) {
      console.error('Error calculando tendencia OEE:', error);
      throw error;
    }
  },

  // ... (MANTENER getTimeTrend y getProductionTrend SIN CAMBIOS)
  async getTimeTrend(filters: {
    tallerId?: number;
    periodo?: Periodo;
    limite?: number;
  }): Promise<TimeTrendData[]> {
    try {
      const params: ApiFilters = {};
      if (filters.tallerId) {
        params.tallerId = filters.tallerId;
      }
      
      const fechaInicio = getFechaInicioTrend(filters.periodo, filters.limite);
      if (fechaInicio) {
        params['fecha[gte]'] = fechaInicio;
      }

      console.log('⏰ Obteniendo tendencia de tiempos para periodo:', filters.periodo);

      const produccionesResponse = await api.get('/producciones', { params });
      const producciones = produccionesResponse.data;
      const grupos = agruparPorPeriodo(producciones, filters.periodo || 'ultimo-dia');
      
      const timeTrendData: TimeTrendData[] = Object.entries(grupos)
        .slice(-(filters.limite || 12))
        .map(([fecha, produccionesGrupo]) => {
          const tiempoPlanificado = produccionesGrupo.reduce((sum: number, p: Produccion) => sum + (p.tiempoPlanificado || 0), 0);
          const tiempoParo = produccionesGrupo.reduce((sum: number, p: Produccion) => sum + (p.tiempoParo || 0), 0);
          const tiempoOperativo = tiempoPlanificado - tiempoParo;

          return {
            fecha,
            tiempoPlanificado,
            tiempoOperativo,
            tiempoParo
          };
        });

      return timeTrendData;
    } catch (error) {
      console.error('Error calculando tendencia de tiempos:', error);
      throw error;
    }
  },

  async getProductionTrend(filters: {
    tallerId?: number;
    periodo?: Periodo;
    limite?: number;
  }): Promise<ProductionTrendData[]> {
    try {
      const params: ApiFilters = {};
      if (filters.tallerId) {
        params.tallerId = filters.tallerId;
      }
      
      const fechaInicio = getFechaInicioTrend(filters.periodo, filters.limite);
      if (fechaInicio) {
        params['fecha[gte]'] = fechaInicio;
      }

      console.log('📦 Obteniendo tendencia de producción para periodo:', filters.periodo);

      const [produccionesResponse, detallesResponse] = await Promise.all([
        api.get('/producciones', { params }),
        api.get('/detalles-produccion', { params })
      ]);
      
      const producciones = produccionesResponse.data;
      const detalles = detallesResponse.data;
      const grupos = agruparPorPeriodo(producciones, filters.periodo || 'ultimo-dia');
      
      const productionTrendData: ProductionTrendData[] = Object.entries(grupos)
        .slice(-(filters.limite || 12))
        .map(([fecha, produccionesGrupo]) => {
          const produccionIdsGrupo = produccionesGrupo.map((p: Produccion) => p.id);
          const detallesGrupo = detalles.filter((d: DetalleProduccion) => 
            produccionIdsGrupo.includes(d.produccionId)
          );
          
          const unidadesProducidas = detallesGrupo.reduce((sum: number, d: DetalleProduccion) => sum + (d.cantidadProducida || 0), 0);
          const unidadesDefectuosas = detallesGrupo.reduce((sum: number, d: DetalleProduccion) => sum + (d.unidadesDefectuosas || 0), 0);
          const unidadesAprobadas = unidadesProducidas - unidadesDefectuosas;

          return {
            fecha,
            unidadesProducidas,
            unidadesDefectuosas,
            unidadesAprobadas
          };
        });

      return productionTrendData;
    } catch (error) {
      console.error('Error calculando tendencia de producción:', error);
      throw error;
    }
  }
};