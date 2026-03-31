'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface MonthlyDataPoint {
  month: string
  leads: number
}

interface MonthlyLeadChartProps {
  data: MonthlyDataPoint[]
}

export default function MonthlyLeadChart({ data }: MonthlyLeadChartProps) {
  const hasData = data.some((d) => d.leads > 0)

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        Henüz yeterli veri yok
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#1e293b" />
        <XAxis
          dataKey="month"
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
          contentStyle={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            color: '#f1f5f9',
            fontSize: '12px',
          }}
          formatter={(value) => [value, 'Lead']}
        />
        <Area
          type="monotone"
          dataKey="leads"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#leadGradient)"
          dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#3b82f6' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
