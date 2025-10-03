// components/ui/Tabs.tsx - VERSIÓN CORREGIDA
import React, { useState, createContext, useContext } from 'react';

interface TabsContextType {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  children: React.ReactNode;
  defaultActive?: number;
}

export const Tabs: React.FC<TabsProps> = ({ children, defaultActive = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultActive);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="w-full">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabProps {
  label: string;
  icon?: React.ReactNode;
  tabIndex?: number;
  onTabClick?: () => void;
}

export const Tab: React.FC<TabProps> = ({ label, icon, tabIndex = -1, onTabClick }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === tabIndex;

  const handleClick = () => {
    if (tabIndex !== -1) {
      setActiveTab(tabIndex);
    }
    onTabClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
        isActive
          ? 'border-primary-500 text-primary-600 bg-white'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

// Componente para el contenido de las pestañas
export const TabContent: React.FC<{ children: React.ReactNode; index: number }> = ({ 
  children, 
  index 
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabContent must be used within Tabs');

  const { activeTab } = context;
  
  if (activeTab !== index) return null;
  
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-b-lg rounded-tr-lg">
      {children}
    </div>
  );
};

// Componente contenedor para los headers de tabs
export const TabHeaders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabHeaders must be used within Tabs');

  const { setActiveTab } = context;

  // Asignar índices a los tabs hijos
  const tabsWithIndices = React.Children.map(children, (child, index) => {
    if (React.isValidElement<TabProps>(child)) {
      return React.cloneElement(child, {
        tabIndex: index,
        onTabClick: () => setActiveTab(index)
      });
    }
    return child;
  });

  return (
    <div className="flex space-x-2 border-b border-gray-200">
      {tabsWithIndices}
    </div>
  );
};