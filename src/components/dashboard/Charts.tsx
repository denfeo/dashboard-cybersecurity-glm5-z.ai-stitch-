'use client'

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

// Attack Frequency Chart Data
const attackData = [
  { time: 'П', value1: 80, value2: 90 },
  { time: 'В', value1: 60, value2: 70 },
  { time: 'С', value1: 50, value2: 30 },
  { time: 'Ч', value1: 70, value2: 40 },
  { time: 'П', value1: 40, value2: 20 },
  { time: 'С', value1: 60, value2: 50 },
  { time: 'К', value1: 30, value2: 40 },
]

// Threat Distribution Data
const threatData = [
  { name: 'Фишинг', value: 71, color: '#00f2fe' },
  { name: 'Вредоносное ПО', value: 20, color: '#4299e1' },
  { name: 'DDoS', value: 9, color: '#2b6cb0' },
]

// Vulnerability Assessment Data
const vulnerabilityData = [
  { category: 'Безопасность', value: 80 },
  { category: 'Угроз снаружи', value: 70 },
  { category: 'Системные сбои', value: 60 },
  { category: 'Внутренние угрозы', value: 50 },
  { category: 'Вирусные атаки', value: 65 },
  { category: 'Потери системы', value: 75 },
]

export function AttackFrequencyChart() {
  return (
    <div className="bg-panel-light p-6 rounded-3xl border border-white/5 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Частота атак</h3>
        <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">last 24h</span>
      </div>
      <div className="flex-1 h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={attackData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4299e1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4299e1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#718096', fontSize: 12 }}
            />
            <YAxis hide domain={[0, 100]} />
            <Area
              type="monotone"
              dataKey="value1"
              stroke="#4299e1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue1)"
            />
            <Area
              type="monotone"
              dataKey="value2"
              stroke="#00f2fe"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue2)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="absolute top-0 right-[20%] bg-chart-green text-black text-xs font-bold px-2 py-1 rounded">
          182.22b
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2 px-2 uppercase">
        <span>П</span>
        <span>В</span>
        <span>С</span>
        <span>Ч</span>
        <span>П</span>
        <span>С</span>
        <span>К</span>
      </div>
    </div>
  )
}

export function VulnerabilityRadarChart() {
  return (
    <div className="bg-panel-light p-6 rounded-3xl border border-white/5 flex flex-col items-center">
      <h3 className="font-semibold text-lg w-full mb-4 text-left">Оценка уязвимости системы</h3>
      <div className="relative w-48 h-48 my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={vulnerabilityData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: '#a0aec0', fontSize: 10 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
            <Radar
              name="Уязвимость"
              dataKey="value"
              stroke="#00f2fe"
              fill="#00f2fe"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function ThreatDistributionChart() {
  return (
    <div className="bg-panel-light p-6 rounded-3xl border border-white/5 flex flex-col items-center">
      <h3 className="font-semibold text-lg w-full mb-4 text-left">Распределение угроз</h3>
      <div className="relative w-40 h-40 my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={threatData}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={55}
              paddingAngle={2}
              dataKey="value"
            >
              {threatData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 text-xs text-gray-300 w-full justify-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00f2fe]" />
          Фишинг
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4299e1]" />
          Вредоносное ПО
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2b6cb0]" />
          DDoS
        </div>
      </div>
    </div>
  )
}

export function MainCharts() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <AttackFrequencyChart />
      <VulnerabilityRadarChart />
      <ThreatDistributionChart />
    </section>
  )
}
