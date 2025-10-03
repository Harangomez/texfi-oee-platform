import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { RegisterData } from '../types';

type FormStep = 'rol' | 'usuario' | 'taller' | 'cliente';

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<FormStep>('rol');
  const [selectedRol, setSelectedRol] = useState<'taller' | 'cliente' | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterData>();

  const onSubmit = async (data: RegisterData) => {
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en registro:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
      alert('Error en el registro. Por favor intenta nuevamente.');
    }
  };

  const handleRolSelection = (rol: 'taller' | 'cliente') => {
    setSelectedRol(rol);
    setStep('usuario');
  };

  const renderRolStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Selecciona tu rol</h3>
      <div className="grid grid-cols-1 gap-4">
        <button
          type="button"
          onClick={() => handleRolSelection('taller')}
          className="p-6 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
        >
          <h4 className="font-semibold text-gray-900">Taller de Confección</h4>
          <p className="text-sm text-gray-600 mt-2">
            Eres un taller que produce prendas para clientes
          </p>
        </button>
        
        <button
          type="button"
          onClick={() => handleRolSelection('cliente')}
          className="p-6 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
        >
          <h4 className="font-semibold text-gray-900">Cliente/Marca</h4>
          <p className="text-sm text-gray-600 mt-2">
            Eres una marca que contrata talleres para producción
          </p>
        </button>
      </div>
    </div>
  );

  const renderUsuarioStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Información de Usuario</h3>
      
      <Input
        label="Nombre completo"
        {...register('usuario.nombre', { required: 'El nombre es requerido' })}
        error={errors.usuario?.nombre?.message}
      />

      <Input
        label="Contraseña"
        type="password"
        {...register('usuario.password', {
          required: 'La contraseña es requerida',
          minLength: {
            value: 6,
            message: 'La contraseña debe tener al menos 6 caracteres'
          }
        })}
        error={errors.usuario?.password?.message}
      />

      <input type="hidden" {...register('usuario.rol')} value={selectedRol || ''} />
      <input type="hidden" {...register('usuario.plan')} value="gratuito" />

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep('rol')}
        >
          Atrás
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (selectedRol === 'taller') {
              setStep('taller');
            } else if (selectedRol === 'cliente') {
              setStep('cliente');
            }
          }}
        >
          Continuar
        </Button>
      </div>
    </div>
  );

  const renderTallerStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Información del Taller</h3>
      
      <Input
        label="Nombre del taller"
        {...register('taller.nombre', { required: 'El nombre del taller es requerido' })}
        error={errors.taller?.nombre?.message}
      />

      <Input
        label="Email del taller"
        type="email"
        {...register('taller.email', {
          required: 'El email del taller es requerido',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido'
          }
        })}
        error={errors.taller?.email?.message}
      />

      <Input
        label="País"
        {...register('taller.pais', { required: 'El país es requerido' })}
        error={errors.taller?.pais?.message}
      />

      <Input
        label="Identificación/RUC"
        {...register('taller.identificacion', { required: 'La identificación es requerida' })}
        error={errors.taller?.identificacion?.message}
      />

      <Input
        label="Teléfono"
        {...register('taller.telefono', { required: 'El teléfono es requerido' })}
        error={errors.taller?.telefono?.message}
      />

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep('usuario')}
        >
          Atrás
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          Crear Cuenta
        </Button>
      </div>
    </div>
  );

  const renderClienteStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Información del Cliente</h3>
      
      <Input
        label="Nombre de la empresa"
        {...register('cliente.nombre', { required: 'El nombre de la empresa es requerido' })}
        error={errors.cliente?.nombre?.message}
      />

      <Input
        label="Email de la empresa"
        type="email"
        {...register('cliente.email', {
          required: 'El email de la empresa es requerido',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido'
          }
        })}
        error={errors.cliente?.email?.message}
      />

      <Input
        label="País"
        {...register('cliente.pais', { required: 'El país es requerido' })}
        error={errors.cliente?.pais?.message}
      />

      <Input
        label="Identificación/RUC"
        {...register('cliente.identificacion', { required: 'La identificación es requerida' })}
        error={errors.cliente?.identificacion?.message}
      />

      <Input
        label="Persona de contacto"
        {...register('cliente.contacto', { required: 'El contacto es requerido' })}
        error={errors.cliente?.contacto?.message}
      />

      <Input
        label="Teléfono"
        {...register('cliente.telefono', { required: 'El teléfono es requerido' })}
        error={errors.cliente?.telefono?.message}
      />

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep('usuario')}
        >
          Atrás
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          Crear Cuenta
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 'rol':
        return renderRolStep();
      case 'usuario':
        return renderUsuarioStep();
      case 'taller':
        return renderTallerStep();
      case 'cliente':
        return renderClienteStep();
      default:
        return renderRolStep();
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'rol': return 'Selecciona tu Rol';
      case 'usuario': return 'Información de Usuario';
      case 'taller': return 'Información del Taller';
      case 'cliente': return 'Información del Cliente';
      default: return 'Crear Cuenta';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <div className="h-12 w-12 bg-primary-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {getStepTitle()}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          O{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            iniciar sesión en tu cuenta existente
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderCurrentStep()}
          </form>
        </div>
      </div>
    </div>
  );
};