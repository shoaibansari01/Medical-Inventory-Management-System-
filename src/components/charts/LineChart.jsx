import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const LineChart = ({ 
  data = [], 
  width = '100%', 
  height = 300,
  title = 'Monthly Sales',
  colors = ['#1a73f8', '#2c9d8a', '#e94e63'],
  areaChart = true
}) => {
  // Format data for Recharts if needed
  const formattedData = data.map(item => ({
    name: item.label,
    value: item.value
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow-card" style={{ width, height }}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={title ? "85%" : "100%"}>
        {areaChart ? (
          <AreaChart
            data={formattedData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
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
              cursor={{ stroke: colors[0], strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              name="Sales" 
              stroke={colors[0]} 
              fill={`${colors[0]}20`} 
              activeDot={{ r: 6, fill: colors[0], stroke: 'white', strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        ) : (
          <RechartsLineChart
            data={formattedData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
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
              cursor={{ stroke: colors[0], strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line 
              type="monotone" 
              dataKey="value" 
              name="Sales" 
              stroke={colors[0]} 
              activeDot={{ r: 6, fill: colors[0], stroke: 'white', strokeWidth: 2 }}
              strokeWidth={2}
              dot={{ r: 4, fill: colors[0], stroke: 'white', strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </RechartsLineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
