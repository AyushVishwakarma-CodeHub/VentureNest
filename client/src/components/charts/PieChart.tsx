import React from 'react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
  height?: number;
}

const DEFAULT_COLORS = ['#6C63FF', '#8B5CF6', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444'];

export function PieChart({
  data,
  dataKey,
  nameKey,
  colors = DEFAULT_COLORS,
  height = 280,
}: PieChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            nameKey={nameKey}
            dataKey={dataKey}
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="80%"
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              borderRadius: '12px',
              border: '1px solid rgba(200, 200, 200, 0.4)',
              color: '#333'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
export default PieChart;
