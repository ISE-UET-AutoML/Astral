import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { PATHS } from 'src/constants/paths'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Boxes,
    Cloud,
    LoaderCircle,
    Server,
    Settings,
    Square,
} from 'lucide-react'

dayjs.extend(relativeTime)

const getStatusConfig = (status) => {
    switch (status) {
        case 'ONLINE':
            return {
                color: 'text-green-400',
                borderColor: 'border-green-500/20',
                icon: <Server className="h-6 w-6" />,
                badge: 'Online',
            }
        case 'OFFLINE':
            return {
                color: 'text-red-400',
                borderColor: 'border-red-500/20',
                icon: <Square className="h-6 w-6" />,
                badge: 'Offline',
            }
        case 'SETTING_UP':
            return {
                color: 'text-orange-400',
                borderColor: 'border-orange-500/20',
                icon: <LoaderCircle className="h-6 w-6 animate-spin" />,
                badge: 'Setting Up',
            }
        case 'SELECTING_INSTANCE':
            return {
                color: 'text-orange-400',
                borderColor: 'border-orange-500/20',
                icon: <LoaderCircle className="h-6 w-6 animate-spin" />,
                badge: 'Selecting Instance',
            }
        case 'DOWNLOADING_MODEL':
            return {
                color: 'text-blue-400',
                borderColor: 'border-blue-500/20',
                icon: <Cloud className="h-6 w-6" />,
                badge: 'Downloading',
            }
        case 'FAILED':
            return {
                color: 'text-red-400',
                borderColor: 'border-red-500/20',
                icon: <Boxes className="h-6 w-6" />,
                badge: 'Failed',
            }
        default:
            return {
                color: 'text-gray-400',
                borderColor: 'border-gray-500/20',
                icon: <Settings className="h-6 w-6" />,
                badge: 'Unknown',
            }
    }
}

export default function DeployedModelCard({ deployedModel }) {
    const { id: projectId } = useParams()
    const { id: deploy_id, model_id, name, create_time, status, api_base_url } = deployedModel
    const navigate = useNavigate()
    const statusConfig = getStatusConfig(status)

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
        <Card
            className="group cursor-pointer rounded-2xl border border-[var(--border)] [background:var(--card-gradient)] shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
            onClick={handleCardClick}
        >
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="rounded-xl bg-[var(--hover-bg)] p-3">
                        <div className={statusConfig.color}>
                            {statusConfig.icon}
                        </div>
                    </div>
                    <div className={`rounded-full border px-3 py-1 text-xs font-medium ${statusConfig.borderColor} bg-[var(--hover-bg)] text-[var(--text)]`}>
                        {statusConfig.badge}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <CardTitle className="mb-3 text-lg font-semibold text-[var(--text)] transition-colors">
                    {name}
                </CardTitle>

                <div className="space-y-2 text-sm text-[var(--secondary-text)]">
                    {create_time && (
                        <p className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary-text)]" />
                            Created {dayjs(create_time).fromNow()}
                        </p>
                    )}
                    {api_base_url && (
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary-text)]" />
                            <a
                                href={api_base_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(event) => event.stopPropagation()}
                                className="truncate text-[var(--accent-text)] underline"
                            >
                                {api_base_url}
                            </a>
                        </div>
                    )}
                    <p className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary-text)]" />
                        Model ID: {model_id}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
