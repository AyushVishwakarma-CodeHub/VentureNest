import React from 'react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface LineChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  strokeColor?: string;
  height?: number;
}

export function LineChart({
  data,
  dataKey,
  xAxisKey,
  strokeColor = '#6C63FF',
  height = 280,
}: LineChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
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
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={strokeColor} 
            strokeWidth={2} 
            dot={{ r: 4 }} 
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
export default LineChart;
