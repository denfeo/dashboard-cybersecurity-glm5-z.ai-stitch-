'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart2,
  AlertTriangle,
  CheckCircle,
  Timer,
  TrendingUp,
  TrendingDown,
  Search,
  Bell,
  Filter,
  Download,
  X,
  Play,
  Pause,
  RefreshCw,
  Shield,
  User,
  Clock,
  Activity,
  AlertCircle,
  ArrowUpRight,
  UserPlus,
  CheckCircle2,
  Ban,
  Eye,
  MoreHorizontal,
  Zap,
  Target,
  Globe,
  Server,
  Lock,
  FileText,
  FileCheck,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Types
type Priority = 'Critical' | 'High' | 'Medium' | 'Low'
type Status = 'New' | 'In Progress' | 'Investigating' | 'Resolved' | 'False Positive'
type IncidentType = 'DDoS Attack' | 'SQL Injection' | 'Brute Force' | 'Data Exfiltration' | 'Malware' | 'Phishing' | 'XSS' | 'Ransomware'

interface Incident {
  id: string
  type: IncidentType
  description: string
  priority: Priority
  status: Status
  time: string
  source: string
  targetIP: string
  attackerIP: string
  assignedTo?: string
  timeline: TimelineEvent[]
  logs: string[]
  severity: number
  mitreAttack?: string[]
}

interface TimelineEvent {
  id: string
  time: string
  title: string
  subtitle: string
  status: 'critical' | 'primary' | 'success' | 'pending' | 'warning'
}

// Extended incidents data
const incidentsData: Incident[] = [
  {
    id: 'INC-9421',
    type: 'DDoS Attack',
    description: 'UDP Flood on Cluster A - Port 80/443',
    priority: 'Critical',
    status: 'New',
    time: '14:23:05',
    source: 'External',
    targetIP: '10.0.4.100',
    attackerIP: '185.22.41.102',
    severity: 95,
    mitreAttack: ['T1498', 'T1499'],
    timeline: [
      { id: '1', time: '14:23:05', title: 'Обнаружение аномалии', subtitle: 'NetFlow Monitor', status: 'critical' },
      { id: '2', time: '14:23:10', title: 'Автоматическая блокировка', subtitle: 'WAF Rule #4421', status: 'primary' },
    ],
    logs: [
      '[14:23:05] ALERT: Unusual traffic spike detected',
      '[14:23:08] SOURCE: 185.22.41.102 - 50K req/sec',
      '[14:23:10] ACTION: WAF blocking activated',
      '[14:23:12] STATUS: Mitigation in progress',
    ],
  },
  {
    id: 'INC-9418',
    type: 'SQL Injection',
    description: 'Target: Auth Microservice',
    priority: 'High',
    status: 'In Progress',
    time: '14:15:12',
    source: 'External',
    targetIP: '10.0.4.122',
    attackerIP: '185.22.41.102',
    assignedTo: 'А. Соколов',
    severity: 82,
    mitreAttack: ['T1190', 'T1078'],
    timeline: [
      { id: '1', time: '14:15:12', title: 'Обнаружение угрозы', subtitle: 'Автоматически', status: 'critical' },
      { id: '2', time: '14:16:45', title: 'Назначен аналитик', subtitle: 'Система SOC', status: 'primary' },
      { id: '3', time: '14:20:00', title: 'Изоляция узла', subtitle: 'В процессе', status: 'pending' },
    ],
    logs: [
      '[14:15:12] GET /auth/login?u=\' OR 1=1--',
      '[14:15:13] 403 Forbidden - WAF Block',
      '[14:15:15] Payload detected: Blind SQLi',
      '[14:15:20] Source: 185.22.41.102',
    ],
  },
  {
    id: 'INC-9415',
    type: 'Brute Force',
    description: 'Admin Panel (User: Root)',
    priority: 'Medium',
    status: 'Resolved',
    time: '13:58:44',
    source: 'Internal',
    targetIP: '10.0.1.50',
    attackerIP: '192.168.1.45',
    assignedTo: 'М. Петров',
    severity: 65,
    mitreAttack: ['T1110'],
    timeline: [
      { id: '1', time: '13:58:44', title: 'Обнаружение', subtitle: 'SIEM Rule #1205', status: 'warning' },
      { id: '2', time: '14:00:00', title: 'Блокировка IP', subtitle: 'Автоматически', status: 'primary' },
      { id: '3', time: '14:05:00', title: 'Инцидент закрыт', subtitle: 'False positive', status: 'success' },
    ],
    logs: [
      '[13:58:44] ALERT: Multiple failed login attempts',
      '[13:58:50] USER: root - 50 attempts in 2 min',
      '[14:00:00] ACTION: IP blocked',
      '[14:05:00] RESOLVED: Internal pentest team',
    ],
  },
  {
    id: 'INC-9410',
    type: 'Data Exfiltration',
    description: 'Suspicious outbound transfer',
    priority: 'Critical',
    status: 'Investigating',
    time: '12:30:00',
    source: 'Internal',
    targetIP: '10.0.4.55',
    attackerIP: 'Unknown',
    assignedTo: 'К. Иванов',
    severity: 98,
    mitreAttack: ['T1048', 'T1041'],
    timeline: [
      { id: '1', time: '12:30:00', title: 'DLP Alert', subtitle: 'Large data transfer', status: 'critical' },
      { id: '2', time: '12:35:00', title: 'Investigation started', subtitle: 'L3 Team', status: 'primary' },
    ],
    logs: [
      '[12:30:00] DLP: 500MB outbound detected',
      '[12:30:05] DEST: Unknown external IP',
      '[12:30:10] PROTOCOL: HTTPS (Encrypted)',
      '[12:35:00] STATUS: Under investigation',
    ],
  },
  {
    id: 'INC-9405',
    type: 'Phishing',
    description: 'Credential harvesting campaign',
    priority: 'High',
    status: 'New',
    time: '11:45:00',
    source: 'External',
    targetIP: 'Multiple',
    attackerIP: '45.33.32.156',
    severity: 78,
    mitreAttack: ['T1566'],
    timeline: [
      { id: '1', time: '11:45:00', title: 'Phishing email reported', subtitle: 'User: finance@...', status: 'critical' },
    ],
    logs: [
      '[11:45:00] REPORT: Suspicious email',
      '[11:45:30] URL: hxxp://micros0ft-verify.com',
      '[11:46:00] ACTION: URL blocked globally',
    ],
  },
  {
    id: 'INC-9398',
    type: 'Malware',
    description: 'Trojan detected on workstation',
    priority: 'Critical',
    status: 'Resolved',
    time: '10:15:00',
    source: 'Internal',
    targetIP: '10.0.3.25',
    attackerIP: 'N/A',
    assignedTo: 'А. Соколов',
    severity: 88,
    mitreAttack: ['T1204', 'T1059'],
    timeline: [
      { id: '1', time: '10:15:00', title: 'EDR Alert', subtitle: 'Trojan.GenericKD', status: 'critical' },
      { id: '2', time: '10:20:00', title: 'Host isolated', subtitle: 'Network team', status: 'primary' },
      { id: '3', time: '11:00:00', title: 'Cleaned', subtitle: 'Malware removed', status: 'success' },
    ],
    logs: [
      '[10:15:00] EDR: Trojan.GenericKD.46821234',
      '[10:15:05] FILE: C:\\Users\\...\\update.exe',
      '[10:20:00] ACTION: Host isolated',
      '[11:00:00] STATUS: Remediated',
    ],
  },
]

// Stats data with animation values
const statsData = [
  {
    title: 'Всего инцидентов',
    value: 1284,
    change: '+12%',
    trend: 'up' as const,
    icon: BarChart2,
    iconColor: 'text-primary',
    barColor: 'bg-primary',
    barWidth: 75,
    changeColor: 'text-green-400',
  },
  {
    title: 'Активные угрозы',
    value: 42,
    change: '+5%',
    trend: 'up' as const,
    icon: AlertTriangle,
    iconColor: 'text-red-400',
    barColor: 'bg-red-400',
    barWidth: 42,
    changeColor: 'text-red-400',
  },
  {
    title: 'Разрешено (24ч)',
    value: 1150,
    change: '-8%',
    trend: 'down' as const,
    icon: CheckCircle,
    iconColor: 'text-green-400',
    barColor: 'bg-green-400',
    barWidth: 90,
    changeColor: 'text-slate-400',
  },
  {
    title: 'Отклик (мин)',
    value: 14.2,
    change: '-2.1',
    trend: 'down' as const,
    icon: Timer,
    iconColor: 'text-yellow-400',
    barColor: 'bg-yellow-400',
    barWidth: 60,
    changeColor: 'text-green-400',
  },
]

const priorityStyles: Record<Priority, string> = {
  Critical: 'bg-red-400/10 text-red-400 border-red-400/20',
  High: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
  Medium: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  Low: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
}

const statusStyles: Record<Status, { dot: string; text: string; bg: string }> = {
  New: { dot: 'bg-red-400', text: 'text-slate-300', bg: 'bg-red-400/5' },
  'In Progress': { dot: 'bg-blue-400', text: 'text-slate-300', bg: 'bg-blue-400/5' },
  Investigating: { dot: 'bg-purple-400', text: 'text-slate-300', bg: 'bg-purple-400/5' },
  Resolved: { dot: 'bg-green-400', text: 'text-slate-300', bg: 'bg-green-400/5' },
  'False Positive': { dot: 'bg-slate-400', text: 'text-slate-300', bg: 'bg-slate-400/5' },
}

const typeIcons: Record<IncidentType, React.ElementType> = {
  'DDoS Attack': Globe,
  'SQL Injection': Server,
  'Brute Force': Lock,
  'Data Exfiltration': ArrowUpRight,
  Malware: AlertTriangle,
  Phishing: Target,
  XSS: Code,
  Ransomware: Ban,
}

// Simple Code icon fallback
function Code({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

// Toast notification component
interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={cn(
              'px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px]',
              toast.type === 'success' && 'bg-green-500/90 text-white',
              toast.type === 'error' && 'bg-red-500/90 text-white',
              toast.type === 'warning' && 'bg-yellow-500/90 text-black',
              toast.type === 'info' && 'bg-primary/90 text-black'
            )}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'error' && <X className="w-5 h-5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
            {toast.type === 'info' && <Bell className="w-5 h-5" />}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button onClick={() => onRemove(toast.id)} className="hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Animated counter
function AnimatedCounter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1000
    const startTime = Date.now()
    const startValue = displayValue

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (value - startValue) * easeOut

      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  return <span>{displayValue.toFixed(decimals)}</span>
}

// Stat Card with animations
function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  iconColor,
  barColor,
  barWidth,
  changeColor,
  index,
}: {
  title: string
  value: number
  change: string
  trend: 'up' | 'down'
  icon: React.ElementType
  iconColor: string
  barColor: string
  barWidth: number
  changeColor: string
  index: number
}) {
  const isDecimal = title.includes('Отклик')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-panel-light border border-white/5 p-5 rounded-xl flex flex-col gap-1 hover:border-primary/30 transition-colors relative overflow-hidden group"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
      />

      <div className="flex justify-between items-start mb-2 relative z-10">
        <span className="text-slate-400 text-sm font-medium">{title}</span>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Icon className={cn('w-5 h-5', iconColor)} />
        </motion.div>
      </div>

      <div className="flex items-end gap-3 relative z-10">
        <h3 className="text-3xl font-bold text-white">
          <AnimatedCounter value={value} decimals={isDecimal ? 1 : 0} />
          {isDecimal && <span className="text-lg ml-1">мин</span>}
        </h3>
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn('text-sm font-bold flex items-center gap-0.5 mb-1', changeColor)}
        >
          {change}
          {trend === 'up' ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
        </motion.span>
      </div>

      <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden relative z-10">
        <motion.div
          className={cn('h-full', barColor)}
          initial={{ width: 0 }}
          animate={{ width: `${barWidth}%` }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

// Filter dropdown
function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-2"
      >
        <Filter className="w-3.5 h-3.5" />
        {label}: {value || 'Все'}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <X className="w-3 h-3 rotate-45" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 bg-panel-light border border-white/10 rounded-xl overflow-hidden shadow-xl z-20 min-w-[150px]"
          >
            <button
              onClick={() => {
                onChange('')
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-left text-xs hover:bg-white/5 transition-colors text-slate-300"
            >
              Все
            </button>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full px-4 py-2 text-left text-xs hover:bg-white/5 transition-colors',
                  value === option ? 'text-primary' : 'text-slate-300'
                )}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Action button with animation
function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = 'default',
}: {
  icon: React.ElementType
  label: string
  onClick: () => void
  variant?: 'default' | 'success' | 'warning' | 'danger'
}) {
  const variants = {
    default: 'bg-slate-800 hover:bg-slate-700 text-slate-300',
    success: 'bg-green-500/20 hover:bg-green-500/30 text-green-400',
    warning: 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors',
        variants[variant]
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </motion.button>
  )
}

// Export Modal Component
function ExportModal({
  isOpen,
  onClose,
  onExport,
  isExporting,
  totalIncidents,
  filteredCount,
}: {
  isOpen: boolean
  onClose: () => void
  onExport: (options: ExportOptions) => void
  isExporting: boolean
  totalIncidents: number
  filteredCount: number
}) {
  const [exportScope, setExportScope] = useState<'all' | 'filtered'>('filtered')
  const [includeDetails, setIncludeDetails] = useState(true)
  const [includeLogs, setIncludeLogs] = useState(true)
  const [includeTimeline, setIncludeTimeline] = useState(true)

  if (!isOpen) return null

  const handleExport = () => {
    onExport({
      scope: exportScope,
      includeDetails,
      includeLogs,
      includeTimeline,
    })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="bg-panel-light border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/5 bg-slate-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Экспорт отчёта</h3>
                  <p className="text-xs text-slate-400">PDF документ с инцидентами</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="size-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Scope Selection */}
            <div>
              <label className="text-sm font-semibold text-white mb-3 block">
                Объём экспорта
              </label>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setExportScope('filtered')}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border text-left transition-all',
                    exportScope === 'filtered'
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-slate-800/50 border-white/5 hover:border-white/10'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Отфильтрованные</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {filteredCount} инцидентов с учётом фильтров
                      </p>
                    </div>
                    <div
                      className={cn(
                        'size-5 rounded-full border-2 flex items-center justify-center',
                        exportScope === 'filtered' ? 'border-primary' : 'border-slate-600'
                      )}
                    >
                      {exportScope === 'filtered' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="size-2.5 rounded-full bg-primary"
                        />
                      )}
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setExportScope('all')}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border text-left transition-all',
                    exportScope === 'all'
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-slate-800/50 border-white/5 hover:border-white/10'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Все инциденты</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {totalIncidents} инцидентов без фильтров
                      </p>
                    </div>
                    <div
                      className={cn(
                        'size-5 rounded-full border-2 flex items-center justify-center',
                        exportScope === 'all' ? 'border-primary' : 'border-slate-600'
                      )}
                    >
                      {exportScope === 'all' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="size-2.5 rounded-full bg-primary"
                        />
                      )}
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Options */}
            <div>
              <label className="text-sm font-semibold text-white mb-3 block">
                Содержимое отчёта
              </label>
              <div className="space-y-2">
                {[
                  { label: 'Детали инцидентов', checked: includeDetails, onChange: setIncludeDetails },
                  { label: 'Логи событий', checked: includeLogs, onChange: setIncludeLogs },
                  { label: 'Хронология действий', checked: includeTimeline, onChange: setIncludeTimeline },
                ].map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => option.onChange(!option.checked)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-white/5 flex items-center justify-between hover:border-white/10 transition-all"
                  >
                    <span className="text-sm text-slate-300">{option.label}</span>
                    <div
                      className={cn(
                        'size-5 rounded-md flex items-center justify-center transition-colors',
                        option.checked ? 'bg-primary' : 'bg-slate-700'
                      )}
                    >
                      {option.checked && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/5 bg-slate-800/20 flex gap-3">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-cyan-400 transition-colors disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Генерация...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Скачать PDF
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

interface ExportOptions {
  scope: 'all' | 'filtered'
  includeDetails: boolean
  includeLogs: boolean
  includeTimeline: boolean
}

// Main component
export function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isLive, setIsLive] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Add toast
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  // Remove toast
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Filter incidents
  const filteredIncidents = useMemo(() => {
    return incidentsData.filter((incident) => {
      const matchesSearch =
        incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = !priorityFilter || incident.priority === priorityFilter
      const matchesStatus = !statusFilter || incident.status === statusFilter
      return matchesSearch && matchesPriority && matchesStatus
    })
  }, [searchQuery, priorityFilter, statusFilter])

  // Refresh simulation
  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((r) => setTimeout(r, 1500))
    setRefreshing(false)
    addToast('Данные обновлены', 'success')
  }

  // Actions
  const handleResolve = (incident: Incident) => {
    addToast(`Инцидент ${incident.id} разрешён`, 'success')
    setSelectedIncident(null)
  }

  const handleEscalate = (incident: Incident) => {
    addToast(`Инцидент ${incident.id} эскалирован L3`, 'warning')
  }

  const handleAssign = (incident: Incident) => {
    addToast(`Инцидент ${incident.id} назначен аналитику`, 'info')
  }

  // Export function
  const handleExport = async (options: ExportOptions) => {
    setIsExporting(true)

    try {
      const incidentsToExport = options.scope === 'all' ? incidentsData : filteredIncidents

      // Prepare data for export
      const exportData = incidentsToExport.map((inc) => ({
        ...inc,
        logs: options.includeLogs ? inc.logs : [],
        timeline: options.includeTimeline ? inc.timeline : [],
      }))

      const stats = {
        total: incidentsData.length,
        active: incidentsData.filter((i) => i.status === 'New' || i.status === 'In Progress').length,
        resolved: incidentsData.filter((i) => i.status === 'Resolved').length,
        responseTime: 14.2,
      }

      // Call API to generate PDF
      const response = await fetch('/api/export-incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incidents: exportData,
          stats,
          options,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      // Download the PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `incident-report-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setIsExportModalOpen(false)
      addToast('PDF отчёт успешно скачан', 'success')
    } catch (error) {
      console.error('Export error:', error)
      addToast('Ошибка при генерации PDF', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  // Live update simulation
  useEffect(() => {
    if (!isLive) return
    const interval = setInterval(() => {
      // Simulate random updates
      if (Math.random() > 0.7) {
        addToast('Обнаружен новый инцидент!', 'warning')
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [isLive])

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Управление инцидентами</h2>
          <div className="h-4 w-[1px] bg-slate-700" />
          <div className="flex items-center gap-2 text-slate-400">
            <motion.div
              animate={{ scale: isLive ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 1, repeat: isLive ? Infinity : 0 }}
            >
              <Activity className={cn('w-4 h-4', isLive && 'text-green-400')} />
            </motion.div>
            <span className="text-xs">
              {isLive ? 'Live Updates' : 'Пауза'} • 2 мин. назад
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              className="bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:ring-primary focus:border-primary w-64 transition-all focus:w-80"
              placeholder="Поиск инцидентов..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLive(!isLive)}
            className={cn(
              'size-10 rounded-xl flex items-center justify-center transition-colors',
              isLive ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-300'
            )}
          >
            {isLive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRefresh}
            className="size-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors relative"
          >
            <RefreshCw className={cn('w-5 h-5', refreshing && 'animate-spin')} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="size-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 size-2 bg-red-400 rounded-full border-2 border-slate-800" />
          </motion.button>
          <div className="h-8 w-8 rounded-full bg-slate-700 border border-slate-600 overflow-hidden">
            <img src="/avatar.jpg" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </motion.header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Main Grid: Table and Details */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Incidents Table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 min-w-0 bg-panel-light border border-white/5 rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-slate-800/20">
            <div className="flex items-center gap-3">
              <h4 className="text-white font-bold">Последние события</h4>
              <motion.span
                animate={{ scale: isLive ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 1.5, repeat: isLive ? Infinity : 0 }}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase flex items-center gap-1"
              >
                <span className="size-1.5 bg-red-400 rounded-full animate-pulse" />
                Live
              </motion.span>
            </div>
            <div className="flex gap-2 items-center">
              <FilterDropdown
                label="Приоритет"
                options={['Critical', 'High', 'Medium', 'Low']}
                value={priorityFilter}
                onChange={setPriorityFilter}
              />
              <FilterDropdown
                label="Статус"
                options={['New', 'In Progress', 'Investigating', 'Resolved', 'False Positive']}
                value={statusFilter}
                onChange={setStatusFilter}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExportModalOpen(true)}
                className="px-3 py-1.5 bg-primary text-black rounded-lg text-xs font-bold hover:bg-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Экспорт
              </motion.button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-slate-800/40 border-b border-white/5 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Приоритет
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Время
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {filteredIncidents.map((incident, index) => {
                    const TypeIcon = typeIcons[incident.type] || AlertCircle
                    return (
                      <motion.tr
                        key={incident.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedIncident(incident)}
                        className={cn(
                          'cursor-pointer transition-colors group relative',
                          selectedIncident?.id === incident.id
                            ? 'bg-primary/10 border-l-4 border-l-primary'
                            : 'hover:bg-primary/5'
                        )}
                      >
                        <td className="px-6 py-4 font-mono text-xs text-primary">
                          #{incident.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'size-8 rounded-lg flex items-center justify-center',
                                incident.priority === 'Critical'
                                  ? 'bg-red-400/20'
                                  : incident.priority === 'High'
                                    ? 'bg-orange-400/20'
                                    : 'bg-slate-700'
                              )}
                            >
                              <TypeIcon
                                className={cn(
                                  'w-4 h-4',
                                  incident.priority === 'Critical'
                                    ? 'text-red-400'
                                    : incident.priority === 'High'
                                      ? 'text-orange-400'
                                      : 'text-slate-400'
                                )}
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-white">
                                {incident.type}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {incident.description}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              'px-2 py-1 rounded text-[10px] font-bold uppercase border',
                              priorityStyles[incident.priority]
                            )}
                          >
                            {incident.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <motion.span
                              animate={{
                                scale:
                                  incident.status === 'New'
                                    ? [1, 1.2, 1]
                                    : 1,
                              }}
                              transition={{ duration: 1, repeat: incident.status === 'New' ? Infinity : 0 }}
                              className={cn('size-2 rounded-full', statusStyles[incident.status]?.dot)}
                            />
                            <span
                              className={cn('text-sm', statusStyles[incident.status]?.text)}
                            >
                              {incident.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{incident.time}</td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Details Panel */}
        <AnimatePresence mode="wait">
          {selectedIncident ? (
            <motion.div
              key={selectedIncident.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full xl:w-96 shrink-0 bg-panel-light border border-white/5 rounded-xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 bg-slate-800/30">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-primary mb-1 block">
                      Детали инцидента
                    </span>
                    <h4 className="text-lg font-bold text-white">#{selectedIncident.id}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-[10px] font-bold uppercase border',
                        priorityStyles[selectedIncident.priority]
                      )}
                    >
                      {selectedIncident.priority}
                    </span>
                    <button
                      onClick={() => setSelectedIncident(null)}
                      className="size-6 rounded bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Severity Meter */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Severity Score
                    </span>
                    <span className="text-xs font-bold text-white">{selectedIncident.severity}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedIncident.severity}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={cn(
                        'h-full rounded-full',
                        selectedIncident.severity >= 90
                          ? 'bg-red-400'
                          : selectedIncident.severity >= 70
                            ? 'bg-orange-400'
                            : 'bg-yellow-400'
                      )}
                    />
                  </div>
                </div>

                {/* MITRE ATT&CK */}
                {selectedIncident.mitreAttack && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedIncident.mitreAttack.map((technique) => (
                      <span
                        key={technique}
                        className="px-2 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-mono rounded border border-purple-500/20"
                      >
                        {technique}
                      </span>
                    ))}
                  </div>
                )}

                {/* Frequency Chart */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Частота (24ч)
                  </p>
                  <div className="h-16 flex items-end gap-1">
                    {[40, 60, 85, 70, 30, 50, 95].map((height, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                        className={cn(
                          'flex-1 rounded-t transition-colors',
                          height > 70 ? 'bg-primary' : 'bg-slate-800'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Target IP</p>
                    <p className="text-xs font-semibold text-white font-mono">
                      {selectedIncident.targetIP}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Attacker IP</p>
                    <p className="text-xs font-semibold text-white font-mono">
                      {selectedIncident.attackerIP}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Источник</p>
                    <p className="text-xs font-semibold text-white">{selectedIncident.source}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Аналитик</p>
                    <p className="text-xs font-semibold text-white">
                      {selectedIncident.assignedTo || 'Не назначен'}
                    </p>
                  </div>
                </div>

                {/* Raw Logs */}
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Сырые логи
                  </p>
                  <div className="bg-black/40 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-emerald-400 leading-relaxed overflow-x-auto max-h-32 overflow-y-auto custom-scrollbar">
                    {selectedIncident.logs.map((log, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {log}
                      </motion.p>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Хронология действий
                  </p>
                  <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                    {selectedIncident.timeline.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3 relative z-10"
                      >
                        <div
                          className={cn(
                            'size-4 rounded-full border-4 border-panel-light mt-1 shrink-0',
                            item.status === 'critical' && 'bg-red-400',
                            item.status === 'primary' && 'bg-primary',
                            item.status === 'success' && 'bg-green-400',
                            item.status === 'pending' && 'bg-slate-700',
                            item.status === 'warning' && 'bg-yellow-400'
                          )}
                        />
                        <div>
                          <p className="text-xs font-bold text-white">{item.title}</p>
                          <p className="text-[10px] text-slate-500">
                            {item.time} {item.subtitle && `- ${item.subtitle}`}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <ActionButton
                    icon={CheckCircle2}
                    label="Разрешить"
                    onClick={() => handleResolve(selectedIncident)}
                    variant="success"
                  />
                  <ActionButton
                    icon={ArrowUpRight}
                    label="Эскалировать"
                    onClick={() => handleEscalate(selectedIncident)}
                    variant="warning"
                  />
                  <ActionButton
                    icon={UserPlus}
                    label="Назначить"
                    onClick={() => handleAssign(selectedIncident)}
                  />
                  <ActionButton icon={Eye} label="Расследовать" onClick={() => {}} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full xl:w-96 shrink-0 bg-panel-light border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-16 h-16 text-slate-700 mb-4" />
              </motion.div>
              <h4 className="text-lg font-bold text-white mb-2">Выберите инцидент</h4>
              <p className="text-sm text-slate-400">
                Кликните на инцидент в таблице для просмотра деталей
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        isExporting={isExporting}
        totalIncidents={incidentsData.length}
        filteredCount={filteredIncidents.length}
      />
    </div>
  )
}
