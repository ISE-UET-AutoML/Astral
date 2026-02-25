import * as React from 'react'
import { cn } from 'src/lib/utils'
/**
 * Progress – replaces antd Progress
 * Usage: <Progress value={65} />
 *        <Progress value={80} showInfo size="sm" status="success" />
 */
const Progress = React.forwardRef(({
    className,
    value = 0,
    max = 100,
    size = 'default',
    status,     // 'success' | 'exception' | 'active'
    showInfo = false,
    color,
    ...props
}, ref) => {
    const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)))
    const trackH = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2'
    const fillColor = color
        ? color
        : status === 'success'
            ? 'bg-green-500'
            : status === 'exception'
                ? 'bg-red-500'
                : 'bg-gradient-to-r from-[#5C8DFF] to-[#65FFA0]'
    return (
        <div ref={ref} className={cn('w-full', className)} {...props}>
            <div className={cn('w-full rounded-full bg-white/10 overflow-hidden', trackH)}>
                <div
                    className={cn('h-full rounded-full transition-all duration-500', fillColor)}
                    style={{ width: `${pct}%` }}
                />
            </div>
            {showInfo && (
                <span className="mt-1 block text-right text-xs text-gray-400">{pct}%</span>
            )}
        </div>
    )
})
Progress.displayName = 'Progress'
export { Progress }
