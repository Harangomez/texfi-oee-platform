import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Send, Star } from 'lucide-react';

interface FeedbackForm {
  nombre: string;
  email: string;
  satisfaccion: number;
  facilidadUso: number;
  utilidad: number;
  comentarios: string;
  sugerencias: string;
}

export const InformesPage: React.FC = () => {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FeedbackForm>();

  const onSubmit = async (data: FeedbackForm) => {
    setEnviando(true);
    
    try {
      const formData = new FormData();
      
      // Agregar todos los campos del formulario
      formData.append('nombre', data.nombre);
      formData.append('email', data.email);
      formData.append('satisfaccion', data.satisfaccion.toString());
      formData.append('facilidadUso', data.facilidadUso.toString());
      formData.append('utilidad', data.utilidad.toString());
      formData.append('comentarios', data.comentarios);
      formData.append('sugerencias', data.sugerencias);
      formData.append('_subject', `Nuevo Feedback - ${data.nombre}`);
      formData.append('_template', 'table');

      // Enviar a FormSubmit.co
      const response = await fetch('https://formsubmit.co/ajax/TU_EMAIL_REAL@gmail.com', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Error enviando feedback');
      
      setEnviado(true);
    } catch (error) {
      console.error('Error enviando feedback:', error);
      alert('Error al enviar el feedback. Por favor intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  const CalificacionEstrellas: React.FC<{ 
    name: keyof FeedbackForm; 
    label: string; 
    value: number; 
    onChange: (value: number) => void 
  }> = ({ name, label, value, onChange }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1 rounded-full transition-colors ${
              star <= value 
                ? 'text-yellow-400 hover:text-yellow-500' 
                : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
      <input
        type="hidden"
        {...register(name, { required: 'Esta calificación es requerida' })}
      />
      {errors[name] && (
        <p className="text-sm text-red-600">{errors[name]?.message}</p>
      )}
    </div>
  );

  if (enviado) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Gracias por tu feedback!
          </h2>
          <p className="text-gray-600 mb-6">
            Tu opinión es muy valiosa para nosotros. Hemos recibido tu feedback y lo revisaremos pronto.
          </p>
          <Button
            onClick={() => setEnviado(false)}
            className="w-full"
          >
            Enviar otro feedback
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Encuesta de Satisfacción
          </h1>
          <p className="text-gray-600">
            Tu opinión nos ayuda a mejorar nuestra plataforma
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                {...register('nombre', { required: 'El nombre es requerido' })}
                error={errors.nombre?.message}
              />
              
              <Input
                label="Email"
                type="email"
                {...register('email', { 
                  required: 'El email es requerido',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Email inválido'
                  }
                })}
                error={errors.email?.message}
              />
            </div>

            <CalificacionEstrellas
              name="satisfaccion"
              label="Satisfacción general con la plataforma"
              value={watch('satisfaccion') || 0}
              onChange={(value) => setValue('satisfaccion', value)}
            />

            <CalificacionEstrellas
              name="facilidadUso"
              label="Facilidad de uso"
              value={watch('facilidadUso') || 0}
              onChange={(value) => setValue('facilidadUso', value)}
            />

            <CalificacionEstrellas
              name="utilidad"
              label="Utilidad para tu trabajo"
              value={watch('utilidad') || 0}
              onChange={(value) => setValue('utilidad', value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentarios generales
              </label>
              <textarea
                {...register('comentarios')}
                rows={3}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="¿Qué es lo que más te gusta de la plataforma?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sugerencias de mejora
              </label>
              <textarea
                {...register('sugerencias')}
                rows={3}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="¿Qué podemos mejorar?"
              />
            </div>

            <Button
              type="submit"
              isLoading={enviando}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Feedback
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Este formulario es completamente independiente y solo envía feedback a nuestro equipo.</p>
          <p className="mt-1">📧 Reemplaza "TU_EMAIL_REAL@gmail.com" con tu email real</p>
        </div>
      </div>
    </div>
  );
};