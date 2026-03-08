'use client'

import { useState } from 'react'
import { ChevronDown, Monitor, MoreVertical, Shield, Network, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItemProps {
  title: string
  isActive?: boolean
  onClick?: () => void
  children?: React.ReactNode
}

function AccordionItem({ title, isActive, onClick, children }: AccordionItemProps) {
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden border border-white/5',
        isActive ? 'bg-panel-light shadow-lg border-white/10' : 'bg-panel-light'
      )}
    >
      <button
        onClick={onClick}
        className="w-full px-4 py-3 flex justify-between items-center text-sm font-medium hover:bg-white/5 transition-colors"
      >
        {title}
        <ChevronDown
          className={cn('w-4 h-4 text-gray-400 transition-transform', isActive && 'rotate-180')}
        />
      </button>
      {isActive && children && (
        <div className="p-4 pt-0 border-t border-white/5 mt-2">{children}</div>
      )}
    </div>
  )
}

export function Sidebar() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('active-threats')

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id)
  }

  return (
    <aside className="w-full md:w-[280px] p-6 border-b md:border-b-0 md:border-r border-white/5 flex flex-col gap-6 bg-sidebar">
      {/* User Profile */}
      <div className="relative rounded-2xl overflow-hidden aspect-[3/4] group">
        <img
          src="/avatar.jpg"
          alt="User Avatar"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
          <h2 className="text-xl font-bold text-white">Лора Питерсон</h2>
          <p className="text-sm text-gray-300 mb-2">UX/UI Дизайнер</p>
          <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold w-max">
            $1,200
          </span>
        </div>
      </div>

      {/* Navigation Accordion */}
      <nav className="flex flex-col gap-3">
        <AccordionItem
          title="Статус системы"
          isActive={activeAccordion === 'system-status'}
          onClick={() => toggleAccordion('system-status')}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Все системы в норме</span>
          </div>
        </AccordionItem>

        <AccordionItem
          title="Активные угрозы"
          isActive={activeAccordion === 'active-threats'}
          onClick={() => toggleAccordion('active-threats')}
        >
          <div className="flex items-center gap-3 bg-panel-bg p-2 rounded-lg border border-white/5">
            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center shrink-0">
              <Monitor className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold truncate">MacBook Air</h4>
              <p className="text-xs text-gray-400 truncate">Версия M1</p>
            </div>
            <button className="text-gray-400 hover:text-white shrink-0">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </AccordionItem>

        <AccordionItem
          title="Узлы сети"
          isActive={activeAccordion === 'network-nodes'}
          onClick={() => toggleAccordion('network-nodes')}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Network className="w-4 h-4" />
            <span>2,054 активных узла</span>
          </div>
        </AccordionItem>

        <AccordionItem
          title="Уровень безопасности"
          isActive={activeAccordion === 'security-level'}
          onClick={() => toggleAccordion('security-level')}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span>Уровень: Высокий</span>
          </div>
        </AccordionItem>
      </nav>
    </aside>
  )
}
