import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const BarChart = ({ 
  data = [], 
  width = '100%', 
  height = 300,
  colors = ['#1a73f8', '#2c9d8a', '#e94e63']
}) => {
  // Format data for Recharts if needed
  const formattedData = data.map(item => ({
    name: item.label,
    value: item.value
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow-card" style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={formattedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
          className="animate-fade-in"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#666', fontSize: 12 }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            tick={{ fill: '#666', fontSize: 12 }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '10px'
            }}
            cursor={{ fill: 'rgba(224, 231, 255, 0.2)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar 
            dataKey="value" 
            name="Quantity" 
            fill={colors[0]} 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
