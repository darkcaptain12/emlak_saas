'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface PropertyStatusDataPoint {
  name: string
  value: number
  color: string
}

interface PropertyStatusChartProps {
  data: PropertyStatusDataPoint[]
}

export default function PropertyStatusChart({ data }: PropertyStatusChartProps) {
  const filtered = data.filter((d) => d.value > 0)

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        Henüz ilan verisi yok
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={filtered}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          dataKey="value"
        >
          {filtered.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            color: '#f1f5f9',
            fontSize: '12px',
          }}
          formatter={(value, name) => [value, name]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
