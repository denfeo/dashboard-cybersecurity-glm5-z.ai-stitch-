'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header, TabType } from '@/components/dashboard/Header'
import { SparklineCards } from '@/components/dashboard/SparklineCard'
import { MainCharts } from '@/components/dashboard/Charts'
import { LogsPanel } from '@/components/dashboard/LogsPanel'
import { TimelinePanel } from '@/components/dashboard/TimelinePanel'
import { IncidentsPage } from '@/components/dashboard/IncidentsPage'

function OverviewPage() {
  return (
    <>
      {/* Micro Charts Row */}
      <SparklineCards />

      {/* Main Charts Row */}
      <MainCharts />

      {/* Logs and Timeline Row */}
      <section className="flex flex-col gap-6">
        <LogsPanel />
        <TimelinePanel />
      </section>
    </>
  )
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'incidents':
        return <IncidentsPage />
      case 'overview':
      default:
        return <OverviewPage />
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8">
      {/* Main Container */}
      <div className="glass-panel w-full max-w-[1400px] flex flex-col md:flex-row overflow-hidden shadow-2xl rounded-3xl">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 flex flex-col gap-8 bg-dashboard-bg overflow-y-auto max-h-[calc(100vh-4rem)]">
          {/* Header */}
          <Header activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Dynamic Content */}
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
