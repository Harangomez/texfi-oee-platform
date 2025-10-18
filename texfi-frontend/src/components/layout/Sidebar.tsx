import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Factory,
  //FileText 
  MessageCircle
} from 'lucide-react';
//import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Producción', href: '/produccion', icon: Factory },
  { name: 'Configuración', href: '/configuracion', icon: Settings },
  { name: 'Feedback', href: '/informes', icon: MessageCircle },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  //const { user } = useAuth();

  return (
    <div className="w-64 bg-white shadow-sm border-r">
      <nav className="mt-8">
        <ul className="space-y-1 px-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={clsx(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon className={clsx(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-primary-500' : 'text-gray-400'
                  )} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};