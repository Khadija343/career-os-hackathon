import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", progress: 30 },
  { day: "Tue", progress: 45 },
  { day: "Wed", progress: 60 },
  { day: "Thu", progress: 55 },
  { day: "Fri", progress: 75 },
  { day: "Sat", progress: 82 },
  { day: "Sun", progress: 92 },
];

// Custom Tooltip component to replace the default ugly black/gray box
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-xl border border-slate-800 text-xs font-semibold">
        <p className="text-slate-400 mb-0.5">{payload[0].payload.day}</p>
        <p className="text-blue-400 text-sm">Progress: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function WeeklyActivity() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="chart">📊</span> Weekly Activity
      </h2>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            {/* Soft grid lines to make tracking data points easier */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />

            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              domain={[0, 100]}
            />

            {/* Injected our custom Tailwind tooltip here */}
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />

            <Line
              type="monotone"
              dataKey="progress"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: '#ffffff', stroke: '#2563eb' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}