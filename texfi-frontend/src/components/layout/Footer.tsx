import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Texfi. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};