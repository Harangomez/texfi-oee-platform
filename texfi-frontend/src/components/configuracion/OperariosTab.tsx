import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { operarioService } from '../../services/operarioService';
import { useAuth } from '../../hooks/useAuth';
import type { Operario } from '../../types';
import { Plus, Edit2, Archive } from 'lucide-react';

export const OperariosTab: React.FC = () => {
  const { taller } = useAuth();
  const [operarios, setOperarios] = useState<Operario[]>([]);
  const [editando, setEditando] = useState<Operario | null>(null);
  const [cargando, setCargando] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Operario, 'id'>>();

  const cargarOperarios = useCallback(async () => {
    if (!taller) return;
    
    try {
      const data = await operarioService.getAll();
      // Filtrar operarios del taller actual
      const operariosDelTaller = data.filter(operario => operario.tallerId === taller.id);
      setOperarios(operariosDelTaller);
    } catch (error) {
      console.error('Error cargando operarios:', error);
    }
  }, [taller]); // Dependencias de useCallback

  useEffect(() => {
    cargarOperarios();
  }, [cargarOperarios]); // Ahora cargarOperarios es una dependencia estable

  const onSubmit = async (data: Omit<Operario, 'id'>) => {
    if (!taller) {
      alert('No se puede crear operario sin taller asociado');
      return;
    }

    setCargando(true);
    try {
      const datosConTaller = {
        ...data,
        tallerId: taller.id,
        activo: true
      };

      if (editando) {
        await operarioService.update(editando.id!, datosConTaller);
      } else {
        await operarioService.create(datosConTaller);
      }
      await cargarOperarios();
      reset();
      setEditando(null);
    } catch (error) {
      console.error('Error guardando operario:', error);
    } finally {
      setCargando(false);
    }
  };

  // ... resto del código permanece igual

  const archivarOperario = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres archivar este operario?')) {
      try {
        await operarioService.archive(id);
        await cargarOperarios();
      } catch (error) {
        console.error('Error archivando operario:', error);
      }
    }
  };

  const editarOperario = (operario: Operario) => {
    setEditando(operario);
    reset({
      nombre: operario.nombre,
      identificacion: operario.identificacion,
      activo: operario.activo,
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
          {editando ? 'Editar Operario' : 'Nuevo Operario'}
        </h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre completo"
            {...register('nombre', { required: 'El nombre es requerido' })}
            error={errors.nombre?.message}
          />
          
          <Input
            label="Identificación"
            {...register('identificacion', { required: 'La identificación es requerida' })}
            error={errors.identificacion?.message}
          />

          <div className="md:col-span-2 flex justify-end space-x-3">
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
              {editando ? 'Actualizar' : 'Agregar'} Operario
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Operarios</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Identificación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {operarios.map((operario) => (
                <tr key={operario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {operario.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operario.identificacion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      operario.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {operario.activo ? 'Activo' : 'Archivado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => editarOperario(operario)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {operario.activo && (
                      <button
                        onClick={() => archivarOperario(operario.id!)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {operarios.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay operarios registrados
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