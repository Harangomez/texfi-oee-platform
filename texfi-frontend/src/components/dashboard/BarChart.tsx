// components/dashboard/BarChart.tsx
import React from 'react';

interface BarChartData {
  fecha: string;
  [key: string]: number | string; // Permitir tanto number como string
}

interface BarChartProps {
  data: BarChartData[];
  bars: Array<{
    key: string;
    label: string;
    color: string;
  }>;
  yAxisLabel?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  bars, 
  yAxisLabel = 'Valor' 
}) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No hay datos disponibles
      </div>
    );
  }

  const maxValue = Math.max(...bars.map(bar => 
    Math.max(...data.map(d => Number(d[bar.key]) || 0))
  ));

  const chartHeight = 300;
  const chartWidth = 800;
  const padding = 50;
  const barWidth = (chartWidth - 2 * padding) / (data.length * bars.length) - 5;

  const getX = (dataIndex: number, barIndex: number) => 
    padding + (dataIndex * bars.length + barIndex) * (barWidth + 5);
  const getY = (value: number) => 
    chartHeight - padding - ((value / maxValue) * (chartHeight - 2 * padding));

  return (
    <div className="w-full overflow-x-auto">
      <svg width={chartWidth} height={chartHeight} className="min-w-full">
        {/* Ejes */}
        <line
          x1={padding}
          y1={chartHeight - padding}
          x2={chartWidth - padding}
          y2={chartHeight - padding}
          stroke="#D1D5DB"
          strokeWidth="1"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={chartHeight - padding}
          stroke="#D1D5DB"
          strokeWidth="1"
        />

        {/* Etiqueta del eje Y */}
        <text
          x={padding - 25}
          y={chartHeight / 2}
          fontSize="12"
          textAnchor="middle"
          fill="#6B7280"
          transform={`rotate(-90 ${padding - 25} ${chartHeight / 2})`}
        >
          {yAxisLabel}
        </text>

        {/* Barras */}
        {data.map((d, dataIndex) => 
          bars.map((bar, barIndex) => {
            const value = Number(d[bar.key]) || 0;
            const height = (value / maxValue) * (chartHeight - 2 * padding);
            
            return (
              <g key={`${dataIndex}-${bar.key}`}>
                <rect
                  x={getX(dataIndex, barIndex)}
                  y={getY(value)}
                  width={barWidth}
                  height={height}
                  fill={bar.color}
                />
                <text
                  x={getX(dataIndex, barIndex) + barWidth / 2}
                  y={getY(value) - 5}
                  fontSize="10"
                  textAnchor="middle"
                  fill="#374151"
                >
                  {value}
                </text>
              </g>
            );
          })
        )}

        {/* Labels del eje X */}
        {data.map((d, i) => (
          <text
            key={i}
            x={getX(i, 0) + (bars.length * (barWidth + 5)) / 2}
            y={chartHeight - padding + 20}
            fontSize="12"
            textAnchor="middle"
            fill="#6B7280"
          >
            {d.fecha}
          </text>
        ))}

        {/* Leyenda */}
        <g transform={`translate(${padding}, ${padding - 20})`}>
          {bars.map((bar, i) => (
            <g key={bar.key} transform={`translate(0, ${i * 20})`}>
              <rect width="12" height="12" fill={bar.color} />
              <text x="20" y="10" fontSize="12" fill="#374151">
                {bar.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};