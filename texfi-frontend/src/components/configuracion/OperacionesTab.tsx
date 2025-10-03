import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { operacionService } from '../../services/operacionService';
import type { Operacion } from '../../types';
import { Plus, Edit2, Settings } from 'lucide-react';

export const OperacionesTab: React.FC = () => {
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [editando, setEditando] = useState<Operacion | null>(null);
  const [cargando, setCargando] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Operacion, 'id'>>();

  const cargarOperaciones = useCallback(async () => {
    try {
      const data = await operacionService.getAll();
      setOperaciones(data);
    } catch (error) {
      console.error('Error cargando operaciones:', error);
    }
  }, []);

  useEffect(() => {
    cargarOperaciones();
  }, [cargarOperaciones]);

  const onSubmit = async (data: Omit<Operacion, 'id'>) => {
    setCargando(true);
    try {
      if (editando) {
        await operacionService.update(editando.id!, data);
      } else {
        await operacionService.create(data);
      }
      await cargarOperaciones();
      reset();
      setEditando(null);
    } catch (error) {
      console.error('Error guardando operación:', error);
    } finally {
      setCargando(false);
    }
  };

  const editarOperacion = (operacion: Operacion) => {
    setEditando(operacion);
    reset({
      nombre: operacion.nombre,
    });
  };

  const cancelarEdicion = () => {
    setEditando(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editando ? 'Editar Operación' : 'Nueva Operación'}
        </h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
          <Input
            label="Nombre de la operación"
            placeholder="Ej: Corte, Costura, Planchado, Empaque..."
            {...register('nombre', { required: 'El nombre es requerido' })}
            error={errors.nombre?.message}
          />

          <div className="flex justify-end space-x-3 mt-4">
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
              {editando ? 'Actualizar' : 'Agregar'} Operación
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Lista de Operaciones</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Settings className="w-4 h-4 mr-1" />
              {operaciones.length} operación{operaciones.length !== 1 ? 'es' : ''}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {operaciones.map((operacion) => (
                <tr key={operacion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {operacion.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => editarOperacion(operacion)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {operaciones.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center">
                    <Settings className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay operaciones</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Comienza creando tu primera operación.
                    </p>
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