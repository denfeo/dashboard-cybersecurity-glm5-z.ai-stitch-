'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

const timelineEvents = [
  {
    id: 1,
    position: '15%',
    title: 'Критическое событие',
    description: 'Вход в систему с узла\n192.168.1.45',
    type: 'critical',
    above: true,
  },
  {
    id: 2,
    position: '30%',
    title: 'Обнаружение вирусов',
    description: 'Вредоносное вложение\n15.04, 18:30',
    type: 'success',
    above: false,
  },
  {
    id: 3,
    position: '70%',
    title: 'Обнаружение вирусов',
    description: 'Обезвреживание вирусов\n13.04, 10:30',
    type: 'success',
    above: true,
  },
]

export function TimelinePanel() {
  return (
    <div className="bg-panel-light p-6 rounded-3xl border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-lg">Временная шкала событий безопасности</h3>
          <p className="text-sm text-gray-500">Временная шкала событий безопасности</p>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
            <ChevronRight className="w-4 h-4 text-gray-200" />
          </button>
        </div>
      </div>

      <div className="relative py-20 px-8">
        {/* Main Horizontal Line */}
        <div className="absolute top-1/2 left-8 right-12 h-0.5 bg-gray-700 -translate-y-1/2 z-0 flex items-center">
          {/* Colored Line segments */}
          <div className="absolute left-[15%] w-[15%] h-full bg-status-red" />
          <div className="absolute left-[30%] w-[40%] h-full bg-chart-green" />
          <ChevronRight className="absolute right-0 w-4 h-4 text-gray-500 translate-x-full" />
        </div>

        {/* Timeline Events */}
        <div className="relative z-10 w-full h-full">
          {timelineEvents.map((event) => (
            <div
              key={event.id}
              className="absolute"
              style={{
                left: event.position,
                ...(event.above
                  ? { bottom: 'calc(50% + 0.5rem)' }
                  : { top: 'calc(50% + 0.5rem)' }),
                transform: 'translateX(-50%)',
              }}
            >
              <div
                className={`flex flex-col items-center ${event.above ? 'flex-col' : 'flex-col-reverse'}`}
              >
                {/* Event Card */}
                <div
                  className={`${
                    event.type === 'critical'
                      ? 'bg-[#352528] border-status-red/30'
                      : 'bg-[#1d3230] border-chart-green/30'
                  } border p-3 rounded-lg w-48 shadow-lg z-10`}
                >
                  <h4
                    className={`${
                      event.type === 'critical' ? 'text-status-red' : 'text-chart-green'
                    } text-sm font-semibold`}
                  >
                    {event.title}
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 whitespace-pre-line">
                    {event.description}
                  </p>
                </div>

                {/* Connector Line */}
                <div
                  className={`w-0.5 h-6 ${
                    event.type === 'critical' ? 'bg-status-red' : 'bg-chart-green'
                  }`}
                />

                {/* Dot */}
                <div
                  className={`w-3 h-3 ${
                    event.type === 'critical' ? 'bg-status-red' : 'bg-chart-green'
                  } rounded-full border-[3px] border-panel-light absolute ${
                    event.above ? '-bottom-[0.55rem]' : '-top-[0.55rem]'
                  } z-20`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
