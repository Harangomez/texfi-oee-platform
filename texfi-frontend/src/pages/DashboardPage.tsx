// DashboardPage.tsx - VERSIÓN DEFINITIVA CORREGIDA
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboardService';
import type { OeeData } from '../services/dashboardService';
import { GaugeChart } from '../components/dashboard/GaugeChart';
import { LineChart } from '../components/dashboard/LineChart';
import { Tabs, Tab, TabHeaders, TabContent } from '../components/ui/Tabs';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Target, TrendingUp, Clock, Package, AlertCircle } from 'lucide-react';

type Periodo = 'ultimo-dia' | 'ultima-semana' | 'ultimo-mes' | 'ultimo-año';

interface ChartData {
  fecha: string;
  [key: string]: number | string;
}

interface AxiosError {
  response?: {
    status?: number;
    data?: unknown;
  };
  config?: {
    url?: string;
    method?: string;
  };
}

function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'response' in error;
}

export const DashboardPage: React.FC = () => {
  const { taller } = useAuth();
  const [periodo, setPeriodo] = useState<Periodo>('ultimo-dia');
  const [meta, setMeta] = useState<number>(90);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [datosOee, setDatosOee] = useState<OeeData | null>(null);
  const [tendenciaOee, setTendenciaOee] = useState<ChartData[]>([]);
  const [tendenciaTiempos, setTendenciaTiempos] = useState<ChartData[]>([]);
  const [tendenciaProduccion, setTendenciaProduccion] = useState<ChartData[]>([]);

  // REF para evitar múltiples llamadas
  const cargandoRef = useRef(false);
  const llamadoIdRef = useRef(0);

  const cargarDatos = useCallback(async () => {
    // EVITAR MÚLTIPLES LLAMADAS SIMULTÁNEAS
    if (cargandoRef.current) {
      console.log('⏸️  Llamada ignorada - ya hay una carga en progreso');
      return;
    }

    if (!taller) {
      setError('No hay taller seleccionado');
      return;
    }

    const llamadoId = ++llamadoIdRef.current;
    console.log(`🚀 === INICIANDO CARGA ${llamadoId} ===`, { periodo });

    cargandoRef.current = true;
    setCargando(true);
    setError(null);
    
    // LIMPIAR TODO EL ESTADO PREVIO
    setDatosOee(null);
    setTendenciaOee([]);
    setTendenciaTiempos([]);
    setTendenciaProduccion([]);

    const filters = {
      tallerId: taller.id,
      periodo,
      limite: 12
    };

    try {
      console.log(`📊 === CARGA OEE ${llamadoId} - INICIO ===`);
      
      const oeeData = await dashboardService.getOeeData(filters);
      
      console.log(`✅ SERVICIO getOeeData ${llamadoId} COMPLETADO:`, {
        oee: oeeData.oee,
        disponibilidad: oeeData.disponibilidad,
        rendimiento: oeeData.rendimiento,
        calidad: oeeData.calidad,
        tiempoPlanificado: oeeData.tiempoPlanificado,
        tiempoOperativo: oeeData.tiempoOperativo,
        fechaCalculo: oeeData.fechaCalculo
      });

      // VERIFICAR SI ESTA ES LA ÚLTIMA LLAMADA VÁLIDA
      if (llamadoId === llamadoIdRef.current) {
        console.log(`💾 Guardando datos OEE ${llamadoId} en estado...`);
        setDatosOee(oeeData);
      } else {
        console.log(`🗑️  Datos OEE ${llamadoId} descartados - llamada obsoleta`);
        return;
      }

      console.log(`📈 === CARGA TENDENCIAS ${llamadoId} - INICIO ===`);
      
      // Cargar tendencias en paralelo
      const [oeeTrend, timeTrend, productionTrend] = await Promise.all([
        dashboardService.getOeeTrend(filters),
        dashboardService.getTimeTrend(filters),
        dashboardService.getProductionTrend(filters)
      ]);

      // VERIFICAR SI ESTA ES LA ÚLTIMA LLAMADA VÁLIDA
      if (llamadoId !== llamadoIdRef.current) {
        console.log(`🗑️  Tendencias ${llamadoId} descartadas - llamada obsoleta`);
        return;
      }

      console.log(`✅ Todas las tendencias ${llamadoId} cargadas`);
      
      setTendenciaOee(oeeTrend.map(item => ({
        fecha: item.fecha,
        oee: item.oee,
        disponibilidad: item.disponibilidad,
        rendimiento: item.rendimiento,
        calidad: item.calidad
      })));

      setTendenciaTiempos(timeTrend.map(item => ({
        fecha: item.fecha,
        tiempoPlanificado: item.tiempoPlanificado,
        tiempoOperativo: item.tiempoOperativo,
        tiempoParo: item.tiempoParo
      })));

      setTendenciaProduccion(productionTrend.map(item => ({
        fecha: item.fecha,
        unidadesProducidas: item.unidadesProducidas,
        unidadesDefectuosas: item.unidadesDefectuosas,
        unidadesAprobadas: item.unidadesAprobadas
      })));

      console.log(`🎉 === CARGA ${llamadoId} COMPLETADA EXITOSAMENTE ===`);

    } catch (error) {
      console.error(`❌ ERROR EN CARGA ${llamadoId}:`, error);
      
      // SOLO ACTUALIZAR ERROR SI ES LA LLAMADA MÁS RECIENTE
      if (llamadoId === llamadoIdRef.current) {
        let errorMessage = 'Error al cargar los datos del dashboard';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        if (isAxiosError(error)) {
          if (error.response?.status === 404) {
            errorMessage = 'Endpoints del dashboard no disponibles';
          } else if (error.response?.status === 500) {
            errorMessage = 'Error interno del servidor';
          }
        }
        
        setError(errorMessage);
        setDatosOee(null);
      }
    } finally {
      // SOLO ACTUALIZAR cargando SI ES LA LLAMADA MÁS RECIENTE
      if (llamadoId === llamadoIdRef.current) {
        console.log(`🏁 Finalizando carga ${llamadoId}`);
        setCargando(false);
        cargandoRef.current = false;
      }
    }
  }, [periodo, taller]);

  useEffect(() => {
    console.log('🔔 useEffect ejecutado - llamando cargarDatos');
    cargarDatos();
  }, [cargarDatos]);

  const recargarDatos = () => {
    console.log('🔄 Recarga manual solicitada');
    cargarDatos();
  };

  // LOG DEL ESTADO ACTUAL CON MÁS DETALLE
  console.log('🎯 RENDER - Estado actual:', {
    cargando,
    datosOee: datosOee ? {
      oee: datosOee.oee,
      disponibilidad: datosOee.disponibilidad,
      rendimiento: datosOee.rendimiento,
      calidad: datosOee.calidad,
      fechaCalculo: datosOee.fechaCalculo
    } : 'NULL',
    error,
    periodo,
    llamadoActual: llamadoIdRef.current
  });

  if (!taller) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Solo los talleres pueden acceder al dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Producción</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-gray-500" />
            <Input
              label="Meta OEE (%)"
              type="number"
              value={meta}
              onChange={(e) => setMeta(Number(e.target.value))}
              className="w-24"
              min="0"
              max="100"
            />
          </div>
          <Select
            label="Periodo"
            value={periodo}
            onChange={(e) => {
              console.log('📅 Cambiando periodo a:', e.target.value);
              setPeriodo(e.target.value as Periodo);
            }}
            options={[
              { value: 'ultimo-dia', label: 'Último Día' },
              { value: 'ultima-semana', label: 'Última Semana' },
              { value: 'ultimo-mes', label: 'Último Mes' },
              { value: 'ultimo-año', label: 'Último Año' }
            ]}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Error al cargar datos</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={recargarDatos}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      <Tabs defaultActive={0}>
        <TabHeaders>
          <Tab label="Resumen OEE" icon={<TrendingUp className="w-4 h-4" />} />
          <Tab label="Tendencia OEE" icon={<TrendingUp className="w-4 h-4" />} />
          <Tab label="Tendencia Tiempos" icon={<Clock className="w-4 h-4" />} />
          <Tab label="Tendencia Producción" icon={<Package className="w-4 h-4" />} />
        </TabHeaders>

        <TabContent index={0}>
          {!cargando && datosOee ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Eficiencia General de Equipos (OEE)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GaugeChart
                      value={datosOee.oee}
                      max={100}
                      meta={meta}
                      label="OEE"
                      size="large"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resumen de Producción</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* SECCIÓN DE TIEMPOS */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-3">Tiempos (horas)</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-blue-600 font-medium">Tiempo Planeado</p>
                            <p className="text-xl font-bold text-blue-800">
                              {(datosOee.tiempoPlanificado / 60).toFixed(2)}h
                            </p>
                          </div>
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-red-600 font-medium">Tiempo de Paro</p>
                            <p className="text-xl font-bold text-red-800">
                              {(datosOee.tiempoParo / 60).toFixed(2)}h
                            </p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-green-600 font-medium">Tiempo Operativo</p>
                            <p className="text-xl font-bold text-green-800">
                              {(datosOee.tiempoOperativo / 60).toFixed(2)}h
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-600 font-medium">Eficiencia Tiempo</p>
                            <p className="text-xl font-bold text-gray-800">
                              {datosOee.tiempoPlanificado > 0 
                                ? ((datosOee.tiempoOperativo / datosOee.tiempoPlanificado) * 100).toFixed(2)
                                : '0.00'
                              }%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* SECCIÓN DE UNIDADES */}
                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium text-gray-600 mb-3">Unidades</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Unidades Planeadas:</span>
                            <span className="font-semibold text-blue-600">{datosOee.unidadesPlaneadas}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Unidades Producidas:</span>
                            <span className="font-semibold text-gray-800">{datosOee.unidadesProducidas}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Unidades Defectuosas:</span>
                            <span className="font-semibold text-red-600">{datosOee.unidadesDefectuosas}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Unidades Aprobadas:</span>
                            <span className="font-semibold text-green-600">{datosOee.unidadesAprobadas}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-gray-600">Eficiencia Producción:</span>
                            <span className="font-semibold text-purple-600">
                              {datosOee.unidadesPlaneadas > 0
                                ? ((datosOee.unidadesProducidas / datosOee.unidadesPlaneadas) * 100).toFixed(2)
                                : '0.00'
                              }%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Disponibilidad</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GaugeChart
                      value={datosOee.disponibilidad}
                      max={100}
                      meta={meta}
                      label="Disponibilidad"
                      size="small"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Rendimiento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GaugeChart
                      value={datosOee.rendimiento}
                      max={100}
                      meta={meta}
                      label="Rendimiento"
                      size="small"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Calidad</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GaugeChart
                      value={datosOee.calidad}
                      max={100}
                      meta={meta}
                      label="Calidad"
                      size="small"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">
                {cargando ? 'Cargando datos...' : `No hay datos disponibles para el ${periodo.replace('-', ' ')}`}
              </p>
            </div>
          )}
        </TabContent>

        <TabContent index={1}>
          {tendenciaOee.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Indicadores OEE - {periodo.replace('-', ' ')}</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={tendenciaOee}
                  lines={[
                    { key: 'oee', label: 'OEE', color: '#3B82F6' },
                    { key: 'disponibilidad', label: 'Disponibilidad', color: '#10B981' },
                    { key: 'rendimiento', label: 'Rendimiento', color: '#8B5CF6' },
                    { key: 'calidad', label: 'Calidad', color: '#F59E0B' }
                  ]}
                  meta={meta}
                  yAxisLabel="Porcentaje (%)"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">
                {cargando ? 'Cargando datos...' : `No hay datos disponibles para el ${periodo.replace('-', ' ')}`}
              </p>
            </div>
          )}
        </TabContent>

        <TabContent index={2}>
          {tendenciaTiempos.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Tiempos - {periodo.replace('-', ' ')}</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={tendenciaTiempos}
                  lines={[
                    { key: 'tiempoPlanificado', label: 'Tiempo Planificado', color: '#3B82F6' },
                    { key: 'tiempoOperativo', label: 'Tiempo Operativo', color: '#10B981' },
                    { key: 'tiempoParo', label: 'Tiempo Paro', color: '#EF4444' }
                  ]}
                  yAxisLabel="Minutos"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">
                {cargando ? 'Cargando datos...' : `No hay datos disponibles para el ${periodo.replace('-', ' ')}`}
              </p>
            </div>
          )}
        </TabContent>

        <TabContent index={3}>
          {tendenciaProduccion.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Producción - {periodo.replace('-', ' ')}</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={tendenciaProduccion}
                  lines={[
                    { key: 'unidadesProducidas', label: 'Unidades Producidas', color: '#3B82F6' },
                    { key: 'unidadesDefectuosas', label: 'Unidades Defectuosas', color: '#EF4444' },
                    { key: 'unidadesAprobadas', label: 'Unidades Aprobadas', color: '#10B981' }
                  ]}
                  yAxisLabel="Unidades"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">
                {cargando ? 'Cargando datos...' : `No hay datos disponibles para el ${periodo.replace('-', ' ')}`}
              </p>
            </div>
          )}
        </TabContent>
      </Tabs>
    </div>
  );
};