import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { PATHS } from 'src/constants/paths'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge } from 'src/components/ui/badge'
import { Button } from 'src/components/ui/button'
import {
  Boxes,
  Cloud,
  ExternalLink,
  LoaderCircle,
  Server,
  Square,
  Settings,
} from 'lucide-react'

dayjs.extend(relativeTime)

type StatusKey = 'ONLINE' | 'OFFLINE' | 'SETTING_UP' | 'SELECTING_INSTANCE' | 'DOWNLOADING_MODEL' | 'FAILED'

const STATUS_CONFIG: Record<StatusKey, {
  badge: string
  bar: string
  icon: React.ReactNode
  label: string
}> = {
  ONLINE: {
    label: 'Online',
    badge: 'rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
    bar: 'border-emerald-400/50',
    icon: <Server className="size-5" />,
  },
  OFFLINE: {
    label: 'Offline',
    badge: 'rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:bg-white/10 dark:text-gray-400',
    bar: 'border-gray-200',
    icon: <Square className="size-5" />,
  },
  SETTING_UP: {
    label: 'Setting Up',
    badge: 'rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
    bar: 'border-amber-400/50',
    icon: <LoaderCircle className="size-5 animate-spin" />,
  },
  SELECTING_INSTANCE: {
    label: 'Selecting Instance',
    badge: 'rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
    bar: 'border-amber-400/50',
    icon: <LoaderCircle className="size-5 animate-spin" />,
  },
  DOWNLOADING_MODEL: {
    label: 'Downloading',
    badge: 'rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
    bar: 'border-blue-400/50',
    icon: <Cloud className="size-5" />,
  },
  FAILED: {
    label: 'Failed',
    badge: 'rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400',
    bar: 'border-red-400/50',
    icon: <Boxes className="size-5" />,
  },
}

const DEFAULT_STATUS = {
  label: 'Unknown',
  badge: 'rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:bg-white/10 dark:text-gray-400',
  bar: 'border-gray-200 dark:border-white/10',
  icon: <Settings className="size-5" />,
}

export default function DeployedModelCard({ deployedModel }) {
  const { id: projectId } = useParams()
  const { id: deploy_id, model_id, name, create_time, status, api_base_url } = deployedModel
  const navigate = useNavigate()
  const cfg = STATUS_CONFIG[status as StatusKey] ?? DEFAULT_STATUS
  const isClickable = status !== 'FAILED'

  const handleCardClick = () => {
    if (status === 'FAILED') {
      window.alert('Cannot use failed deployment!')
      return
    }
    navigate(
      status === 'ONLINE' || status === 'OFFLINE'
        ? PATHS.MODEL_DEPLOY_VIEW(projectId, deploy_id)
        : PATHS.SETTING_UP_DEPLOY(projectId, deploy_id),
    )
  }

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow transition duration-300 dark:bg-slate-900 ${cfg.bar} ${isClickable ? 'cursor-pointer hover:-translate-y-1 hover:shadow-md' : 'cursor-default opacity-75'}`}
      onClick={handleCardClick}
    >
      {/* Top accent bar */}
      <div
        className={`h-1 w-full shrink-0 ${
          status === 'ONLINE'
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
            : status === 'FAILED'
              ? 'bg-gradient-to-r from-red-500 to-red-400'
              : status === 'OFFLINE'
                ? 'bg-gradient-to-r from-gray-300 to-gray-200 dark:from-white/20 dark:to-white/10'
                : 'bg-gradient-to-r from-blue-500 to-blue-400'
        }`}
      />

      <div className="flex flex-1 flex-col px-5 py-4">
        {/* Status badge + icon row */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:border-white/10 dark:from-blue-500/15 dark:to-blue-600/10">
            <span className={`${status === 'ONLINE' ? 'text-emerald-500 dark:text-emerald-400' : status === 'FAILED' ? 'text-red-500 dark:text-red-400' : 'text-blue-500 dark:text-blue-400'}`}>
              {cfg.icon}
            </span>
          </div>
          <Badge className={cfg.badge}>
            {(status === 'SETTING_UP' || status === 'SELECTING_INSTANCE' || status === 'DOWNLOADING_MODEL') && (
              <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-amber-500" />
            )}
            {cfg.label}
          </Badge>
        </div>

        {/* Name */}
        <h2 className="mb-1 truncate text-base font-bold leading-tight text-gray-900 dark:text-white">
          {name}
        </h2>

        {/* Divider */}
        <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10" />

        {/* Meta */}
        <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 dark:text-gray-500">Model ID</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{model_id}</span>
          </div>
          {create_time && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 dark:text-gray-500">Deployed</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {dayjs(create_time).fromNow()}
              </span>
            </div>
          )}
          {api_base_url && (
            <div className="mt-1">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-7 w-full justify-start rounded-lg px-2 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                onClick={(e) => e.stopPropagation()}
              >
                <a href={api_base_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1.5 size-3 shrink-0" />
                  <span className="truncate">{api_base_url}</span>
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
