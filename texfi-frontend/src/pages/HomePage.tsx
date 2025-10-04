import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircle, Zap, Shield, BarChart3 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Monitoreo en Tiempo Real',
      description: 'Sigue el desempeño de tus talleres con indicadores actualizados al instante.'
    },
    {
      icon: Zap,
      title: 'Cálculo Automático de OEE',
      description: 'Obtén métricas precisas de disponibilidad, rendimiento y calidad automáticamente.'
    },
    {
      icon: Shield,
      title: 'Datos Seguros',
      description: 'Tu información está protegida con los más altos estándares de seguridad.'
    },
    {
      icon: CheckCircle,
      title: 'Fácil Implementación',
      description: 'Comienza a medir tu OEE en minutos sin complicadas configuraciones.'
    }
  ];

  const plans = [
    {
      name: 'Gratuito',
      //price: '$0',
      description: 'Para pequeños talleres',
      features: ['Hasta 3 máquinas', '1 usuario', 'Dashboard básico', 'Soporte por email']
    },
    {
      name: 'Premium',
      //price: '$49',
      description: 'Para talleres en crecimiento',
      features: ['Hasta 10 máquinas', '3 usuarios', 'Dashboard avanzado', 'Soporte prioritario', 'Informes PDF']
    },
    {
      name: 'Empresa',
      //price: '$99',
      description: 'Para múltiples talleres',
      features: ['Máquinas ilimitadas', 'Usuarios ilimitados', 'Dashboard completo', 'Soporte 24/7', 'API acceso']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Optimiza tu Producción Textil
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Mide y mejora el OEE de tus talleres de confección con nuestra plataforma especializada
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/register">
                <Button size="lg" variant="secondary">
                  Comenzar Gratis
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Texfi?
            </h2>
            <p className="text-xl text-gray-600">
              Herramientas diseñadas específicamente para la industria textil
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 rounded-full p-3 inline-flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planes que se Adaptan a Ti
            </h2>
            <p className="text-xl text-gray-600">
              Elige el plan perfecto para tu taller
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                {/*<div className="text-3xl font-bold text-primary-600 mb-4">{plan.price}<span className="text-sm font-normal text-gray-500">/mes</span></div>*/}
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button variant="primary" className="w-full">
                    Comenzar
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para optimizar tu producción?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Únete a cientos de talleres que ya mejoraron su OEE con Texfi
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Registrarse Gratis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};