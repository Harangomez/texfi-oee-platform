import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { productoService } from '../../services/productoService';
import { clienteService } from '../../services/clienteService';
import { operacionService } from '../../services/operacionService';
import { useAuth } from '../../hooks/useAuth';
import type { Producto, Cliente, Operacion } from '../../types';
import { Plus, Edit2 } from 'lucide-react';

export const ProductosTab: React.FC = () => {
  const { cliente, user, taller } = useAuth(); // 🚨 AGREGAR taller
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [operacionesSeleccionadas, setOperacionesSeleccionadas] = useState<number[]>([]);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Producto, 'id'>>();

  const cargarDatos = useCallback(async () => {
    try {
      // 🚨 CORRECCIÓN: Cargar clientes del taller si es taller
      let clientesData: Cliente[] = [];
      let productosData: Producto[] = [];

      if (user?.rol === 'cliente' && cliente) {
        // Cliente ve solo sus productos
        [productosData, clientesData] = await Promise.all([
          productoService.getAll(),
          clienteService.getAll()
        ]);
        productosData = productosData.filter(producto => producto.clienteId === cliente.id);
      } else if (user?.rol === 'taller' && taller) {
        // 🚨 CORRECCIÓN: Taller ve solo productos de sus clientes
        clientesData = await clienteService.getByTaller(taller?.id || 0);
        
        // Obtener todos los productos y filtrar por clientes del taller
        productosData = await productoService.getAll();
        const clientesIds = clientesData.map(c => c.id!);
        productosData = productosData.filter(producto => 
          clientesIds.includes(producto.clienteId || 0)
        );
      } else {
        // Usuario admin o sin rol específico ve todo
        [productosData, clientesData] = await Promise.all([
          productoService.getAll(),
          clienteService.getAll()
        ]);
      }

      const operacionesData = await operacionService.getAll();
      
      setProductos(productosData);
      setClientes(clientesData);
      setOperaciones(operacionesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  }, [user, cliente, taller]); // 🚨 AGREGAR taller a las dependencias

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const onSubmit = async (data: Omit<Producto, 'id'>) => {
    setCargando(true);
    try {
      // Si el usuario es cliente, asignar automáticamente su clienteId
      let datosProducto;
      
      if (user?.rol === 'cliente' && cliente) {
        datosProducto = {
          ...data,
          clienteId: cliente.id
        };
      } else if (user?.rol === 'taller') {
        // 🚨 CORRECCIÓN: Validar que el cliente seleccionado pertenece al taller
        if (!data.clienteId) {
          alert('Debes seleccionar un cliente para el producto');
          return;
        }
        
        const clienteSeleccionado = clientes.find(c => c.id === Number(data.clienteId));
        if (!clienteSeleccionado) {
          alert('El cliente seleccionado no es válido para este taller');
          return;
        }
        
        datosProducto = {
          ...data,
          clienteId: Number(data.clienteId)
        };
      } else {
        // Para otros roles
        if (!data.clienteId) {
          alert('Debes seleccionar un cliente para el producto');
          return;
        }
        datosProducto = {
          ...data,
          clienteId: Number(data.clienteId)
        };
      }

      // Convertir tiempoEstandar a número si existe
      if (data.tiempoEstandar) {
        datosProducto.tiempoEstandar = Number(data.tiempoEstandar);
      }

      console.log('Enviando datos del producto:', datosProducto);

      let productoId: number;

      if (editando) {
        await productoService.update(editando.id!, datosProducto);
        productoId = editando.id!;
      } else {
        const producto = await productoService.create(datosProducto);
        productoId = producto.id!;
      }

      // Agregar operaciones al producto
      if (operacionesSeleccionadas.length > 0) {
        for (const operacionId of operacionesSeleccionadas) {
          await productoService.addOperacion(productoId, operacionId);
        }
      }
      
      await cargarDatos();
      reset();
      setEditando(null);
      setOperacionesSeleccionadas([]);
      alert('Producto guardado exitosamente');
    } catch (error: unknown) {
      console.error('Error completo guardando producto:', error);
      
      if (error instanceof Error && 'response' in error) {
        interface AxiosErrorType {
          response?: {
            data?: {
              error?: { message: string };
              message?: string;
              details?: { messages: Record<string, string[]> };
            };
          };
        }
        const axiosError = error as AxiosErrorType;    
        
        console.error('Response data:', axiosError.response?.data);
        
        const errorData = axiosError.response?.data;
        let errorMessage = 'Error al guardar el producto';
        
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.details?.messages) {
          errorMessage = Object.values(errorData.details.messages).flat().join(', ');
        }
        
        alert(`Error: ${errorMessage}`);
      } else {
        alert('Error desconocido al guardar el producto');
      }
    } finally {
      setCargando(false);
    }
  };

  const toggleOperacion = (operacionId: number) => {
    setOperacionesSeleccionadas(prev => 
      prev.includes(operacionId)
        ? prev.filter(id => id !== operacionId)
        : [...prev, operacionId]
    );
  };

  const editarProducto = (producto: Producto) => {
    // 🚨 CORRECCIÓN: Validar que el taller puede editar este producto
    if (user?.rol === 'taller') {
      const puedeEditar = clientes.some(cliente => cliente.id === producto.clienteId);
      if (!puedeEditar) {
        alert('No tienes permisos para editar este producto');
        return;
      }
    }
    
    setEditando(producto);
    reset({
      referencia: producto.referencia,
      descripcion: producto.descripcion,
      tiempoEstandar: producto.tiempoEstandar,
      clienteId: producto.clienteId,
    });
    // Cargar operaciones del producto
    if (producto.operaciones) {
      setOperacionesSeleccionadas(producto.operaciones.map(op => op.id!));
    }
  };

  const cancelarEdicion = () => {
    setEditando(null);
    reset();
    setOperacionesSeleccionadas([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editando ? 'Editar Producto' : 'Nuevo Producto'}
        </h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Referencia"
              {...register('referencia', { required: 'La referencia es requerida' })}
              error={errors.referencia?.message}
            />
            
            {/* 🚨 CORRECCIÓN: Mostrar solo clientes del taller */}
            {user?.rol !== 'cliente' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <select
                  {...register('clienteId', { required: 'El cliente es requerido' })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
                {errors.clienteId && (
                  <p className="text-sm text-red-600 mt-1">{errors.clienteId.message}</p>
                )}
                {user?.rol === 'taller' && clientes.length === 0 && (
                  <p className="text-sm text-yellow-600 mt-1">
                    No tienes clientes asignados. Agrega clientes primero.
                  </p>
                )}
              </div>
            )}
          </div>

          <Input
            label="Descripción"
            {...register('descripcion')}
            error={errors.descripcion?.message}
          />

          <Input
            label="Tiempo estándar (minutos)"
            type="number"
            {...register('tiempoEstandar')}
            error={errors.tiempoEstandar?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operaciones del producto
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {operaciones.map(operacion => (
                <button
                  key={operacion.id}
                  type="button"
                  onClick={() => toggleOperacion(operacion.id!)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    operacionesSeleccionadas.includes(operacion.id!)
                      ? 'bg-primary-100 text-primary-800 border border-primary-300'
                      : 'bg-gray-100 text-gray-800 border border-gray-300'
                  }`}
                >
                  {operacion.nombre}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {operacionesSeleccionadas.length} operación{operacionesSeleccionadas.length !== 1 ? 'es' : ''} seleccionada{operacionesSeleccionadas.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            {editando && (
              <Button
                type="button"
                variant="outline"
                onClick={cancelarEdicion}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              isLoading={cargando}
            >
              {editando ? <Edit2 className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {editando ? 'Actualizar' : 'Agregar'} Producto
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Lista de Productos {user?.rol === 'taller' && '(de mis clientes)'}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiempo Estándar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productos.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {producto.referencia}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {producto.descripcion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {producto.cliente?.nombre || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {producto.tiempoEstandar ? `${producto.tiempoEstandar} min` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => editarProducto(producto)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {productos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    {user?.rol === 'taller' 
                      ? 'No hay productos de tus clientes' 
                      : 'No hay productos registrados'
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};