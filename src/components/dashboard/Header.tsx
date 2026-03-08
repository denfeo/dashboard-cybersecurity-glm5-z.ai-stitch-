'use client'

import { Users, Briefcase, FolderKanban } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TabType = 'overview' | 'incidents' | 'network' | 'vulnerabilities' | 'logs' | 'reports'

const navItems: { label: string; id: TabType; isBrand?: boolean }[] = [
  { label: 'Crextio', id: 'overview', isBrand: true },
  { label: 'Обзор', id: 'overview' },
  { label: 'Инциденты', id: 'incidents' },
  { label: 'Сеть', id: 'network' },
  { label: 'Уязвимости', id: 'vulnerabilities' },
  { label: 'Логи', id: 'logs' },
  { label: 'Отчеты', id: 'reports' },
]

interface StatItemProps {
  icon: React.ReactNode
  value: string | number
  label: string
  color: string
}

function StatItem({ icon, value, label, color }: StatItemProps) {
  return (
    <div className="text-right">
      <div className={cn('flex items-center justify-end gap-2 mb-1', color)}>
        {icon}
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
  )
}

interface HeaderProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="flex flex-col gap-6">
      {/* Top Nav */}
      <nav className="flex items-center gap-1 bg-panel-light rounded-full p-1.5 w-max border border-white/5">
        {navItems.map((item) => (
          <button
            key={`${item.label}-${item.id}`}
            onClick={() => !item.isBrand && onTabChange(item.id)}
            className={cn(
              'px-4 py-1.5 text-sm font-medium transition-colors',
              item.isBrand && 'text-gray-300 font-semibold cursor-default',
              !item.isBrand && activeTab === item.id && 'bg-white text-black rounded-full shadow-sm font-semibold',
              !item.isBrand && activeTab !== item.id && 'text-gray-400 hover:text-white'
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Welcome & Key Stats - only show on overview */}
      {activeTab === 'overview' && (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Добро пожаловать,
              <br />
              Nixtio
            </h1>
          </div>
          <div className="flex gap-8">
            <StatItem
              icon={<Users className="w-4 h-4" />}
              value={12}
              label="Сотрудники"
              color="text-chart-blue"
            />
            <StatItem
              icon={<Briefcase className="w-4 h-4 rotate-180" />}
              value={450}
              label="Наймы"
              color="text-chart-green"
            />
            <StatItem
              icon={<FolderKanban className="w-4 h-4" />}
              value={2054}
              label="Проекты"
              color="text-gray-300"
            />
          </div>
        </div>
      )}
    </header>
  )
}
