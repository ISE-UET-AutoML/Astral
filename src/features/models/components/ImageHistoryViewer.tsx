import React, { useState } from 'react';
import { Button as UiButton } from 'src/components/ui/button'
import { Card as UiCard, CardContent as UiCardContent, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from 'src/components/ui/card'
import { Progress as UiProgress } from 'src/components/ui/progress'
import { Badge as UiBadge } from 'src/components/ui/badge'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
import { Empty as UiEmpty, EmptyDescription as UiEmptyDescription } from 'src/components/ui/empty'
import { ChevronLeft as LeftOutlined, ChevronRight as RightOutlined, CircleCheck as CheckCircleOutlined, TriangleAlert as WarningOutlined, CircleX as CloseCircleOutlined } from 'lucide-react'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Card = ({ title, children, className = '', style, ...props }) => (<UiCard className={className} style={style} {...props}>{title && <UiCardHeader><UiCardTitle>{title}</UiCardTitle></UiCardHeader>}<UiCardContent>{children}</UiCardContent></UiCard>)
Card.Meta = ({ title, description, avatar, className = '' }) => (<div className={cx('flex items-start gap-3', className)}>{avatar}<div>{title && <div className="font-medium">{title}</div>}{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)
const Progress = ({ percent, value, className = '', ...props }) => <UiProgress value={percent ?? value ?? 0} className={className} {...props} />
const Tag = ({ color, children, className = '', ...props }) => <UiBadge className={className} {...props}>{children}</UiBadge>
const Empty = ({ description = 'No data', className = '', ...props }) => <UiEmpty className={className} {...props}><UiEmptyDescription>{description}</UiEmptyDescription></UiEmpty>
const Typography = { Title: ({ level = 3, children, className = '', ...props }) => { const Heading = `h${level}`; return <Heading className={cx('font-semibold', className)} {...props}>{children}</Heading> }, Text: ({ children, className = '', ...props }) => <span className={className} {...props}>{children}</span>, Paragraph: ({ children, className = '', ...props }) => <p className={className} {...props}>{children}</p> }
const Row = ({ children, className = '', gutter, ...props }) => <div className={cx('flex flex-wrap', className)} {...props}>{children}</div>
const Col = ({ children, className = '', span, xs, sm, md, lg, ...props }) => <div className={cx('min-w-0 flex-1', className)} {...props}>{children}</div>


const { Title, Text } = Typography;

const ImageHistoryViewer = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!data || data.length === 0) {
        return <Empty description="Không có dữ liệu dự đoán." />;
    }

    const currentPrediction = data[currentIndex] || {};
    const confidence = currentPrediction.confidence || 0;
    const confidencePercent = (confidence * 100).toFixed(2);

    const getConfidenceStatus = (conf) => {
        if (conf >= 0.9) return { color: '#52c41a', status: 'Excellent', icon: <CheckCircleOutlined />, gradient: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)' };
        if (conf >= 0.75) return { color: '#1890ff', status: 'Good', icon: <CheckCircleOutlined />, gradient: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)' };
        if (conf >= 0.6) return { color: '#faad14', status: 'Medium', icon: <WarningOutlined />, gradient: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)' };
        return { color: '#ff4d4f', status: 'Low', icon: <CloseCircleOutlined />, gradient: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)' };
    };

    const confidenceStatus = getConfidenceStatus(confidence);

    return (
        <div className="p-3 flex flex-col">
            {/* Navigation */}
            <div className="flex justify-between items-center mb-3 px-3 py-2 rounded-lg shadow-sm shrink-0 bg-gradient-to-br from-[#f0f2f5] to-[#e6f7ff]">
                <Button 
                    icon={<LeftOutlined />} 
                    onClick={() => setCurrentIndex(p => p - 1)} 
                    disabled={currentIndex === 0}
                    type="primary"
                    size="small"
                    className="!rounded-md !text-[13px]"
                >
                    Prev
                </Button>
                <Title level={5} className="!m-0 !text-[14px]">
                    <span className="text-[#1890ff]">{currentIndex + 1}</span> / {data.length}
                </Title>
                <Button 
                    type="primary"
                    size="small"
                    onClick={() => setCurrentIndex(p => p + 1)} 
                    disabled={currentIndex === data.length - 1}
                    className="!rounded-md !text-[13px]"
                >
                    Next <RightOutlined />
                </Button>
            </div>

            {/* Main Content - Bỏ cuộn */}
            <div className="mb-3">
                <Row gutter={[12, 12]}>
                    {/* Image Display */}
                    <Col xs={24} md={14}>
                        <Card 
                            title={<span className="text-[13px] font-medium">Original Image</span>}
                            bordered={false}
                            classNames={{
                                body: 'p-2.5',
                                header: 'min-h-[38px] px-3 py-0'
                            }}
                            className="!rounded-lg shadow-md h-full"
                        >
                            <div className="relative rounded-md overflow-hidden bg-gray-100 h-[280px] flex items-center justify-center">
                                <img
                                    src={currentPrediction.imageUrl}
                                    alt={`Prediction ${currentPrediction.key}`}
                                    className="w-full block h-[280px] object-contain"
                                />
                            </div>
                        </Card>
                    </Col>

                    {/* Prediction Results */}
                    <Col xs={24} md={10}>
                        <div className="flex flex-col gap-3 h-full">
                            {/* Predicted Class Card */}
                            <Card 
                                bordered={false}
                                classNames={{ body: 'p-3' }}
                                className="!rounded-lg shadow-md"
                            >
                                <Text type="secondary" className="!text-[13px] block !mb-1.5">
                                    Predicted Class
                                </Text>
                                <Title level={3} className="!m-0">
                                    <Tag 
                                        color="blue" 
                                        className="!text-lg !px-4 !py-1.5 !rounded-md !font-bold"
                                    >
                                        {currentPrediction.class?.toUpperCase()}
                                    </Tag>
                                </Title>
                            </Card>

                            {/* Confidence Score Card */}
                            <Card 
                                bordered={false}
                                classNames={{ body: 'p-3' }}
                                className="!rounded-lg shadow-md bg-white flex-1"
                            >
                                <div>
                                    <Text type="secondary" className="!text-[13px] block !mb-2">
                                        Confidence Score
                                    </Text>
                                    
                                    <div className="flex items-center justify-between mb-3">
                                        <Title level={2} className="!m-0 !text-4xl !font-bold" style={{ color: confidenceStatus.color }}>
                                            {confidencePercent}%
                                        </Title>
                                        <Tag 
                                            icon={confidenceStatus.icon}
                                            color={confidenceStatus.color}
                                            className="!text-sm !px-3 !py-1.5 !rounded-md !font-bold"
                                        >
                                            {confidenceStatus.status}
                                        </Tag>
                                    </div>

                                    <Progress 
                                        percent={parseFloat(confidencePercent)} 
                                        strokeColor={{
                                            '0%': confidenceStatus.color,
                                            '100%': confidenceStatus.color,
                                        }}
                                        trailColor="#f0f0f0"
                                        strokeWidth={10}
                                        showInfo={false}
                                        className="!mb-2.5"
                                    />

                                    <div className="flex justify-between text-[11px] text-[#8c8c8c] mb-2.5">
                                        <span>Low</span>
                                        <span>Medium</span>
                                        <span>High</span>
                                    </div>

                                    <div 
                                        className="p-2 rounded-md border-l-[3px]"
                                        style={{ 
                                            backgroundColor: `${confidenceStatus.color}15`,
                                            borderLeftColor: confidenceStatus.color
                                        }}
                                    >
                                        <Text className="!text-xs !text-[#595959]">
                                            {confidence >= 0.9 && "Highly confident prediction"}
                                            {confidence >= 0.75 && confidence < 0.9 && "Good confidence level"}
                                            {confidence >= 0.6 && confidence < 0.75 && "Moderate confidence"}
                                            {confidence < 0.6 && "Low confidence - review recommended"}
                                        </Text>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Thumbnail Gallery - Cho phép xuống dòng */}
            <div className="shrink-0">
                <Card 
                    title={
                        <span className="text-[11px] font-bold">
                            Gallery ({data.length})
                        </span>
                    }
                    bordered={false}
                    classNames={{
                        body: 'p-[5px]',
                        header: 'min-h-[28px] px-2 py-0'
                    }}
                    className="!rounded-md shadow-md"
                >
                    <div className="flex gap-[5px] flex-wrap py-0.5">
                        {data.map((pred, index) => {
                            const thumbConfidence = pred.confidence || 0;
                            const thumbStatus = getConfidenceStatus(thumbConfidence);
                            const isActive = currentIndex === index;
                            
                            return (
                                <div 
                                    key={index} 
                                    onClick={() => setCurrentIndex(index)} 
                                    className="cursor-pointer relative shrink-0 transition-all duration-300"
                                >
                                    <div 
                                        className="w-[55px] h-[55px] rounded overflow-hidden border-2 transition-all duration-300"
                                        style={{
                                            borderColor: isActive ? thumbStatus.color : 'transparent',
                                            boxShadow: isActive ? `0 2px 6px ${thumbStatus.color}40` : '0 1px 3px rgba(0,0,0,0.1)',
                                            transform: isActive ? 'scale(1.05)' : 'scale(1)'
                                        }}
                                    >
                                        <img
                                            src={pred.imageUrl}
                                            alt={`Thumbnail ${pred.key}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div
                                        className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 text-white px-[3px] py-0 rounded-[5px] text-[7px] font-bold shadow-[0_1px_3px_rgba(0,0,0,0.3)] whitespace-nowrap leading-[1.3]"
                                        style={{ background: thumbStatus.gradient }}
                                    >
                                        {(thumbConfidence * 100).toFixed(0)}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ImageHistoryViewer;