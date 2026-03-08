'use client'

import { Bar, BarChart, ResponsiveContainer, Cell, YAxis } from 'recharts'

interface SparklineCardProps {
  title: string
  value: string | number
  data: number[]
  gradientId: string
  gradientFrom: string
  gradientTo: string
  variant?: 'bars' | 'progress'
}

export function SparklineCard({
  title,
  value,
  data,
  gradientId,
  gradientFrom,
  gradientTo,
  variant = 'bars',
}: SparklineCardProps) {
  const chartData = data.map((value, index) => ({ value, index }))
  const maxValue = Math.max(...data)

  if (variant === 'progress') {
    return (
      <div className="bg-panel-light p-4 rounded-2xl border border-white/5 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs text-gray-400">{title}</h3>
          <span className="text-sm font-bold">{value}</span>
        </div>
        <div className="flex-1 flex items-end">
          <div 
            className="w-full h-10 rounded-full opacity-80"
            style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-panel-light p-4 rounded-2xl border border-white/5 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="text-xs text-gray-400">{title}</h3>
        <span className="text-sm font-bold">{value}</span>
      </div>
      <div className="h-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientTo} />
                <stop offset="100%" stopColor={gradientFrom} />
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, maxValue]} />
            <Bar dataKey="value" radius={[2, 2, 0, 0]} fill={`url(#${gradientId})`} opacity={0.8}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Pre-configured cards for the dashboard
export function SparklineCards() {
  const activeThreatsData = [30, 50, 40, 70, 60, 80, 40, 50, 90, 70, 60, 80, 40, 50, 70]
  const blockedData = [40, 60, 50, 80, 70, 90, 50, 60, 100, 80, 70, 90, 50, 60, 80]
  const efficiencyData = [20, 40, 30, 60, 50, 70, 30, 40, 80, 60, 50, 70, 30, 40, 60]

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <SparklineCard
        title="Активные угрозы"
        value={12}
        data={activeThreatsData}
        gradientId="gradient-blue"
        gradientFrom="#3b82f6"
        gradientTo="#93c5fd"
      />
      <SparklineCard
        title="Заблокировано"
        value={450}
        data={blockedData}
        gradientId="gradient-green"
        gradientFrom="#00f2fe"
        gradientTo="#4ade80"
      />
      <SparklineCard
        title="Узлы сети"
        value={2054}
        data={[100]}
        gradientId="gradient-progress"
        gradientFrom="#3b82f6"
        gradientTo="#60a5fa"
        variant="progress"
      />
      <SparklineCard
        title="Выработка"
        value="10%"
        data={efficiencyData}
        gradientId="gradient-cyan"
        gradientFrom="#60a5fa"
        gradientTo="#00f2fe"
      />
    </section>
  )
}
