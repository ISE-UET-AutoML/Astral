import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from 'src/theme/ThemeProvider'
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
import BackgroundShapes from 'src/components/landing/BackgroundShapes'

const { Panel } = Collapse;

// Performance Metrics Configuration
const getAccuracyStatus = (score) => {
    if (score >= 0.9) {
        return <Tag style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', border: 'none', color: 'white', fontFamily: 'Poppins, sans-serif' }}>Excellent</Tag>
    }
    else if (score >= 0.7) {
        return <Tag style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', border: 'none', color: 'white', fontFamily: 'Poppins, sans-serif' }}>Good</Tag>
    }
    else if (score >= 0.6) {
        return <Tag style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', border: 'none', color: 'white', fontFamily: 'Poppins, sans-serif' }}>Medium</Tag>
    }
    else {
        return <Tag style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)', border: 'none', color: 'white', fontFamily: 'Poppins, sans-serif' }}>Bad</Tag>
    }
}

function toNormalCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Enhanced Table Columns with Tooltips
const columns = [
    {
        title: 'Metric',
        dataIndex: 'metric',
        key: 'metric',
        render: (text, record) => (
            <Tooltip title={record.description}>
                <span style={{ color: 'var(--text)', fontFamily: 'Poppins, sans-serif' }}>{text}</span>{' '}
                <InfoCircleOutlined
                    style={{ color: '#60a5fa', marginLeft: 5 }}
                />
            </Tooltip>
        ),
    },
    {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        render: (text) => (
            <span style={{ color: 'var(--text)', fontFamily: 'Poppins, sans-serif' }}>{text}</span>
        ),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
]

const ModelView = () => {
    const navigate = useNavigate()
    const { theme } = useTheme()
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
        fetchModel()
    }, [])

    return (
        <>
            <style>{`
                body, html {
                    background-color: var(--surface) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                .dark-table .ant-table {
                    background: transparent !important;
                    color: var(--text) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                .dark-table .ant-table-thead > tr > th {
                    background: var(--table-header-bg) !important;
                    color: var(--table-header-color) !important;
                    border-bottom: 1px solid var(--table-header-border) !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 600 !important;
                }
                .dark-table .ant-table-tbody > tr > td {
                    background: var(--table-cell-bg) !important;
                    color: var(--table-cell-color) !important;
                    border-bottom: 1px solid var(--table-cell-border) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                .dark-table .ant-table-tbody > tr:hover > td {
                    background: var(--table-row-hover) !important;
                }
                .dark-table .ant-empty-description {
                    color: var(--secondary-text) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                .dark-table .ant-table-placeholder,
                .dark-table .ant-table-tbody > tr.ant-table-placeholder > td,
                .dark-table .ant-empty {
                    background: transparent !important;
                    color: var(--secondary-text) !important;
                }
                .ant-collapse-ghost > .ant-collapse-item {
                    border: none !important;
                }
                .ant-collapse-ghost > .ant-collapse-item > .ant-collapse-header {
                    background: var(--nested-card-bg) !important;
                    color: var(--text) !important;
                    border-radius: 8px !important;
                    border: 1px solid var(--border) !important;
                }
                .ant-collapse-ghost > .ant-collapse-item > .ant-collapse-content {
                    background: var(--nested-card-bg) !important;
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
                    <BackgroundShapes width="1280px" height="1200px" grayVariant />
                )}
                <div className="relative z-10 p-6">
                    <Space direction="vertical" size="large" className="w-full">
                        {/* Key Metrics Cards */}
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={8}>
                                <Card
                                    className="border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                                    style={{
                                        background: 'var(--card-gradient)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        fontFamily: 'Poppins, sans-serif'
                                    }}
                                >
                                    <Statistic
                                        title={<span style={{ color: 'var(--secondary-text)', fontFamily: 'Poppins, sans-serif' }}>{`Model ${metrics[0] ? toNormalCase(metrics[0]?.metric) : "Null"} Score`}</span>}
                                        value={metrics[0]?.value * 100 || 0}
                                        precision={2}
                                        prefix={<TrophyOutlined style={{ color: '#10b981' }} />}
                                        suffix="%"
                                        valueStyle={{
                                            background: 'linear-gradient(135deg, #10b981, #34d399)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card
                                    className="border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                                    style={{
                                        background: 'var(--card-gradient)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        fontFamily: 'Poppins, sans-serif'
                                    }}
                                >
                                    <Statistic
                                        title={<span style={{ color: 'var(--secondary-text)', fontFamily: 'Poppins, sans-serif' }}>Model Size</span>}
                                        value={model.metadata?.model_size || 0}
                                        valueStyle={{
                                            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontWeight: 'bold'
                                        }}
                                        prefix={<CloudDownloadOutlined style={{ color: '#f59e0b' }} />}
                                        suffix="MB"
                                        precision={2}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Card
                                    className="border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                                    style={{
                                        background: 'var(--card-gradient)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        fontFamily: 'Poppins, sans-serif'
                                    }}
                                >
                                    <Statistic
                                        title={<span style={{ color: 'var(--secondary-text)', fontFamily: 'Poppins, sans-serif' }}>Model Name</span>}
                                        value={model.name}
                                        prefix={<ExperimentOutlined style={{ color: '#3b82f6' }} />}
                                        valueStyle={{
                                            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Card
                            title={<span style={{ color: 'var(--text)', fontFamily: 'Poppins, sans-serif' }}>Next Steps</span>}
                            className="border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                            style={{
                                background: 'var(--card-gradient)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                fontFamily: 'Poppins, sans-serif'
                            }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={8}>
                                    <Alert
                                        message={<span style={{ color: 'var(--text)', fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>Deploy Model</span>}
                                        description={<span style={{ color: 'var(--secondary-text)', fontFamily: 'Poppins, sans-serif' }}>Instantly transform your trained model into a production-ready solution for real-world predictions.</span>}
                                        type="success"
                                        showIcon
                                        style={{
                                            height: 130,
                                            background: 'var(--next-step-card-bg)',
                                            border: theme === 'dark' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(16, 185, 129, 0.35)',
                                            borderRadius: '8px',
                                            fontFamily: 'Poppins, sans-serif'
                                        }}
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
                                        style={{
                                            width: '100%',
                                            fontWeight: 'bold',
                                            marginTop: 15,
                                            background: 'linear-gradient(135deg, #059669, #10b981)',
                                            border: 'none',
                                            fontFamily: 'Poppins, sans-serif'
                                        }}
                                        className="hover:shadow-lg transition-all duration-300"
                                    >
                                        Deploy Now
                                    </Button>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Alert
                                        message={<span style={{ color: 'var(--text)', fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>Download Weights</span>}
                                        description={<span style={{ color: 'var(--secondary-text)', fontFamily: 'Poppins, sans-serif' }}>Securely export and preserve your model's learned parameters for future iterations or transfer learning.</span>}
                                        type="warning"
                                        showIcon
                                        style={{
                                            height: 130,
                                            background: theme === 'dark' ? 'rgba(38, 38, 40, 0.6)' : 'rgba(243, 244, 246, 0.9)',
                                            border: theme === 'dark' ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(245, 158, 11, 0.35)',
                                            borderRadius: '8px',
                                            fontFamily: 'Poppins, sans-serif'
                                        }}
                                    />
                                    <Button
                                        type="default"
                                        icon={<CloudDownloadOutlined />}
                                        size="large"
                                        style={{
                                            width: '100%',
                                            fontWeight: 'bold',
                                            marginTop: 15,
                                            background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                                            color: 'white',
                                            border: 'none',
                                            fontFamily: 'Poppins, sans-serif'
                                        }}
                                        className="hover:shadow-lg transition-all duration-300"
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
                                        message={<span style={{ color: 'var(--text)', fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}>Refine Model</span>}
                                        description={<span style={{ color: 'var(--secondary-text)', fontFamily: 'Poppins, sans-serif' }}>Continuously improve your model's performance by initiating a new training cycle with enhanced data or parameters.</span>}
                                        type="info"
                                        showIcon
                                        style={{
                                            height: 130,
                                            background: 'var(--next-step-card-bg)',
                                            border: theme === 'dark' ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid rgba(59, 130, 246, 0.35)',
                                            borderRadius: '8px',
                                            fontFamily: 'Poppins, sans-serif'
                                        }}
                                    />
                                    <Button
                                        type="default"
                                        icon={<HistoryOutlined />}
                                        size="large"
                                        style={{
                                            width: '100%',
                                            fontWeight: 'bold',
                                            marginTop: 15,
                                            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                                            color: 'white',
                                            border: 'none',
                                            fontFamily: 'Poppins, sans-serif'
                                        }}
                                        className="hover:shadow-lg transition-all duration-300"
                                        onClick={() => navigate(`/app/project/${id}/model/${modelId}/retrain`)}
                                    >
                                        Retrain Model
                                    </Button>
                                </Col>
                            </Row>
                        </Card>

                        {/* Expandable Details Section */}
                        <Card
                            className="border-0 backdrop-blur-sm shadow-lg"
                            style={{
                                background: 'var(--card-gradient)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                fontFamily: 'Poppins, sans-serif'
                            }}
                        >
                            <Button
                                type="link"
                                icon={<BarChartOutlined style={{ color: '#60a5fa' }} />}
                                onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                                className="text-xl"
                                style={{
                                    color: 'var(--text)',
                                    fontFamily: 'Poppins, sans-serif'
                                }}
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
                                                <span style={{ color: 'var(--text)', fontFamily: 'Poppins, sans-serif' }}>Metadata</span>{" "}
                                                <span
                                                    style={{
                                                        fontSize: "12px",
                                                        color: 'var(--secondary-text)',
                                                        fontStyle: "italic",
                                                        fontFamily: 'Poppins, sans-serif'
                                                    }}
                                                >
                                                    (Details about the model and its expected input, output)
                                                </span>
                                            </>
                                        }
                                        className="border-0 backdrop-blur-sm"
                                        style={{
                                            background: 'var(--nested-card-bg)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '12px',
                                            fontFamily: 'Poppins, sans-serif'
                                        }}
                                    >
                                        <Space direction="vertical" size="middle" className="w-full">
                                            {Object.entries(model.metadata || {}).map(([key, value]) => (
                                                <div key={key}>
                                                    {/* Primary Tag */}
                                                    <Tag
                                                        style={{
                                                            fontSize: "14px",
                                                            padding: "4px 8px",
                                                            minWidth: 120,
                                                            textAlign: "center",
                                                            display: "inline-block",
                                                            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                                                            border: 'none',
                                                            color: 'white',
                                                            fontFamily: 'Poppins, sans-serif'
                                                        }}
                                                    >
                                                        {key}
                                                    </Tag>

                                                    {/* Render based on type */}
                                                    {Array.isArray(value) ? (
                                                        key === "sample_data" && typeof value[0] === "object" && value[0] !== null ? (
                                                            // Styled table for sample_data
                                                            <Space wrap style={{ marginLeft: 16 }}>
                                                                <Table
                                                                    dataSource={value}
                                                                    pagination={false}
                                                                    rowKey={(record, idx) => idx}
                                                                    bordered={false}
                                                                    style={{ marginLeft: 16, borderRadius: 8 }}
                                                                    rowClassName={() => ''} // removes Ant Design hover class
                                                                    columns={Object.keys(value[0]).map((colKey) => ({
                                                                        title: (
                                                                            <span style={{ color: 'var(--text)', fontFamily: 'Poppins, sans-serif' }}>
                                                                                {colKey.charAt(0).toUpperCase() + colKey.slice(1)}
                                                                            </span>
                                                                        ),
                                                                        dataIndex: colKey,
                                                                        key: colKey,
                                                                        render: (text) => (
                                                                            <span style={{ color: 'var(--text)', fontFamily: 'Poppins, sans-serif' }}>
                                                                                {text?.toString() || <em style={{ color: 'var(--secondary-text)' }}>(empty)</em>}
                                                                            </span>
                                                                        ),
                                                                    }))}
                                                                    components={{
                                                                        header: {
                                                                            cell: (props) => (
                                                                                <th
                                                                                    {...props}
                                                                                    style={{
                                                                                        backgroundColor: 'var(--table-header-bg)',
                                                                                        color: 'var(--table-header-color)',
                                                                                        fontFamily: 'Poppins, sans-serif',
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
                                                                                    style={{ backgroundColor: 'var(--table-cell-bg)' }}
                                                                                    onMouseEnter={(e) => {
                                                                                        const tds = e.currentTarget.children;
                                                                                        for (let i = 0; i < tds.length; i++) tds[i].style.backgroundColor = 'var(--table-row-hover)';
                                                                                    }}
                                                                                    onMouseLeave={(e) => {
                                                                                        const tds = e.currentTarget.children;
                                                                                        for (let i = 0; i < tds.length; i++) tds[i].style.backgroundColor = 'transparent';
                                                                                    }}
                                                                                >
                                                                                    {React.Children.map(children, (child) =>
                                                                                        React.cloneElement(child, {
                                                                                            style: { backgroundColor: 'transparent', color: 'var(--table-cell-color)' },
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
                                                            <Space wrap style={{ marginLeft: 16 }}>
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
                                                                            style={{
                                                                                background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                                                                                border: 'none',
                                                                                color: 'white',
                                                                                fontFamily: 'Poppins, sans-serif',
                                                                            }}
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
                                                            style={{
                                                                display: "inline-block",
                                                                verticalAlign: "top",
                                                                fontFamily: 'Poppins, sans-serif'
                                                            }}
                                                        >
                                                            <Panel
                                                                header={<span style={{ color: 'var(--text)', fontFamily: 'Poppins, sans-serif' }}>View Details</span>}
                                                                key="1"
                                                                style={{
                                                                    background: 'transparent',
                                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                    borderRadius: '8px'
                                                                }}
                                                            >
                                                                <Space
                                                                    direction="vertical"
                                                                    size="small"
                                                                    style={{
                                                                        display: "inline-flex",
                                                                        verticalAlign: "top",
                                                                    }}
                                                                >
                                                                    {Object.entries(value).map(([subKey, subValue]) => (
                                                                        <div
                                                                            key={subKey}
                                                                            style={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                gap: 8,
                                                                            }}
                                                                        >
                                                                            <Tag
                                                                                style={{
                                                                                    minWidth: 100,
                                                                                    textAlign: "center",
                                                                                    marginRight: 8,
                                                                                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                                                                                    border: 'none',
                                                                                    color: 'white',
                                                                                    fontFamily: 'Poppins, sans-serif'
                                                                                }}
                                                                            >
                                                                                {subKey}
                                                                            </Tag>

                                                                            {Array.isArray(subValue) ? (
                                                                                // Handle array values
                                                                                <Space wrap style={{ marginLeft: 16 }}>
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
                                                                                                style={{
                                                                                                    background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                                                                                                    border: 'none',
                                                                                                    color: 'white',
                                                                                                    fontFamily: 'Poppins, sans-serif'
                                                                                                }}
                                                                                            >
                                                                                                {item}
                                                                                            </Tag>
                                                                                        )
                                                                                    )}
                                                                                </Space>
                                                                            ) : (
                                                                                // Primitive values
                                                                                <span style={{ color: 'var(--text)', fontFamily: 'Poppins, sans-serif' }}>
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
                                                        <span style={{ marginLeft: 10, color: 'var(--text)', fontFamily: 'Poppins, sans-serif' }}>
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
                                                <span style={{ color: 'var(--text)', fontFamily: 'Poppins, sans-serif' }}>Model Metrics</span>{" "}
                                                <span style={{ fontSize: "12px", color: 'var(--secondary-text)', fontStyle: "italic", fontFamily: 'Poppins, sans-serif' }}>
                                                    (Detail about how well the model make predictions)
                                                </span>
                                            </>
                                        }
                                        className="border-0 backdrop-blur-sm"
                                        style={{
                                            background: 'var(--nested-card-bg)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '12px',
                                            fontFamily: 'Poppins, sans-serif'
                                        }}
                                    >
                                        <Table
                                            columns={columns}
                                            dataSource={metrics}
                                            pagination={false}
                                            style={{
                                                background: 'transparent',
                                                fontFamily: 'Poppins, sans-serif'
                                            }}
                                            className="dark-table"
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
