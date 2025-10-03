// components/dashboard/LineChart.tsx
import React from 'react';

interface LineChartData {
  fecha: string;
  [key: string]: number | string;
}

interface LineChartProps {
  data: LineChartData[];
  lines: Array<{
    key: string;
    label: string;
    color: string;
  }>;
  meta?: number;
  yAxisLabel?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  lines, 
  meta,
  yAxisLabel = 'Valor' 
}) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No hay datos disponibles
      </div>
    );
  }

  const maxValue = Math.max(
    ...lines.map(line => Math.max(...data.map(d => Number(d[line.key]) || 0))),
    meta || 0
  );

  const chartHeight = 300;
  const chartWidth = 800;
  const padding = 50;

  const getX = (index: number) => padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
  const getY = (value: number) => chartHeight - padding - ((value / maxValue) * (chartHeight - 2 * padding));

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

        {/* Línea de meta */}
        {meta && (
          <>
            <line
              x1={padding}
              y1={getY(meta)}
              x2={chartWidth - padding}
              y2={getY(meta)}
              stroke="#6B7280"
              strokeWidth="1"
              strokeDasharray="4"
            />
            <text
              x={padding - 10}
              y={getY(meta) - 5}
              fill="#6B7280"
              fontSize="12"
              textAnchor="end"
            >
              {meta}%
            </text>
          </>
        )}

        {/* Líneas de datos */}
        {lines.map(line => {
          const points = data
            .map((d, i) => {
              const value = Number(d[line.key]) || 0;
              return `${getX(i)},${getY(value)}`;
            })
            .join(' ');

          return (
            <polyline
              key={line.key}
              points={points}
              fill="none"
              stroke={line.color}
              strokeWidth="2"
            />
          );
        })}

        {/* Puntos y labels */}
        {data.map((d, i) => (
          <g key={i}>
            {lines.map(line => (
              <circle
                key={`${i}-${line.key}`}
                cx={getX(i)}
                cy={getY(Number(d[line.key]) || 0)}
                r="4"
                fill={line.color}
              />
            ))}
            <text
              x={getX(i)}
              y={chartHeight - padding + 20}
              fontSize="12"
              textAnchor="middle"
              fill="#6B7280"
            >
              {d.fecha}
            </text>
          </g>
        ))}

        {/* Leyenda */}
        <g transform={`translate(${padding}, ${padding - 20})`}>
          {lines.map((line, i) => (
            <g key={line.key} transform={`translate(0, ${i * 20})`}>
              <rect width="12" height="12" fill={line.color} />
              <text x="20" y="10" fontSize="12" fill="#374151">
                {line.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};