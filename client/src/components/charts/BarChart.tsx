import React from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface BarChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  fillColor?: string;
  height?: number;
}

export function BarChart({
  data,
  dataKey,
  xAxisKey,
  fillColor = '#6C63FF',
  height = 280,
}: BarChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey={xAxisKey} stroke="#888888" fontSize={12} tickLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              borderRadius: '12px',
              border: '1px solid rgba(200, 200, 200, 0.4)',
              color: '#333'
            }}
          />
          <Bar dataKey={dataKey} fill={fillColor} radius={[6, 6, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
export default BarChart;
