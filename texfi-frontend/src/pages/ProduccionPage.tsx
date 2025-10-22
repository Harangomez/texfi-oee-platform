import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { produccionService } from '../services/produccionService';
import { maquinaService } from '../services/maquinaService';
import { operarioService } from '../services/operarioService';
import { productoService } from '../services/productoService';
import { useAuth } from '../hooks/useAuth';
import type { Produccion, Maquina, Operario, Producto, DetalleProduccion } from '../types';
import { Plus, Trash2, Calendar, Clock, Package } from 'lucide-react';

interface ProduccionFormData {
  fecha: string;
  tiempoPlanificado: number;
  tiempoParo: number;
  motivoParo?: string;
  programado: boolean;
  maquinaIds: string[];
  operarioIds: string[];
  detalles: Omit<DetalleProduccion, 'id' | 'produccionId'>[];
}

export const ProduccionPage: React.FC = () => {
  const { taller } = useAuth();
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [operarios, setOperarios] = useState<Operario[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [horasPlanificadas, setHorasPlanificadas] = useState<number>(8);
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ProduccionFormData>({
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
      tiempoPlanificado: 480,
      programado: true,
      maquinaIds: [],
      operarioIds: [],
      detalles: [{
        cantidadProducida: 0,
        unidadesDefectuosas: 0,
        productoId: undefined
      }]
    }
  });

  const detalles = watch('detalles');
  const maquinaIds = watch('maquinaIds');
  const operarioIds = watch('operarioIds');
  const tiempoPlanificado = watch('tiempoPlanificado');
  const fechaFormulario = watch('fecha');

  useEffect(() => {
    setHorasPlanificadas(tiempoPlanificado / 60);
  }, [tiempoPlanificado]);

  // Log cuando cambia la fecha en el formulario
  useEffect(() => {
    console.log('📅 Fecha en formulario cambiada:', fechaFormulario);
  }, [fechaFormulario]);

  const actualizarDesdeHoras = (horas: number) => {
    const minutos = Math.round(horas * 60);
    setValue('tiempoPlanificado', minutos);
    setHorasPlanificadas(horas);
  };

  const cargarDatos = useCallback(async () => {
    if (!taller) return;

    try {
      const [maquinasData, operariosData, productosData] = await Promise.all([
        maquinaService.getAll(),
        operarioService.getAll(),
        productoService.getByTaller(taller.id!)
      ]);

      setMaquinas(maquinasData.filter(m => m.tallerId === taller.id && m.activo));
      setOperarios(operariosData.filter(o => o.tallerId === taller.id && o.activo));
      setProductos(productosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  }, [taller]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]); // ✅ CORREGIDO: cargarDatos en lugar de cargandoDatos

  const resetearFormulario = useCallback(() => {
    console.log('🔄 Reseteando formulario a fecha actual');
    reset({
      fecha: new Date().toISOString().split('T')[0],
      tiempoPlanificado: 480,
      tiempoParo: 0,
      motivoParo: '',
      programado: true,
      maquinaIds: [],
      operarioIds: [],
      detalles: [{
        cantidadProducida: 0,
        unidadesDefectuosas: 0,
        productoId: undefined
      }]
    });
    setHorasPlanificadas(8);
  }, [reset]);

  const agregarDetalle = () => {
    const nuevosDetalles = [...detalles, {
      cantidadProducida: 0,
      unidadesDefectuosas: 0,
      productoId: undefined
    }];
    reset({ ...watch(), detalles: nuevosDetalles });
  };

  const eliminarDetalle = (index: number) => {
    if (detalles.length > 1) {
      const nuevosDetalles = detalles.filter((_, i) => i !== index);
      reset({ ...watch(), detalles: nuevosDetalles });
    }
  };

  const actualizarDetalle = (index: number, campo: keyof Omit<DetalleProduccion, 'id' | 'produccionId'>, valor: number | undefined) => {
    const nuevosDetalles = detalles.map((detalle, i) => 
      i === index ? { ...detalle, [campo]: valor } : detalle
    );
    reset({ ...watch(), detalles: nuevosDetalles });
  };

  const calcularUnidadesAprobadas = (detalle: Omit<DetalleProduccion, 'id' | 'produccionId'>) => {
    return (detalle.cantidadProducida || 0) - (detalle.unidadesDefectuosas || 0);
  };

  const onSubmit = async (data: ProduccionFormData) => {
    if (!taller) {
      alert('No se puede registrar producción sin taller asociado');
      return;
    }

    setCargando(true);
    try {
      console.log('🔴🔴🔴 INICIO ENVÍO DE PRODUCCIÓN 🔴🔴🔴');
      console.log('1. 📋 DATOS DEL FORMULARIO:', {
        fechaSeleccionada: data.fecha,
        tiempoPlanificado: data.tiempoPlanificado,
        tiempoParo: data.tiempoParo,
        motivoParo: data.motivoParo,
        programado: data.programado,
        maquinas: data.maquinaIds,
        operarios: data.operarioIds,
        detalles: data.detalles
      });

      // Crear fecha CORREGIDA - Evitar problemas de timezone
      const fechaSeleccionada = new Date(data.fecha); // Mediodía para evitar cambios de timezone
      
      console.log('2. 📅 CONVERSIÓN DE FECHA:', {
        fechaString: data.fecha,
        fechaObjeto: fechaSeleccionada,
        fechaISO: fechaSeleccionada.toISOString(),
        fechaLocal: fechaSeleccionada.toLocaleDateString('es-ES'),
        timestamp: fechaSeleccionada.getTime()
      });

      const produccionData: Omit<Produccion, 'id'> = {
        fecha: fechaSeleccionada, // ← USA la fecha del formulario CORREGIDA
        tiempoPlanificado: Number(data.tiempoPlanificado),
        tiempoParo: Number(data.tiempoParo),
        motivoParo: data.motivoParo,
        programado: data.programado,
        tallerId: taller.id
      };

      console.log('3. 📦 DATOS A ENVIAR AL BACKEND:', produccionData);
      console.log('4. 🚀 LLAMANDO A produccionService.create...');

      const produccion = await produccionService.create(produccionData);
      
      console.log('5. ✅ RESPUESTA DEL BACKEND:', {
        id: produccion.id,
        fechaEnRespuesta: produccion.fecha,
        tipoFechaRespuesta: typeof produccion.fecha
      });

      // Asociar máquinas
      if (data.maquinaIds && data.maquinaIds.length > 0) {
        console.log('6. 🔧 ASOCIANDO MÁQUINAS:', data.maquinaIds);
        for (const maquinaId of data.maquinaIds) {
          const maquinaIdNumber = Number(maquinaId);
          await produccionService.agregarMaquina(produccion.id!, maquinaIdNumber);
        }
      }

      // Asociar operarios
      if (data.operarioIds && data.operarioIds.length > 0) {
        console.log('7. 👥 ASOCIANDO OPERARIOS:', data.operarioIds);
        for (const operarioId of data.operarioIds) {
          const operarioIdNumber = Number(operarioId);
          await produccionService.agregarOperario(produccion.id!, operarioIdNumber);
        }
      }

      // Agregar detalles de producción
      console.log('8. 📊 AGREGANDO DETALLES DE PRODUCCIÓN:');
      for (const detalle of data.detalles) {
        if (detalle.productoId && detalle.cantidadProducida > 0) {
          console.log('   - Detalle:', detalle);
          await produccionService.addDetalle(produccion.id!, {
            cantidadProducida: Number(detalle.cantidadProducida),
            unidadesDefectuosas: Number(detalle.unidadesDefectuosas),
            productoId: Number(detalle.productoId)
          });
        }
      }

      console.log('9. 🎯 PRODUCCIÓN REGISTRADA EXITOSAMENTE');
      alert('Producción registrada exitosamente!');
      resetearFormulario();
      
    } catch (error) {
      console.error('❌ ERROR registrando producción:', error);
      alert('Error al registrar la producción. Verifica los datos.');
    } finally {
      setCargando(false);
    }
  };

  if (!taller) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Solo los talleres pueden registrar producción.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Registro de Producción</h1>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {/* Esto solo es display, no afecta los datos */}
          {new Date().toLocaleDateString('es-ES')} {/*(Fecha actual - solo visual)*/}
        </div>
      </div>

      {/*<div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Fecha seleccionada en formulario:</strong> {fechaFormulario}
        </p>
        <p className="text-sm text-blue-600 mt-1">
          Abre la consola del navegador (F12) para ver los logs detallados del proceso
        </p>
      </div>*/}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información General */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Información General
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Fecha"
              type="date"
              {...register('fecha', { required: 'La fecha es requerida' })}
              error={errors.fecha?.message}
            />

            {/* Tiempo Planificado con conversión a horas - CORREGIDO */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tiempo Planificado (min)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  {...register('tiempoPlanificado', { 
                    required: 'El tiempo planificado es requerido',
                    min: { value: 1, message: 'Mínimo 1 minuto' }
                  })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
              {errors.tiempoPlanificado?.message && (
                <p className="text-sm text-red-600">{errors.tiempoPlanificado.message}</p>
              )}
              
              {/* Equivalente en horas - SIN STEP RESTRICTIVO */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Equivalente:
                </span>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    value={horasPlanificadas}
                    onChange={(e) => actualizarDesdeHoras(Number(e.target.value))}
                    step="any" // Permite cualquier valor, incluyendo enteros
                    min="0.1"
                    className="block w-20 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    horas
                  </span>
                </div>
              </div>
            </div>

            <Input
              label="Tiempo de Paro (min)"
              type="number"
              {...register('tiempoParo', { 
                required: 'El tiempo de paro es requerido',
                min: { value: 0, message: 'Mínimo 0 minutos' }
              })}
              error={errors.tiempoParo?.message}
            />

            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('programado')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Paro programado</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <Input
              label="Motivo del Paro (opcional)"
              {...register('motivoParo')}
              error={errors.motivoParo?.message}
              placeholder="Ej: Mantenimiento, Falta de material, Avería..."
            />
          </div>
        </div>

        {/* Recursos Asociados al Paro */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recursos Asociados al Paro</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Máquinas Paradas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máquinas Paradas
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {maquinas.map(maquina => (
                  <label key={maquina.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={maquina.id}
                      {...register('maquinaIds')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{maquina.nombre} ({maquina.tipo})</span>
                  </label>
                ))}
                {maquinas.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No hay máquinas activas registradas
                  </p>
                )}
              </div>
              {maquinaIds?.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {maquinaIds.length} máquina(s) seleccionada(s)
                </p>
              )}
            </div>

            {/* Operarios Afectados */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operarios Afectados
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {operarios.map(operario => (
                  <label key={operario.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={operario.id}
                      {...register('operarioIds')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{operario.nombre}</span>
                  </label>
                ))}
                {operarios.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No hay operarios activos registrados
                  </p>
                )}
              </div>
              {operarioIds?.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {operarioIds.length} operario(s) seleccionado(s)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detalles de Producción */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Detalles de Producción
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={agregarDetalle}
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar Producto
            </Button>
          </div>

          <div className="space-y-4">
            {detalles.map((detalle, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Producto #{index + 1}</h3>
                  {detalles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarDetalle(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Producto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Producto
                    </label>
                    <select
                      value={detalle.productoId || ''}
                      onChange={(e) => actualizarDetalle(index, 'productoId', e.target.value ? Number(e.target.value) : undefined)}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="">Seleccionar producto</option>
                      {productos.map(producto => (
                        <option key={producto.id} value={producto.id}>
                          {producto.referencia} - {producto.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cantidad Producida */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad Producida
                    </label>
                    <input
                      type="number"
                      value={detalle.cantidadProducida || 0}
                      onChange={(e) => actualizarDetalle(index, 'cantidadProducida', Number(e.target.value))}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      min="0"
                    />
                  </div>

                  {/* Unidades Defectuosas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unidades Defectuosas
                    </label>
                    <input
                      type="number"
                      value={detalle.unidadesDefectuosas || 0}
                      onChange={(e) => actualizarDetalle(index, 'unidadesDefectuosas', Number(e.target.value))}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      min="0"
                      max={detalle.cantidadProducida || 0}
                    />
                  </div>

                  {/* Unidades Aprobadas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unidades Aprobadas
                    </label>
                    <input
                      type="number"
                      value={calcularUnidadesAprobadas(detalle)}
                      readOnly
                      className="block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de Envío */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={resetearFormulario}
            disabled={cargando}
          >
            Limpiar Formulario
          </Button>
          <Button
            type="submit"
            size="lg"
            isLoading={cargando}
            disabled={!detalles.some(d => d.productoId && d.cantidadProducida > 0)}
          >
            Registrar Producción
          </Button>
        </div>
      </form>
    </div>
  );
};