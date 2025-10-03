import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { clienteService } from '../../services/clienteService';
import type { Cliente } from '../../types';
import { Plus, Edit2, Users } from 'lucide-react';

export const ClientesTab: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [cargando, setCargando] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Cliente, 'id' | 'usuarioId'>>();

  const cargarClientes = useCallback(async () => {
    try {
      const data = await clienteService.getAll();
      setClientes(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  }, []);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  const onSubmit = async (data: Omit<Cliente, 'id' | 'usuarioId'>) => {
    setCargando(true);
    try {
      if (editando) {
        await clienteService.update(editando.id!, data);
      } else {
        await clienteService.create(data);
      }
      await cargarClientes();
      reset();
      setEditando(null);
    } catch (error) {
      console.error('Error guardando cliente:', error);
      alert('Error al guardar cliente. Verifica que el email o identificación no estén duplicados.');
    } finally {
      setCargando(false);
    }
  };

  const editarCliente = (cliente: Cliente) => {
    setEditando(cliente);
    reset({
      nombre: cliente.nombre,
      pais: cliente.pais,
      identificacion: cliente.identificacion,
      contacto: cliente.contacto,
      email: cliente.email,
      telefono: cliente.telefono,
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
          {editando ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre de la empresa"
            {...register('nombre', { required: 'El nombre es requerido' })}
            error={errors.nombre?.message}
          />
          
          <Input
            label="Email"
            type="email"
            {...register('email', {
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
              }
            })}
            error={errors.email?.message}
          />

          <Input
            label="País"
            {...register('pais', { required: 'El país es requerido' })}
            error={errors.pais?.message}
          />

          <Input
            label="Identificación/RUC"
            {...register('identificacion', { required: 'La identificación es requerida' })}
            error={errors.identificacion?.message}
          />

          <Input
            label="Persona de contacto"
            {...register('contacto', { required: 'El contacto es requerido' })}
            error={errors.contacto?.message}
          />

          <Input
            label="Teléfono"
            {...register('telefono', { required: 'El teléfono es requerido' })}
            error={errors.telefono?.message}
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
              {editando ? 'Actualizar' : 'Agregar'} Cliente
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Lista de Clientes</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              {clientes.length} cliente{clientes.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                    <div className="text-sm text-gray-500">{cliente.pais}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cliente.contacto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cliente.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cliente.telefono}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => editarCliente(cliente)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {clientes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clientes</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Comienza creando tu primer cliente.
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