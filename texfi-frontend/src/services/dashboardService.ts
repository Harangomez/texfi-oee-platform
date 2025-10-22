// services/dashboardService.ts - VERSIÓN CORREGIDA LOOPBACK 4
import { api } from '../services/api';
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
  periodoCalculo?: string;
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

// Función para calcular OEE - MANTENER EXISTENTE
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

  // Cálculos de tiempos
  const tiempoPlanificado = producciones.reduce((sum: number, p: Produccion) => {
    return sum + (p.tiempoPlanificado || 0);
  }, 0);
  
  const tiempoParo = producciones.reduce((sum: number, p: Produccion) => {
    return sum + (p.tiempoParo || 0);
  }, 0);
  
  const tiempoOperativo = tiempoPlanificado - tiempoParo;

  // Filtrar detalles que pertenecen a las producciones del taller
  const produccionIds = producciones.map(p => p.id);
  const detallesFiltrados = detalles.filter((d: DetalleProduccion) => 
    produccionIds.includes(d.produccionId)
  );

  // Cálculos de unidades
  const unidadesProducidas = detallesFiltrados.reduce((sum: number, d: DetalleProduccion) => {
    return sum + (d.cantidadProducida || 0);
  }, 0);
  
  const unidadesDefectuosas = detallesFiltrados.reduce((sum: number, d: DetalleProduccion) => {
    return sum + (d.unidadesDefectuosas || 0);
  }, 0);
  
  const unidadesAprobadas = unidadesProducidas - unidadesDefectuosas;

  // CÁLCULOS OEE
  const disponibilidad = tiempoPlanificado > 0 ? tiempoOperativo / tiempoPlanificado : 0;
  
  const tiempoEstandarTotal = detallesFiltrados.reduce((sum: number, d: DetalleProduccion) => {
    const producto = productos.find((p: Producto) => p.id === d.productoId);
    const tiempoEstandar = producto?.tiempoEstandar || 0;
    const cantidadProducida = d.cantidadProducida || 0;
    return sum + (cantidadProducida * tiempoEstandar);
  }, 0);
  
  const rendimiento = tiempoOperativo > 0 ? tiempoEstandarTotal / tiempoOperativo : 0;
  const calidad = unidadesProducidas > 0 ? unidadesAprobadas / unidadesProducidas : 0;
  const oee = disponibilidad * rendimiento * calidad;

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

// FUNCIONES DE FECHA CORREGIDAS - VERSIÓN DEFINITIVA
const getFechaInicioPeriodo = (periodo?: Periodo): string => {
  const fecha = new Date();
  
  switch (periodo) {
    case 'ultimo-dia': {
      // Ayer (día completo)
      fecha.setDate(fecha.getDate() - 1);
      fecha.setHours(0, 0, 0, 0);
      break;
    }
    case 'ultima-semana': {
      // Semana anterior completa (Lunes a Domingo)
      // Ejemplo: Hoy 21 Oct 2024 -> Semana anterior: 14-20 Oct 2024
      
      // Obtener el lunes de esta semana
      const diaSemana = fecha.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
      const diffLunes = diaSemana === 0 ? 6 : diaSemana - 1; // Días desde el lunes
      
      // Lunes de esta semana menos 7 días = Lunes semana anterior
      fecha.setDate(fecha.getDate() - diffLunes - 7);
      fecha.setHours(0, 0, 0, 0);
      break;
    }
    case 'ultimo-mes': {
      // Mes anterior completo
      // Ejemplo: Hoy Oct 2024 -> Mes anterior: 1-30 Sep 2024
      fecha.setMonth(fecha.getMonth() - 1);
      fecha.setDate(1); // Primer día del mes anterior
      fecha.setHours(0, 0, 0, 0);
      break;
    }
    case 'ultimo-año': {
      // Año anterior completo
      fecha.setFullYear(fecha.getFullYear() - 1);
      fecha.setMonth(0); // Enero
      fecha.setDate(1); // Día 1
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
      // Fin de ayer
      fecha.setDate(fecha.getDate() - 1);
      fecha.setHours(23, 59, 59, 999);
      break;
    }
    case 'ultima-semana': {
      // Domingo de la semana anterior
      // Ejemplo: Hoy 21 Oct 2024 -> Domingo semana anterior: 20 Oct 2024
      
      // Obtener el domingo de esta semana
      const diaSemana = fecha.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
      const diffDomingo = diaSemana === 0 ? 0 : 7 - diaSemana; // Días hasta domingo
      
      // Domingo de esta semana menos 1 día = Domingo semana anterior
      fecha.setDate(fecha.getDate() - diffDomingo - 1);
      fecha.setHours(23, 59, 59, 999);
      break;
    }
    case 'ultimo-mes': {
      // Último día del mes anterior
      // Ejemplo: Hoy Oct 2024 -> Último día Sep 2024: 30 Sep 2024
      fecha.setDate(0); // Último día del mes anterior (mes actual - 1)
      fecha.setHours(23, 59, 59, 999);
      break;
    }
    case 'ultimo-año': {
      // Último día del año anterior
      fecha.setFullYear(fecha.getFullYear() - 1);
      fecha.setMonth(11); // Diciembre
      fecha.setDate(31); // Día 31
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

/*const fechaInicio = getFechaInicioPeriodo(filters.periodo);
const fechaFin = getFechaFinPeriodo(filters.periodo);

// 🚨 VERIFICACIÓN CRÍTICA DE RANGO DE FECHAS
const fechaInicioDate = new Date(fechaInicio);
const fechaFinDate = new Date(fechaFin);
const diferenciaDias = (fechaFinDate.getTime() - fechaInicioDate.getTime()) / (1000 * 60 * 60 * 24);

console.log('🔴🔴🔴 VERIFICACIÓN RANGO FECHAS:', {
  periodo: filters.periodo,
  fechaInicio: fechaInicioDate.toLocaleDateString('es-CO'),
  fechaFin: fechaFinDate.toLocaleDateString('es-CO'),
  diferenciaDias: diferenciaDias.toFixed(2),
  rangoValido: diferenciaDias > 0
});

if (diferenciaDias <= 0) {
  console.error('❌ ERROR CRÍTICO: Rango de fechas inválido');
  return calcularOEE([], [], [], undefined, filters.periodo);
}*/

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

// Función para agrupar datos por periodo - MANTENER EXISTENTE
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
      if (!filters.tallerId) {
        console.error('❌ ERROR: No se proporcionó tallerId en getOeeData');
        throw new Error('Se requiere tallerId para calcular OEE');
      }
      
      const fechaInicio = getFechaInicioPeriodo(filters.periodo);
      const fechaFin = getFechaFinPeriodo(filters.periodo);
      
      // 🚨 CORRECCIÓN CRÍTICA: Sintaxis LoopBack 4
      const filter = {
        where: {
          and: [
            { tallerId: filters.tallerId },
            { fecha: { between: [fechaInicio, fechaFin] } }
          ]
        }
      };

      console.log('🔴🔴🔴 getOeeData - FILTRO LB4:', JSON.stringify(filter, null, 2));
      console.log('🔴🔴🔴 getOeeData - PERÍODO:', filters.periodo);

      const [produccionesResponse, detallesResponse, productosResponse] = await Promise.all([
        api.get('/producciones', { params: { filter: JSON.stringify(filter) } }),
        api.get('/detalles-produccion', { params: { filter: JSON.stringify(filter) } }),
        api.get('/productos', { params: { filter: JSON.stringify({ where: { tallerId: filters.tallerId } }) } })
      ]);
      
      console.log('🔴🔴🔴 getOeeData - RESULTADOS FILTRADOS:', {
        produccionesCount: produccionesResponse.data.length,
        detallesCount: detallesResponse.data.length,
        productosCount: productosResponse.data.length,
        tallerId: filters.tallerId
      });

      const producciones = produccionesResponse.data;
      const detalles = detallesResponse.data;
      const productos = productosResponse.data;

      // VERIFICACIÓN CRÍTICA: Si no hay datos en el período, retornar CEROS
      if (producciones.length === 0) {
        console.log(`📭 NO HAY DATOS para el período: ${filters.periodo} (${fechaInicio} a ${fechaFin})`);
        return calcularOEE([], [], [], undefined, filters.periodo);
      }

      // COMPORTAMIENTO ESPECÍFICO POR PERÍODO
      switch (filters.periodo) {
        case 'ultimo-dia': {
          console.log('📅 Modo: Último día - verificando fecha específica');
          
          const hoy = new Date();
          const ayer = new Date(hoy);
          ayer.setDate(hoy.getDate() - 1);
          const fechaAyer = ayer.toISOString().split('T')[0];
          
          const produccionesDeAyer = producciones.filter((p: Produccion) => {
            const fechaProduccion = new Date(p.fecha).toISOString().split('T')[0];
            return fechaProduccion === fechaAyer;
          });
          
          console.log('📊 Producciones del día de ayer:', {
            fechaRequerida: fechaAyer,
            cantidad: produccionesDeAyer.length,
            hayDatos: produccionesDeAyer.length > 0
          });
          
          if (produccionesDeAyer.length === 0) {
            console.log('📭 No hay producciones registradas para ayer, retornando datos vacíos');
            return calcularOEE([], [], [], undefined, 'ultimo-dia');
          }
          
          return calcularOEE(produccionesDeAyer, detalles, productos, fechaAyer, 'ultimo-dia');
        }
        
        default: {
          // Para semana, mes y año: usar TODAS las producciones del período filtrado
          console.log(`📊 Modo: ${filters.periodo} - calculando AGREGADO del período completo`);
          return calcularOEE(producciones, detalles, productos, undefined, filters.periodo);
        }
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
      if (!filters.tallerId) {
        console.error('❌ ERROR: No se proporcionó tallerId en getOeeTrend');
        throw new Error('Se requiere tallerId para calcular tendencia OEE');
      }
      
      const fechaInicio = getFechaInicioTrend(filters.periodo, filters.limite);

      // 🚨 CORRECCIÓN: Sintaxis LoopBack 4
      const filter = {
        where: {
          and: [
            { tallerId: filters.tallerId },
            { fecha: { gte: fechaInicio } }
          ]
        }
      };

      console.log('🔵🔵🔵 getOeeTrend - FILTRO LB4:', JSON.stringify(filter, null, 2));

      const [produccionesResponse, detallesResponse, productosResponse] = await Promise.all([
        api.get('/producciones', { params: { filter: JSON.stringify(filter) } }),
        api.get('/detalles-produccion', { params: { filter: JSON.stringify(filter) } }),
        api.get('/productos', { params: { filter: JSON.stringify({ where: { tallerId: filters.tallerId } }) } })
      ]);
      
      console.log('🔵🔵🔵 getOeeTrend - RESULTADOS FILTRADOS:', {
        produccionesCount: produccionesResponse.data.length,
        detallesCount: detallesResponse.data.length,
        productosCount: productosResponse.data.length,
        tallerId: filters.tallerId
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

  async getTimeTrend(filters: {
    tallerId?: number;
    periodo?: Periodo;
    limite?: number;
  }): Promise<TimeTrendData[]> {
    try {
      if (!filters.tallerId) {
        console.error('❌ ERROR: No se proporcionó tallerId en getTimeTrend');
        throw new Error('Se requiere tallerId para calcular tendencia de tiempos');
      }
      
      const fechaInicio = getFechaInicioTrend(filters.periodo, filters.limite);

      // 🚨 CORRECCIÓN: Sintaxis LoopBack 4
      const filter = {
        where: {
          and: [
            { tallerId: filters.tallerId },
            { fecha: { gte: fechaInicio } }
          ]
        }
      };

      console.log('⏰ getTimeTrend - FILTRO LB4:', JSON.stringify(filter, null, 2));

      const produccionesResponse = await api.get('/producciones', { 
        params: { filter: JSON.stringify(filter) } 
      });
      
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
      if (!filters.tallerId) {
        console.error('❌ ERROR: No se proporcionó tallerId en getProductionTrend');
        throw new Error('Se requiere tallerId para calcular tendencia de producción');
      }
      
      const fechaInicio = getFechaInicioTrend(filters.periodo, filters.limite);

      // 🚨 CORRECCIÓN: Sintaxis LoopBack 4
      const filter = {
        where: {
          and: [
            { tallerId: filters.tallerId },
            { fecha: { gte: fechaInicio } }
          ]
        }
      };

      console.log('📦 getProductionTrend - FILTRO LB4:', JSON.stringify(filter, null, 2));

      const [produccionesResponse, detallesResponse] = await Promise.all([
        api.get('/producciones', { params: { filter: JSON.stringify(filter) } }),
        api.get('/detalles-produccion', { params: { filter: JSON.stringify(filter) } })
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