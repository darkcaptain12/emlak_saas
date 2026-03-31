'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface PropertyTypeDataPoint {
  name: string
  count: number
}

interface PropertyTypeChartProps {
  data: PropertyTypeDataPoint[]
}

const BAR_COLOR = '#3b82f6'
const BAR_COLOR_ALT = '#6366f1'

export default function PropertyTypeChart({ data }: PropertyTypeChartProps) {
  const filtered = data.filter((d) => d.count > 0)

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        Henüz ilan verisi yok
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={filtered} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="#1e293b" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={24}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          contentStyle={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            color: '#f1f5f9',
            fontSize: '12px',
          }}
          formatter={(value) => [value, 'İlan']}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {filtered.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index % 2 === 0 ? BAR_COLOR : BAR_COLOR_ALT}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
