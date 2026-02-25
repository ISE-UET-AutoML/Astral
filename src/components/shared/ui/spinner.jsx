import * as React from 'react'
import { cn } from 'src/lib/utils'
const sizeMap = {
    sm: 'h-4 w-4 border-2',
    default: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-2',
    xl: 'h-12 w-12 border-4' }
/**
 * Spinner – replaces antd Spin
 * Usage: <Spinner /> <Spinner size="lg" /> <Spinner className="text-blue-500" />
 */
const Spinner = React.forwardRef(({ className, size = 'default', ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'animate-spin rounded-full border-current border-t-transparent',
            sizeMap[size] ?? sizeMap.default,
            className
        )}
        role="status"
        aria-label="Loading"
        {...props}
    />
))
Spinner.displayName = 'Spinner'
/**
 * SpinnerOverlay – full section loading overlay
 */
const SpinnerOverlay = ({ className, size = 'lg', text }) => (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12', className)}>
        <Spinner size={size} className="text-blue-400" />
        {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
)
export { Spinner, SpinnerOverlay }
