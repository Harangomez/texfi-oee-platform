// components/dashboard/GaugeChart.tsx
import React from 'react';

interface GaugeChartProps {
  value: number;
  max: number;
  meta: number;
  label: string;
  size?: 'small' | 'large';
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ 
  value, 
  max, 
  meta, 
  label, 
  size = 'large' 
}) => {
  const percentage = (value / max) * 100;
  const radius = size === 'large' ? 80 : 60;
  const strokeWidth = size === 'large' ? 12 : 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 85) return '#10B981'; // Verde
    if (val >= 70) return '#F59E0B'; // Amarillo
    if (val >= 50) return '#F97316'; // Naranja
    return '#EF4444'; // Rojo
  };

  const color = getColor(value);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={radius * 2 + strokeWidth} height={radius + strokeWidth / 2}>
          {/* Fondo del gauge */}
          <circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          {/* Arco de valor */}
          <circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${radius + strokeWidth / 2} ${radius + strokeWidth / 2})`}
          />
          {/* Línea de meta */}
          {meta > 0 && (
            <line
              x1={radius + strokeWidth / 2}
              y1={radius + strokeWidth / 2}
              x2={radius + strokeWidth / 2 + radius * Math.cos((meta / 100) * Math.PI - Math.PI / 2)}
              y2={radius + strokeWidth / 2 + radius * Math.sin((meta / 100) * Math.PI - Math.PI / 2)}
              stroke="#6B7280"
              strokeWidth="2"
              strokeDasharray="4"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${size === 'large' ? 'text-3xl' : 'text-xl'}`}>
            {value.toFixed(1)}%
          </span>
          <span className={`text-gray-600 ${size === 'large' ? 'text-sm' : 'text-xs'}`}>
            {label}
          </span>
        </div>
      </div>
      {meta > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Meta: {meta}%
        </div>
      )}
    </div>
  );
};