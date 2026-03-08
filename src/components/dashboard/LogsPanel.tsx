'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const logsData = [
  { time: '09:45:21', type: 'INFO', message: 'Вход в систему с узла 192.168.1.45' },
  { time: '09:45:15', type: 'WARN', message: 'Обнаружена попытка SQL-инъекции' },
  { time: '09:44:58', type: 'INFO', message: 'Обновление базы сигнатур' },
  { time: '09:44:30', type: 'INFO', message: 'Сканирование портов завершено' },
  { time: '09:43:45', type: 'ERROR', message: 'Попытка несанкционированного доступа' },
  { time: '09:42:20', type: 'INFO', message: 'Автоматическое резервное копирование' },
  { time: '09:41:10', type: 'WARN', message: 'Высокая загрузка процессора на узле 192.168.1.10' },
  { time: '09:40:05', type: 'INFO', message: 'Подключение нового устройства: iPhone 15 Pro' },
]

const typeStyles: Record<string, { text: string; bg?: string }> = {
  INFO: { text: 'text-blue-400' },
  WARN: { text: 'text-yellow-500' },
  ERROR: { text: 'text-red-400' },
}

export function LogsPanel() {
  return (
    <div className="bg-panel-light p-6 rounded-3xl border border-white/5">
      <h3 className="font-semibold text-lg mb-4">Лента логов в реальном времени</h3>
      <ScrollArea className="h-[200px] pr-4 custom-scrollbar">
        <div className="font-mono text-sm space-y-2 text-gray-300">
          {logsData.map((log, index) => (
            <div key={index} className="flex gap-4 hover:bg-white/5 p-1 rounded transition-colors">
              <span className="text-gray-500 shrink-0">{log.time}</span>
              <span className={cn(typeStyles[log.type]?.text || 'text-gray-400', 'shrink-0')}>
                [{log.type}]
              </span>
              <span className="truncate">{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
