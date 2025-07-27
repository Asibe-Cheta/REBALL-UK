'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ProgressChartProps {
  data: any[];
  type: 'line' | 'bar' | 'pie';
  width?: number;
  height?: number;
  xKey: string;
  yKey: string;
  title?: string;
  color?: string;
}

export default function ProgressChart({
  data,
  type,
  width = 400,
  height = 300,
  xKey,
  yKey,
  title,
  color = '#3b82f6'
}: ProgressChartProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data} width={width} height={height}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={data} width={width} height={height}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={yKey} fill={color} />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart width={width} height={height}>
            <Pie
              data={data}
              cx={width / 2}
              cy={height / 2}
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={yKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
} 