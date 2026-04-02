"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

const mockDistribution = [
  { label: "P1", capital_ratio: 7.2 },
  { label: "P5", capital_ratio: 8.5 },
  { label: "P10", capital_ratio: 9.8 },
  { label: "P25", capital_ratio: 11.2 },
  { label: "P50", capital_ratio: 12.8 },
  { label: "P75", capital_ratio: 14.5 },
  { label: "P90", capital_ratio: 16.2 },
  { label: "P95", capital_ratio: 17.8 },
  { label: "P99", capital_ratio: 19.5 },
];

export function StressDistributionPlot({ data = mockDistribution }: { data?: any[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }}
            unit="%"
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="capital_ratio" 
            stroke="#6366f1" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRatio)" 
          />
          <ReferenceLine 
            y={12.5} 
            label={{ position: 'top', value: 'RBZ MIN (12.5%)', fill: '#f43f5e', fontSize: 10, fontWeight: 'black' }} 
            stroke="#f43f5e" 
            strokeDasharray="3 3" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
