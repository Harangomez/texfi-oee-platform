import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { maquinaService } from '../../services/maquinaService';
import { useAuth } from '../../hooks/useAuth';
import type { Maquina } from '../../types';
import { Plus, Edit2, Archive } from 'lucide-react';

export const MaquinasTab: React.FC = () => {
  const { taller } = useAuth();
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [editando, setEditando] = useState<Maquina | null>(null);
  const [cargando, setCargando] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Maquina, 'id'>>();

    const cargarMaquinas = useCallback(async () => {
    if (!taller) return;
    
    try {
      const data = await maquinaService.getAll();
      // Filtrar máquinas del taller actual
      const maquinasDelTaller = data.filter(maquina => maquina.tallerId === taller.id);
      setMaquinas(maquinasDelTaller);
    } catch (error) {
      console.error('Error cargando máquinas:', error);
    }
  }, [taller]);

  useEffect(() => {
    cargarMaquinas();
  }, [cargarMaquinas]);

  const onSubmit = async (data: Omit<Maquina, 'id'>) => {
    if (!taller) {
      alert('No se puede crear máquina sin taller asociado');
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
        await maquinaService.update(editando.id!, datosConTaller);
      } else {
        await maquinaService.create(datosConTaller);
      }
      await cargarMaquinas();
      reset();
      setEditando(null);
    } catch (error) {
      console.error('Error guardando máquina:', error);
    } finally {
      setCargando(false);
    }
  };

  // ... resto del código permanece igual

  const archivarMaquina = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres archivar esta máquina?')) {
      try {
        await maquinaService.archive(id);
        await cargarMaquinas();
      } catch (error) {
        console.error('Error archivando máquina:', error);
      }
    }
  };

  const editarMaquina = (maquina: Maquina) => {
    setEditando(maquina);
    reset({
      nombre: maquina.nombre,
      tipo: maquina.tipo,
      activo: maquina.activo,
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
          {editando ? 'Editar Máquina' : 'Nueva Máquina'}
        </h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre de la máquina"
            {...register('nombre', { required: 'El nombre es requerido' })}
            error={errors.nombre?.message}
          />
          
          <Input
            label="Tipo de máquina"
            {...register('tipo', { required: 'El tipo es requerido' })}
            error={errors.tipo?.message}
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
              {editando ? 'Actualizar' : 'Agregar'} Máquina
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Máquinas</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
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
              {maquinas.map((maquina) => (
                <tr key={maquina.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {maquina.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {maquina.tipo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      maquina.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {maquina.activo ? 'Activa' : 'Archivada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => editarMaquina(maquina)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {maquina.activo && (
                      <button
                        onClick={() => archivarMaquina(maquina.id!)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {maquinas.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay máquinas registradas
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