import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Mail, Send, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface FeedbackForm {
  satisfaccion: number;
  facilidadUso: number;
  utilidad: number;
  detallesCalificacion: string;
  comentarios: string;
  sugerencias: string;
}

export const InformesPage: React.FC = () => {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const { user, taller, cliente } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FeedbackForm>();

  // ✅ Obtener email según el tipo de usuario
  const obtenerEmailUsuario = () => {
    if (user?.rol === 'taller' && taller) {
      return taller.email;
    } else if (user?.rol === 'cliente' && cliente) {
      return cliente.email;
    }
    return 'No disponible';
  };

  // ✅ Obtener nombre según el tipo de usuario
  const obtenerNombreUsuario = () => {
    if (user?.rol === 'taller' && taller) {
      return taller.nombre;
    } else if (user?.rol === 'cliente' && cliente) {
      return cliente.nombre;
    }
    return user?.nombre || 'Usuario no identificado';
  };

  const onSubmit = async (data: FeedbackForm) => {
    setEnviando(true);
    
    try {
      const formData = new FormData();
      
      // ✅ Datos automáticos del usuario desde las relaciones
      formData.append('nombre', obtenerNombreUsuario());
      formData.append('email', obtenerEmailUsuario());
      formData.append('rol', user?.rol || 'No disponible');
      
      // ✅ Datos del formulario
      formData.append('satisfaccion', data.satisfaccion.toString());
      formData.append('facilidadUso', data.facilidadUso.toString());
      formData.append('utilidad', data.utilidad.toString());
      formData.append('detallesCalificacion', data.detallesCalificacion);
      formData.append('comentarios', data.comentarios);
      formData.append('sugerencias', data.sugerencias);
      
      // ✅ Configuración FormSubmit
      formData.append('_subject', `Nuevo Feedback - ${obtenerNombreUsuario()}`);
      formData.append('_template', 'table');

      // ✅ Tu email actualizado
      const response = await fetch('https://formsubmit.co/ajax/harangomez@gmail.com', {
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
            Hola {obtenerNombreUsuario()}, tu opinión nos ayuda a mejorar nuestra plataforma
          </p>
          <div className="mt-2 text-sm text-gray-500">
            <p>Usuario: {obtenerEmailUsuario()} • Rol: {user?.rol}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                Añade detalles de tu calificación
              </label>
              <textarea
                {...register('detallesCalificacion')}
                rows={3}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="¿Qué aspectos específicos te llevaron a dar esta calificación?"
              />
            </div>

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
          <p>Los datos de usuario se envían automáticamente desde tu sesión.</p>
        </div>
      </div>
    </div>
  );
};