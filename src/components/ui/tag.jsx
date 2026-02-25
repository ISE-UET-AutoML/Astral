import * as React from 'react'
import { cn } from '../../lib/utils'
const variantMap = {
    default: 'bg-gray-700 text-gray-200 border-gray-600',
    primary: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    success: 'bg-green-500/20 text-green-300 border-green-500/40',
    danger: 'bg-red-500/20 text-red-300 border-red-500/40',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    info: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/40' }
/**
 * Tag – replaces antd Tag
 * Usage: <Tag variant="success">Active</Tag>
 *        <Tag color="green">Custom</Tag>  (passthrough via className)
 */
const Tag = React.forwardRef(({ className, variant = 'default', children, ...props }, ref) => (
    <span
        ref={ref}
        className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
            variantMap[variant] ?? variantMap.default,
            className
        )}
        {...props}
    >
        {children}
    </span>
))
Tag.displayName = 'Tag'
export { Tag }
