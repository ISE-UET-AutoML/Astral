import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Card,
    Tag,
    Row,
    Col,
    Alert,
    Space,
    Statistic,
    Table,
    Button,
    Tooltip,
    Collapse,
    message
} from 'antd'

import {
    HistoryOutlined,
    CloudDownloadOutlined,
    TrophyOutlined,
    RocketOutlined,
    BarChartOutlined,
    InfoCircleOutlined,
    ExperimentOutlined,
} from '@ant-design/icons'

import * as mlServiceAPI from 'src/api/mlService'
import * as modelServiceAPI from 'src/api/model'
import BackgroundShapes from 'src/components/features/landing/BackgroundShapes'
import { useTheme } from 'src/theme/ThemeProvider'

const { Panel } = Collapse;

// Performance Metrics Configuration
const getAccuracyStatus = (score) => {
    if (score >= 0.9) {
        return <Tag className="bg-gradient-to-br from-[#10b981] to-[#34d399] border-none text-white font-poppins">Excellent</Tag>
    }
    else if (score >= 0.7) {
        return <Tag className="bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] border-none text-white font-poppins">Good</Tag>
    }
    else if (score >= 0.6) {
        return <Tag className="bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] border-none text-white font-poppins">Medium</Tag>
    }
    else {
        return <Tag className="bg-gradient-to-br from-[#ef4444] to-[#f87171] border-none text-white font-poppins">Bad</Tag>
    }
}

function toNormalCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Enhanced Table Columns with Tooltips
const getColumns = (theme) => [
    {
        title: 'Metric',
        dataIndex: 'metric',
        key: 'metric',
        render: (text, record) => (
            <Tooltip title={record.description}>
                <span style={{ color: 'var(--text)' }} className="font-poppins">{text}</span>{' '}
                <InfoCircleOutlined
                    style={{ color: 'var(--accent-text)' }}
                    className="ml-[5px]"
                />
            </Tooltip>
        ),
    },
    {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        render: (text) => (
            <span style={{ color: 'var(--text)' }} className="font-poppins">{text}</span>
        ),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
]

const ModelView = () => {
    const { theme } = useTheme()
    const navigate = useNavigate()
    const { modelId, id } = useParams()
    const [model, setModel] = useState({})
    const [metrics, setMetrics] = useState([])
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(true)

    useEffect(() => {
        const fetchModel = async () => {
            try {
                const modelRes = await modelServiceAPI.getModelById(modelId)
                if (modelRes.status !== 200) {
                    throw new Error("Cannot find model")
                }
                const modelData = modelRes.data
                setModel(prev => modelData)
                console.log("model:", modelData)
                await fetchExperimentMetrics(modelData.experiment_id)
            }
            catch (error) {
                console.log("Error while getting model", error)
            }
        }

        const fetchExperimentMetrics = async (experimentId) => {
            setMetrics((prev) => [])
            try {
                const metricsRes = await mlServiceAPI.getFinalMetrics(experimentId)
                if (metricsRes.status !== 200) {
                    throw new Error("Cannot get metrics")
                }
                for (const key in metricsRes.data) {
                    const metricData = {
                        key: key,
                        metric: metricsRes.data[key].name,
                        value: parseFloat(metricsRes.data[key].score).toFixed(
                            2
                        ),
                        description: metricsRes.data[key].description,
                        status: getAccuracyStatus(metricsRes.data[key].score),
                    }
                    setMetrics((prev) => [...prev, metricData])
                }
            }
            catch (error) {
                console.log("Error while getting metrics", error)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchModel()
    }, [modelId])

    return (
        <>
            <style>{`
                body, html {
                    background-color: var(--surface) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                .theme-table .ant-table {
                    background: transparent !important;
                    color: var(--text) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                .theme-table .ant-table-thead > tr > th {
                    background: var(--table-header-bg) !important;
                    color: var(--table-header-color) !important;
                    border-bottom: 1px solid var(--table-header-border) !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 600 !important;
                }
                .theme-table .ant-table-tbody > tr > td {
                    background: var(--table-cell-bg) !important;
                    color: var(--table-cell-color) !important;
                    border-bottom: 1px solid var(--table-cell-border) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                .theme-table .ant-table-tbody > tr:hover > td {
                    background: var(--table-row-hover) !important;
                }
                .theme-table .ant-empty-description {
                    color: var(--secondary-text) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                .ant-collapse-ghost > .ant-collapse-item {
                    border: none !important;
                }
                .ant-collapse-ghost > .ant-collapse-item > .ant-collapse-header {
                    background: var(--hover-bg) !important;
                    color: var(--text) !important;
                    border-radius: 8px !important;
                    border: 1px solid var(--border) !important;
                }
                .ant-collapse-ghost > .ant-collapse-item > .ant-collapse-content {
                    background: var(--card-gradient) !important;
                    border: 1px solid var(--border) !important;
                    border-top: none !important;
                    border-radius: 0 0 8px 8px !important;
                }
                .ant-collapse-ghost > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box {
                    padding: 12px 16px !important;
                }
            `}</style>
            <div className="min-h-screen relative" style={{ background: 'var(--surface)' }}>
                {theme === 'dark' && (
                    <BackgroundShapes
                        width="1280px"
                        height="1200px"
                        shapes={[
                            {
                                id: 'modelBlue',
                                shape: 'circle',
                                size: '550px',
                                gradient: { type: 'radial', shape: 'ellipse', colors: ['#5C8DFF 0%', '#5C8DFF 40%', 'transparent 80%'] },
                                opacity: 0.3,
                                blur: '220px',
                                position: { top: '180px', right: '-150px' },
                                transform: 'none'
                            },
                            {
                                id: 'modelCyan',
                                shape: 'rounded',
                                size: '480px',
                                gradient: { type: 'radial', shape: 'circle', colors: ['#40FFFF 0%', '#40FFFF 50%', 'transparent 85%'] },
                                opacity: 0.25,
                                blur: '190px',
                                position: { top: '350px', left: '-160px' },
                                transform: 'none'
                            },
                            {
                                id: 'modelWarm',
                                shape: 'rounded',
                                size: '420px',
                                gradient: { type: 'radial', shape: 'circle', colors: ['#FFAF40 0%', '#FFAF40 60%', 'transparent 90%'] },
                                opacity: 0.2,
                                blur: '170px',
                                position: { bottom: '150px', right: '25%' },
                                transform: 'none'
                            }
                        ]}
                    />
                )}
                <div className="relative z-10 p-6">
                    <Space direction="vertical" size="large" className="w-full">
                        {/* Key Metrics Cards */}
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={8}>
                                <Card
                                    className="group relative overflow-hidden rounded-2xl border border-opacity-20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-opacity-40 font-poppins"
                                    style={{
                                        borderColor: 'var(--border)',
                                        background: 'linear-gradient(135deg, var(--hover-bg) 0%, rgba(255,255,255,0.02) 100%)'
                                    }}
                                >
                                    <Statistic
                                        title={<span style={{ color: 'var(--secondary-text)' }} className="font-poppins">{`Model ${metrics[0] ? toNormalCase(metrics[0]?.metric) : "Null"} Score`}</span>}
                                        value={metrics[0]?.value * 100 || 0}
                                        precision={2}
                                        prefix={<TrophyOutlined className="text-[#10b981]" />}
                                        suffix="%"
                                        valueStyle={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontWeight: 'bold'
                                        }}
                                        className="[&_.ant-statistic-content-value]:bg-gradient-to-br [&_.ant-statistic-content-value]:from-[#10b981] [&_.ant-statistic-content-value]:to-[#34d399] [&_.ant-statistic-content-value]:bg-clip-text [&_.ant-statistic-content-value]:text-transparent"
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card
                                    className="group relative overflow-hidden rounded-2xl border border-opacity-20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-opacity-40 font-poppins"
                                    style={{
                                        borderColor: 'var(--border)',
                                        background: 'linear-gradient(135deg, var(--hover-bg) 0%, rgba(255,255,255,0.02) 100%)'
                                    }}
                                >
                                    <Statistic
                                        title={<span style={{ color: 'var(--secondary-text)' }} className="font-poppins">Model Size</span>}
                                        value={model.metadata?.model_size || 0}
                                        valueStyle={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontWeight: 'bold'
                                        }}
                                        className="[&_.ant-statistic-content-value]:bg-gradient-to-br [&_.ant-statistic-content-value]:from-[#f59e0b] [&_.ant-statistic-content-value]:to-[#fbbf24] [&_.ant-statistic-content-value]:bg-clip-text [&_.ant-statistic-content-value]:text-transparent"
                                        prefix={<CloudDownloadOutlined className="text-[#f59e0b]" />}
                                        suffix="MB"
                                        precision={2}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card
                                    className="group relative overflow-hidden rounded-2xl border border-opacity-20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-opacity-40 font-poppins"
                                    style={{
                                        borderColor: 'var(--border)',
                                        background: 'linear-gradient(135deg, var(--hover-bg) 0%, rgba(255,255,255,0.02) 100%)'
                                    }}
                                >
                                    <Statistic
                                        title={<span style={{ color: 'var(--secondary-text)' }} className="font-poppins">Model Name</span>}
                                        value={model.name}
                                        prefix={<ExperimentOutlined style={{ color: 'var(--accent-text)' }} />}
                                        valueStyle={{
                                            fontFamily: 'Poppins, sans-serif',
                                            fontWeight: 'bold',
                                            color: 'var(--text)'
                                        }}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Card
                            title={<span style={{ color: 'var(--text)' }} className="font-poppins">Next Steps</span>}
                            className="rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl font-poppins"
                            style={{
                                borderColor: 'var(--border)',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)'
                            }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={8}>
                                    <Alert
                                        message={<span style={{ color: 'var(--text)' }} className="font-poppins font-semibold">Deploy Model</span>}
                                        description={<span style={{ color: 'var(--secondary-text)' }} className="font-poppins">Instantly transform your trained model into a production-ready solution for real-world predictions.</span>}
                                        type="success"
                                        showIcon
                                        className="h-[130px] rounded-lg font-poppins bg-[linear-gradient(135deg,rgba(16,185,129,0.1),rgba(52,211,153,0.1))] border border-[rgba(16,185,129,0.3)]"
                                    />
                                    <Button
                                        type="primary"
                                        icon={<RocketOutlined />}
                                        onClick={() => {
                                            navigate(
                                                `/app/project/${id}/build/deployView?modelId=${modelId}`
                                            )
                                        }}
                                        size="large"
                                        className="w-full font-bold mt-[15px] font-poppins border-none bg-gradient-to-br from-[#10b981] to-[#34d399] hover:shadow-lg transition-all duration-300"
                                    >
                                        Deploy Now
                                    </Button>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Alert
                                        message={<span style={{ color: 'var(--text)' }} className="font-poppins font-semibold">Download Weights</span>}
                                        description={<span style={{ color: 'var(--secondary-text)' }} className="font-poppins">Securely export and preserve your model's learned parameters for future iterations or transfer learning.</span>}
                                        type="warning"
                                        showIcon
                                        className="h-[130px] rounded-lg font-poppins bg-[linear-gradient(135deg,rgba(245,158,11,0.1),rgba(251,191,36,0.1))] border border-[rgba(245,158,11,0.3)]"
                                    />
                                    <Button
                                        type="default"
                                        icon={<CloudDownloadOutlined />}
                                        size="large"
                                        className="w-full font-bold mt-[15px] font-poppins border-none bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] hover:shadow-lg transition-all duration-300"
                                        style={{ color: '#ffffff' }}
                                        onClick={async (e) => {
                                            e.preventDefault()
                                            const urlResponse = await mlServiceAPI.getModelUrl(modelId)
                                            if (urlResponse.status !== 200) {
                                                message.error("Failed to download model.")
                                            }
                                            const url = urlResponse.data
                                            window.location.href = url
                                        }}
                                    >
                                        Download
                                    </Button>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Alert
                                        message={<span style={{ color: 'var(--text)' }} className="font-poppins font-semibold">Refine Model</span>}
                                        description={<span style={{ color: 'var(--secondary-text)' }} className="font-poppins">Continuously improve your model's performance by initiating a new training cycle with enhanced data or parameters.</span>}
                                        type="info"
                                        showIcon
                                        className="h-[130px] rounded-lg font-poppins bg-[linear-gradient(135deg,rgba(59,130,246,0.1),rgba(96,165,250,0.1))] border border-[rgba(59,130,246,0.3)]"
                                    />
                                    <Button
                                        type="default"
                                        icon={<HistoryOutlined />}
                                        size="large"
                                        className="w-full font-bold mt-[15px] font-poppins border-none bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] hover:shadow-lg transition-all duration-300"
                                        style={{ color: '#ffffff' }}
                                        onClick={() => navigate(`/app/project/${id}/model/${modelId}/retrain`)}
                                    >
                                        Retrain Model
                                    </Button>
                                </Col>
                            </Row>
                        </Card>

                        {/* Expandable Details Section */}
                        <Card
                            className="rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl font-poppins"
                            style={{
                                borderColor: 'var(--border)',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)'
                            }}
                        >
                            <Button
                                type="link"
                                icon={<BarChartOutlined style={{ color: 'var(--accent-text)' }} />}
                                onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                                className="text-xl font-poppins"
                                style={{ color: 'var(--text)' }}
                            >
                                {isDetailsExpanded
                                    ? 'Hide Details'
                                    : 'Show Detailed Model'}
                            </Button>

                            {isDetailsExpanded && (
                                <Space
                                    direction="vertical"
                                    size="large"
                                    className="w-full mt-4"
                                >
                                    {/* Input Data Display */}
                                    <Card
                                        title={
                                            <>
                                                <span style={{ color: 'var(--text)' }} className="font-poppins">Metadata</span>{" "}
                                                <span
                                                    className="text-xs"
                                                    style={{ color: 'var(--secondary-text)' }}
                                                >
                                                    (Details about the model and its expected input, output)
                                                </span>
                                            </>
                                        }
                                        className="rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl font-poppins"
                                        style={{
                                            borderColor: 'var(--border)',
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)'
                                        }}
                                    >
                                        <Space direction="vertical" size="middle" className="w-full">
                                            {Object.entries(model.metadata || {}).map(([key, value]) => (
                                                <div key={key}>
                                                    {/* Primary Tag */}
                                                    <Tag
                                                        className="text-sm py-[4px] px-[8px] min-w-[120px] text-center inline-block bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] border-none text-white font-poppins"
                                                    >
                                                        {key}
                                                    </Tag>

                                                    {/* Render based on type */}
                                                    {Array.isArray(value) ? (
                                                        key === "sample_data" && typeof value[0] === "object" && value[0] !== null ? (
                                                            // Styled table for sample_data
                                                            <Space wrap className="ml-4">
                                                                <Table
                                                                    dataSource={value}
                                                                    pagination={false}
                                                                    rowKey={(record, idx) => idx}
                                                                    bordered={false}
                                                                    className="ml-4 rounded-lg"
                                                                    rowClassName={() => ''} // removes Ant Design hover class
                                                                    columns={Object.keys(value[0]).map((colKey) => ({
                                                                        title: (
                                                                            <span style={{ color: 'var(--table-header-color)' }} className="font-poppins">
                                                                                {colKey.charAt(0).toUpperCase() + colKey.slice(1)}
                                                                            </span>
                                                                        ),
                                                                        dataIndex: colKey,
                                                                        key: colKey,
                                                                        render: (text) => (
                                                                            <span style={{ color: 'var(--table-cell-color)' }} className="font-poppins">
                                                                                {text?.toString() || <em style={{ color: 'var(--secondary-text)' }}>(empty)</em>}
                                                                            </span>
                                                                        ),
                                                                    }))}
                                                                    components={{
                                                                        header: {
                                                                            cell: (props) => (
                                                                                <th
                                                                                    {...props}
                                                                                    className="font-poppins"
                                                                                    style={{
                                                                                        backgroundColor: 'var(--table-header-bg)',
                                                                                        color: 'var(--table-header-color)'
                                                                                    }}
                                                                                >
                                                                                    {props.children}
                                                                                </th>
                                                                            ),
                                                                        },
                                                                        body: {
                                                                            row: ({ children, ...restProps }) => (
                                                                                <tr
                                                                                    {...restProps}
                                                                                    onMouseEnter={(e) => {
                                                                                        const tds = e.currentTarget.children;
                                                                                        const hoverColor = getComputedStyle(document.documentElement).getPropertyValue('--table-row-hover');
                                                                                        for (let i = 0; i < tds.length; i++) tds[i].style.backgroundColor = hoverColor;
                                                                                    }}
                                                                                    onMouseLeave={(e) => {
                                                                                        const tds = e.currentTarget.children;
                                                                                        const cellBg = getComputedStyle(document.documentElement).getPropertyValue('--table-cell-bg');
                                                                                        for (let i = 0; i < tds.length; i++) tds[i].style.backgroundColor = cellBg;
                                                                                    }}
                                                                                >
                                                                                    {React.Children.map(children, (child) =>
                                                                                        React.cloneElement(child, {
                                                                                            style: { 
                                                                                                backgroundColor: 'var(--table-cell-bg)', 
                                                                                                color: 'var(--table-cell-color)' 
                                                                                            },
                                                                                        })
                                                                                    )}
                                                                                </tr>
                                                                            ),
                                                                        },
                                                                    }}

                                                                />
                                                            </Space>
                                                        ) : (
                                                            // Your original Space + Tag handling for arrays
                                                            <Space wrap className="ml-4">
                                                                {value.map((item, idx) =>
                                                                    typeof item === "object" && item !== null ? (
                                                                        <Tag
                                                                            key={idx}
                                                                            style={{
                                                                                minWidth: 100,
                                                                                textAlign: "center",
                                                                                borderColor: item.color,
                                                                                color: item.color,
                                                                                backgroundColor: `${item.color}20`,
                                                                            }}
                                                                        >
                                                                            {item.name} {item.label ? `(${item.label})` : ""}
                                                                        </Tag>
                                                                    ) : (
                                                                        <Tag
                                                                            key={idx}
                                                                            className="bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] border-none text-white font-poppins"
                                                                        >
                                                                            {item}
                                                                        </Tag>
                                                                    )
                                                                )}
                                                            </Space>
                                                        )
                                                    ) : typeof value === "object" && value !== null ? (
                                                        <Collapse
                                                            ghost
                                                            size="small"
                                                            className="inline-block align-top"
                                                        >
                                                            <Panel
                                                                header={<span style={{ color: 'var(--text)' }} className="font-poppins">View Details</span>}
                                                                key="1"
                                                                className="bg-transparent rounded-lg"
                                                                style={{ borderColor: 'var(--border)' }}
                                                            >
                                                                <Space
                                                                    direction="vertical"
                                                                    size="small"
                                                                    className="inline-flex align-top"
                                                                >
                                                                    {Object.entries(value).map(([subKey, subValue]) => (
                                                                        <div
                                                                            key={subKey}
                                                                            className="flex items-center"
                                                                        >
                                                                            <Tag
                                                                                className="min-w-[100px] text-center mr-2 bg-gradient-to-br from-[#10b981] to-[#34d399] border-none text-white font-poppins"
                                                                            >
                                                                                {subKey}
                                                                            </Tag>

                                                                            {Array.isArray(subValue) ? (
                                                                                // Handle array values
                                                                                <Space wrap className="ml-4">
                                                                                    {subValue.map((item, idx) =>
                                                                                        typeof item === "object" && item !== null ? (
                                                                                            // Array of objects
                                                                                            <Tag
                                                                                                key={idx}
                                                                                                style={{
                                                                                                    minWidth: 100,
                                                                                                    textAlign: "center",
                                                                                                    borderColor: item.color,
                                                                                                    color: item.color,
                                                                                                    backgroundColor: `${item.color}20`,
                                                                                                }}
                                                                                            >
                                                                                                {item.name} {item.label ? `(${item.label})` : ""}
                                                                                            </Tag>
                                                                                        ) : (
                                                                                            // Array of primitives
                                                                                            <Tag
                                                                                                key={idx}
                                                                                                className="bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] border-none text-white font-poppins"
                                                                                            >
                                                                                                {item}
                                                                                            </Tag>
                                                                                        )
                                                                                    )}
                                                                                </Space>
                                                                            ) : (
                                                                                // Primitive values
                                                                                <span style={{ color: 'var(--text)' }} className="font-poppins">
                                                                                    {subValue?.toString() || <em style={{ color: 'var(--secondary-text)' }}>(empty)</em>}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </Space>
                                                            </Panel>
                                                        </Collapse>
                                                    ) : (
                                                        // Handle primitives
                                                        <span className="ml-[10px] font-poppins" style={{ color: 'var(--text)' }}>
                                                            {value?.toString() || <em style={{ color: 'var(--secondary-text)' }}>(empty)</em>}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </Space>
                                    </Card>

                                    {/* Detailed Metrics Table */}
                                    <Card
                                        title={
                                            <>
                                                <span style={{ color: 'var(--text)' }} className="font-poppins">Model Metrics</span>{" "}
                                                <span className="text-xs italic font-poppins" style={{ color: 'var(--secondary-text)' }}>
                                                    (Detail about how well the model make predictions)
                                                </span>
                                            </>
                                        }
                                        className="rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl font-poppins"
                                        style={{
                                            borderColor: 'var(--border)',
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)'
                                        }}
                                    >
                                        <Table
                                            columns={getColumns(theme)}
                                            dataSource={metrics}
                                            pagination={false}
                                            className="bg-transparent font-poppins theme-table"
                                        />
                                    </Card>
                                </Space>
                            )}
                        </Card>
                    </Space>
                </div>
            </div>
        </>
    )
}

export default ModelView
