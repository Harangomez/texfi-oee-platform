import React, { useState } from 'react';
import { MaquinasTab } from '../components/configuracion/MaquinasTab';
import { OperariosTab } from '../components/configuracion/OperariosTab';
import { ProductosTab } from '../components/configuracion/ProductosTab';
import { ClientesTab } from '../components/configuracion/ClientesTab';
import { OperacionesTab } from '../components/configuracion/OperacionesTab';

type Tab = 'maquinas' | 'operarios' | 'productos' | 'clientes' | 'operaciones';

export const ConfiguracionPage: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<Tab>('maquinas');

  const tabs = [
    { id: 'maquinas' as Tab, name: 'Máquinas' },
    { id: 'operarios' as Tab, name: 'Operarios' },
    { id: 'clientes' as Tab, name: 'Clientes' },
    { id: 'operaciones' as Tab, name: 'Operaciones' },
    { id: 'productos' as Tab, name: 'Productos' },
  ];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'maquinas':
        return <MaquinasTab />;
      case 'operarios':
        return <OperariosTab />;
      case 'clientes':
        return <ClientesTab />;
      case 'operaciones':
        return <OperacionesTab />;
      case 'productos':
        return <ProductosTab />;
      default:
        return <MaquinasTab />;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                tabActiva === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de la tab activa */}
      {renderTabContent()}
    </div>
  );
};