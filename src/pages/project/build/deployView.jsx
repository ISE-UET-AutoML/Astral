import React, { useState } from 'react'
import {
    useLocation,
    useOutletContext,
    useNavigate,
    useParams,
} from 'react-router-dom'
import {
    Button,
    Badge,
    Tag,
} from 'antd'
import {
    RocketOutlined,
    ApiOutlined,
    DatabaseOutlined,
    ThunderboltOutlined,
    CloudDownloadOutlined,
    CheckCircleFilled,
} from '@ant-design/icons'
import { useSpring, animated } from '@react-spring/web'
import * as modelAPI from 'src/api/model'
import { PATHS } from 'src/constants/paths'

const AnimatedCard = ({ children, onClick, isSelected }) => {
    const [isHovered, setIsHovered] = useState(false)
    const styles = useSpring({
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered
            ? '0 8px 16px rgba(0,0,0,0.1)'
            : '0 2px 8px rgba(0,0,0,0.05)',
        config: { tension: 300, friction: 20 },
    })

    return (
        <animated.div
            style={{
                ...styles,
                borderWidth: 0,
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {children}
        </animated.div>
    )
}

const DeployView = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const { id: projectId } = useParams()
    const modelId = searchParams.get('modelId')
    const [isDeploying, setIsDeploying] = useState(false)
    const [selectedOption, setSelectedOption] = useState('')

    const deployOptions = [
        {
            id: 'realtime',
            title: 'Realtime Inference',
            description: 'Deploy for immediate, real-time predictions',
            icon: ThunderboltOutlined,
            tags: ['Low Latency', 'High Availability', 'Auto Scaling'],
            stats: {
                latency: '< 100ms',
                uptime: '99.99%',
                scalability: 'Automatic',
            },
            iconClass: 'text-3xl text-amber-400',
            chipBgClass: 'bg-amber-500/10',
            statColorClass: 'text-amber-400',
            tagColor: 'gold',
            badgeColor: 'gold',
            badge: 'RECOMMENDED',
        },
        {
            id: 'async',
            title: 'Asynchronous Processing',
            description: 'Optimal for handling large batch requests',
            icon: ApiOutlined,
            tags: ['High Throughput', 'Cost Effective', 'Durable'],
            stats: {
                throughput: '10K req/s',
                durability: '99.999%',
                cost: 'Medium',
            },
            iconClass: 'text-3xl text-emerald-400',
            chipBgClass: 'bg-emerald-500/10',
            statColorClass: 'text-emerald-400',
            tagColor: 'green',
            badgeColor: 'green',
        },
        {
            id: 'batch',
            title: 'Batch Transform',
            description: 'Process large datasets efficiently',
            icon: DatabaseOutlined,
            tags: ['Large Scale', 'Cost Optimized', 'Scheduled'],
            stats: {
                capacity: 'Unlimited',
                efficiency: '95%',
                schedule: 'Flexible',
            },
            iconClass: 'text-3xl text-sky-400',
            chipBgClass: 'bg-sky-500/10',
            statColorClass: 'text-sky-400',
            tagColor: 'blue',
            badgeColor: 'blue',
        },
        {
            id: 'serverless',
            title: 'Serverless Deployment',
            description: 'Pay-per-use with zero infrastructure management',
            icon: CloudDownloadOutlined,
            tags: ['Zero Maintenance', 'Auto Scaling', 'Cost Efficient'],
            stats: {
                scaling: 'Automatic',
                maintenance: 'Zero',
                billing: 'Per Request',
            },
            iconClass: 'text-3xl text-purple-400',
            chipBgClass: 'bg-purple-500/10',
            statColorClass: 'text-purple-400',
            tagColor: 'purple',
            badgeColor: 'purple',
        },
    ]

    const startDeployment = async () => {
        try {
            navigate(
                PATHS.SETTING_UP_DEPLOY(projectId, 'temp-deploy-id')
            )

            const deployRequest = await modelAPI.deployModel(modelId)
            console.log(deployRequest)
            if (deployRequest.status !== 200) {
                throw new Error('Failed to deploy model')
            }
            navigate(
                PATHS.SETTING_UP_DEPLOY(
                    projectId,
                    deployRequest.data?.model_deploy.id
                ),
                { replace: true }
            )
        } catch (e) {
            console.log(e)
        }
    }

    const handleCancel = () => {
        setIsDeploying(false)
        setSelectedOption('')
    }

    return (
        <div className="min-h-screen bg-[var(--surface)] px-6 py-6">
            <div className="mx-auto px-8 mt-16 space-y-6">
                <div className="rounded-2xl border border-[var(--border)] bg-white dark:bg-[#282828] py-10 px-16 shadow-[0_8px_32px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <RocketOutlined className="text-[28px] text-[var(--accent-text)]" />
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Deploy Model {modelId}
                            </h1>
                        </div>
                        <p className="text-[16px] text-gray-900 dark:text-white">
                            Choose your deployment option and launch your
                            application with our optimized infrastructure
                        </p>
                    </div>

                    <div className="mt-6 grid gap-10 md:grid-cols-2 px-4 mb-10">
                        {deployOptions.map((option) => {
                            const Icon = option.icon
                            const isSelected = selectedOption === option.id

                            return (
                                <div key={option.id}>
                                    <AnimatedCard
                                        isSelected={isSelected}
                                        onClick={() =>
                                            setSelectedOption(option.id)
                                        }
                                    >
                                        <div
                                            className={`h-full rounded-xl border border-[var(--border)] p-6 transition-all duration-300 ${
                                                isSelected
                                                    ? 'bg-blue-100 dark:bg-[#1e1e1e] dark:border-blue-400/80 dark:border-2'
                                                    : 'bg-white dark:bg-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#2f2f2f] hover:border-[var(--border-hover)] hover:shadow-lg'
                                            }`}
                                        >
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`rounded-lg p-3 ${option.chipBgClass}`}
                                                        >
                                                            <Icon
                                                                className={
                                                                    option.iconClass
                                                                }
                                                            />
                                                        </div>
                                                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                                            {option.title}
                                                        </h2>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                    
                                                    {option.badge && (
                                                        <Badge
                                                            count={option.badge}
                                                            color={
                                                                option.badgeColor
                                                            }
                                                            className="text-xs font-medium"
                                                        />
                                                    )}
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-700 dark:text-gray-200">
                                                    {option.description}
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    {option.tags.map((tag) => (
                                                        <Tag
                                                            key={tag}
                                                            color={
                                                                option.tagColor
                                                            }
                                                        >
                                                            {tag}
                                                        </Tag>
                                                    ))}
                                                </div>

                                                <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                                                    {Object.entries(
                                                        option.stats
                                                    ).map(([key, value]) => (
                                                        <div
                                                            key={key}
                                                            className="space-y-1"
                                                        >
                                                            <div className="font-semibold capitalize text-gray-900 dark:text-white">
                                                                {key}
                                                            </div>
                                                            <div
                                                                className={`font-medium ${option.statColorClass}`}
                                                            >
                                                                {value}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </AnimatedCard>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="flex justify-center gap-3">
                    <Button
                        type="default"
                        size="large"
                        onClick={handleCancel}
                        className="rounded-xl border border-[var(--border)] bg-[var(--input-bg)] px-6 py-2 font-semibold text-gray-900 dark:text-white shadow-sm hover:border-[var(--modal-close-hover)]"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        onClick={startDeployment}
                        disabled={!selectedOption}
                        className="deploy-btn-solid rounded-xl px-6 py-2 font-semibold shadow-md"
                    >
                        Deploy Now
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DeployView