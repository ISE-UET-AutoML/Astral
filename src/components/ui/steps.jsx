import * as React from 'react'
import { cn } from '../../lib/utils'
import { CheckCircle2 } from 'lucide-react'
/**
 * Steps – replaces antd Steps
 * 
 * Usage:
 * <Steps current={1} items={[
 *   { title: 'Upload Data' },
 *   { title: 'Configure' },
 *   { title: 'Deploy' },
 * ]} />
 */
const Steps = ({ current = 0, items = [], className, direction = 'horizontal' }) => {
    const isHorizontal = direction === 'horizontal'
    return (
        <div
            className={cn(
                isHorizontal
                    ? 'flex items-start'
                    : 'flex flex-col gap-0',
                className
            )}
        >
            {items.map((item, idx) => {
                const isDone = idx < current
                const isActive = idx === current
                const isLast = idx === items.length - 1
                return (
                    <div
                        key={item.key ?? idx}
                        className={cn(
                            isHorizontal ? 'flex-1 flex flex-col items-center' : 'flex items-start gap-3',
                            !isLast && (isHorizontal ? '' : 'pb-6')
                        )}
                    >
                        {/* Circle + connector */}
                        <div className={cn('flex', isHorizontal ? 'items-center w-full' : 'flex-col items-center')}>
                            {/* Left connector (horizontal) */}
                            {isHorizontal && idx > 0 && (
                                <div className={cn('flex-1 h-0.5 rounded', isDone || isActive ? 'bg-blue-500' : 'bg-white/10')} />
                            )}
                            {/* Circle */}
                            <div
                                className={cn(
                                    'relative flex items-center justify-center rounded-full shrink-0 transition-all duration-300',
                                    isHorizontal ? 'h-8 w-8 text-sm font-bold' : 'h-7 w-7 text-xs font-bold',
                                    isDone ? 'bg-blue-500 text-white' :
                                        isActive ? 'bg-blue-500 text-white ring-4 ring-blue-500/30' :
                                            'bg-white/10 text-gray-500 border border-white/20'
                                )}
                            >
                                {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                            </div>
                            {/* Right connector (horizontal) */}
                            {isHorizontal && !isLast && (
                                <div className={cn('flex-1 h-0.5 rounded', isDone ? 'bg-blue-500' : 'bg-white/10')} />
                            )}
                            {/* Vertical connector */}
                            {!isHorizontal && !isLast && (
                                <div className={cn('w-0.5 flex-1 mt-1 rounded', isDone ? 'bg-blue-500' : 'bg-white/10')} style={{ minHeight: 24 }} />
                            )}
                        </div>
                        {/* Label */}
                        <div className={cn(isHorizontal ? 'mt-2 text-center' : 'ml-3 mt-0.5')}>
                            {item.title && (
                                <p className={cn('text-sm font-medium', isActive ? 'text-white' : isDone ? 'text-blue-400' : 'text-gray-500')}>
                                    {item.title}
                                </p>
                            )}
                            {item.description && (
                                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
export { Steps }
