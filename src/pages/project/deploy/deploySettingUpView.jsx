import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from 'src/theme/ThemeProvider'
import {
    Card,
    Steps,
    Spin,
} from 'antd'
import {
    CloudServerOutlined,
    DatabaseOutlined,
    SettingOutlined,
    CloudDownloadOutlined,
    LoadingOutlined,
    RocketOutlined,
} from '@ant-design/icons'
import * as deployAPI from 'src/api/deploy'
import { PATHS } from 'src/constants/paths'
// BackgroundShapes removed
import { useSpring, animated } from '@react-spring/web'
const settingUpProgress = [
    {
        title: (
            <span className="text-[var(--text)]">
                Initialize Virtual Environment
            </span>
        ),
        description: (
            <span className="text-slate-400">
                Set up a clean Python virtual environment to isolate project
                dependencies and prevent conflicts.
            </span>
        ),
    },
    {
        title: (
            <span className="text-[var(--text)]">
                Updating Operating System
            </span>
        ),
        description: (
            <span className="text-slate-400">
                Update system packages and apply the latest patches to
                ensure compatibility and security.
            </span>
        ),
    },
    {
        title: (
            <span className="text-[var(--text)]">Installing Tools</span>
        ),
        description: (
            <span className="text-slate-400">
                Install essential development tools such as compilers,
                package managers, and utilities.
            </span>
        ),
    },
    {
        title: (
            <span className="text-[var(--text)]">
                Installing Dependencies
            </span>
        ),
        description: (
            <span className="text-slate-400">
                Download and configure required libraries and frameworks
                from the requirements list.
            </span>
        ),
    },
    {
        title: (
            <span className="text-[var(--text)]">
                Cleaning up conflicting packages
            </span>
        ),
        description: (
            <span className="text-slate-400">
                Uninstall or adjust conflicting packages to ensure smooth
                execution of the environment.
            </span>
        ),
    },
]

const selectingInstanceProgress = [
    {
        title: (
            <span className="text-[var(--text)]">
                Querying Machine
            </span>
        ),
        description: (
            <span className="text-slate-400">
                Searching for a suitable machine to deploy your application efficiently.
            </span>
        ),
    },
    {
        title: (
            <span className="text-[var(--text)]">
                Initialize SSH Protocol
            </span>
        ),
        description: (
            <span className="text-slate-400">
                Set up a secure SSH connection to access and manage the remote machine.
            </span>
        ),
    },
    {
        title: (
            <span className="text-[var(--text)]">Installing Tools</span>
        ),
        description: (
            <span className="text-slate-400">
                Install necessary development tools and utilities required for deployment.
            </span>
        ),
    }
];


const downloadModelProgress = [
    {
        title: (
            <span className="text-[var(--text)]">
                Downloading Model from Cloud Storage
            </span>
        ),
        description: (
            <span className="text-slate-400">
                Retrieving the required model files from cloud storage to your local or remote environment.
            </span>
        ),
    }
];

const initServerProgress = [
    {
        title: (
            <span className="text-[var(--text)]">
                Setting up your server
            </span>
        ),
        description: (
            <span className="text-slate-400">
                Starting model prediction server on port 8680
            </span>
        ),
    }
]


export default function DeploySettingUpView() {
    const getCurrentStep = (status) => {
        switch (status) {
            case 'CREATING_INSTANCE':
                return 0
            case 'SETTING_UP':
                return 1
            case 'DOWNLOADING_MODEL':
                return 2
            case 'OFFLINE':
                return 3
            default:
                return 0
        }
    }

    const getProgressSteps = (status) => {
        switch (status) {
            case 'CREATING_INSTANCE':
                return selectingInstanceProgress
            case 'SETTING_UP':
                return settingUpProgress
            case 'DOWNLOADING_MODEL':
                return downloadModelProgress
            case 'OFFLINE':
                return initServerProgress
            default:
                return []
        }
    }
    const { theme } = useTheme()
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const deployId = searchParams.get('deployId')
    const { id: projectId } = useParams()
    const navigate = useNavigate()
    const [deployStatus, setDeployStatus] = useState("CREATING_INSTANCE")
    const [currentStep, setCurrentStep] = useState(getCurrentStep(deployStatus))
    const [currentSettingUpStep, setCurrentSettingUpStep] = useState(-1)

    useEffect(() => {
        if (!deployId) return;

        const fetchDeployData = async () => {
            try {
                const deployModelRes = await deployAPI.getDeployData(deployId)
                console.log("Current status:", deployModelRes.data)
                if (deployModelRes.data?.status !== deployStatus) {
                    setCurrentSettingUpStep(prev => 0);
                }
                else {
                    setCurrentSettingUpStep(prev => prev + 1);
                }
                setDeployStatus(deployModelRes.data?.status || 'CREATING_INSTANCE')
                setCurrentStep(getCurrentStep(deployModelRes.data?.status || 0))
                if (deployModelRes.data.status === 'ONLINE') {
                    navigate(PATHS.MODEL_DEPLOY_VIEW(projectId, deployId))
                    return
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchDeployData();
        const interval = setInterval(fetchDeployData, 30000);
        return () => clearInterval(interval);
    }, [deployId, deployStatus, navigate, projectId]);


    return (
        <>
            <style>{`
                body, html {
                    background-color: var(--surface) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
            `}</style>
            <div
                className="relative min-h-screen bg-[var(--surface)]"
            >
                {/* BackgroundShapes removed */}
                <div className="relative z-10 p-6">
                    <animated.div
                        style={useSpring({
                            from: { opacity: 0, transform: 'translateY(20px)' },
                            to: { opacity: 1, transform: 'translateY(0)' },
                            config: { tension: 280, friction: 20 },
                        })}
                    >
                        <div className="flex flex-col w-full gap-6">
                            <h2 className="m-0 flex items-center text-xl font-semibold font-poppins text-[var(--text)]">
                                <RocketOutlined
                                    className="mr-2 text-[20px] text-[var(--secondary-text)]"
                                />
                                Deployment Preparation
                            </h2>
                            <Steps
                                current={currentStep}
                                items={[
                                    {
                                        title: (
                                            <span className="text-[var(--text)]">
                                                Creating Instance
                                            </span>
                                        ),
                                        icon:
                                            currentStep !== 0 ? (
                                                <DatabaseOutlined className="text-[var(--secondary-text)]" />
                                            ) : (
                                                <LoadingOutlined className="text-[var(--secondary-text)]" />
                                            ),
                                        description: (
                                            <span className="text-slate-400">
                                                Selecting suitable machine for
                                                you
                                            </span>
                                        ),
                                    },
                                    {
                                        title: (
                                            <span className="text-[var(--text)]">
                                                Downloading Dependencies
                                            </span>
                                        ),
                                        icon:
                                            currentStep !== 1 ? (
                                                <SettingOutlined className="text-[var(--secondary-text)]" />
                                            ) : (
                                                <LoadingOutlined className="text-[var(--secondary-text)]" />
                                            ),
                                        description: (
                                            <span className="text-slate-400">
                                                Setting up your machine
                                            </span>
                                        ),
                                    },
                                    {
                                        title: (
                                            <span className="text-[var(--text)]">
                                                Downloading Model
                                            </span>
                                        ),
                                        icon:
                                            currentStep !== 2 ? (
                                                <CloudDownloadOutlined className="text-[var(--secondary-text)]" />
                                            ) : (
                                                <LoadingOutlined className="text-[var(--secondary-text)]" />
                                            ),
                                        description: (
                                            <span className="text-slate-400">
                                                Fetching model from cloud storage
                                            </span>
                                        ),
                                    },
                                    {
                                        title: (
                                            <span className="text-[var(--text)]">
                                                Initializing Server
                                            </span>
                                        ),
                                        icon:
                                            currentStep !== 3 ? (
                                                <CloudServerOutlined className="text-[var(--secondary-text)]" />
                                            ) : (
                                                <LoadingOutlined className="text-[var(--secondary-text)]" />
                                            ),
                                        description: (
                                            <span className="text-slate-400">
                                                Serving your model
                                            </span>
                                        ),
                                    }
                                ]}
                            />
                            <Card
                                title={
                                    <h2 className="m-0 flex items-center text-xl font-semibold font-poppins text-[var(--text)]">
                                        <SettingOutlined
                                            className="mr-2 text-[var(--secondary-text)]"
                                        />
                                        Current Step Progress
                                    </h2>
                                }
                                className="border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                                style={{
                                    background: 'var(--card-gradient)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    fontFamily: 'Poppins, sans-serif',
                                }}
                            >
                                <Steps
                                    progressDot={(
                                        dot,
                                        { status, index }
                                    ) => {
                                        if (
                                            index === currentSettingUpStep
                                        ) {
                                            return <Spin size="small" />
                                        }
                                        return dot
                                    }}
                                    current={currentSettingUpStep}
                                    direction="vertical"
                                    items={getProgressSteps(deployStatus)}
                                />
                            </Card>
                        </div>
                    </animated.div>
                </div>
            </div>
        </>
    )
}
