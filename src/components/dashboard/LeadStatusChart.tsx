'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  type PieLabelRenderProps,
} from 'recharts'

interface LeadStatusDataPoint {
  name: string
  value: number
  color: string
}

interface LeadStatusChartProps {
  data: LeadStatusDataPoint[]
}

const renderCustomLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, value } = props
  if (!value || value === 0) return null
  const RADIAN = Math.PI / 180
  const mid = midAngle ?? 0
  const inner = (innerRadius as number) ?? 0
  const outer = (outerRadius as number) ?? 0
  const cxNum = (cx as number) ?? 0
  const cyNum = (cy as number) ?? 0
  const radius = inner + (outer - inner) * 0.5
  const x = cxNum + radius * Math.cos(-mid * RADIAN)
  const y = cyNum + radius * Math.sin(-mid * RADIAN)
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
    >
      {value}
    </text>
  )
}

export default function LeadStatusChart({ data }: LeadStatusChartProps) {
  const filteredData = data.filter((d) => d.value > 0)

  if (filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        Henüz lead verisi yok
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {filteredData.map((entry, index) => (
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
