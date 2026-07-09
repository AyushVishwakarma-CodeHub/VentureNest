import React from 'react';
import { 
  AreaChart as RechartsAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface AreaChartProps {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  strokeColor?: string;
  fillGradientColor?: string;
  height?: number;
}

export function AreaChart({
  data,
  dataKey,
  xAxisKey,
  strokeColor = '#6C63FF',
  fillGradientColor = '#6C63FF',
  height = 280,
}: AreaChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data}>
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fillGradientColor} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={fillGradientColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
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
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={strokeColor} 
            strokeWidth={2} 
            fillOpacity={1} 
            fill="url(#colorArea)" 
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
export default AreaChart;
