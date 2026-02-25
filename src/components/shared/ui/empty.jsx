import * as React from 'react'
import { cn } from 'src/lib/utils'
import { Inbox } from 'lucide-react'
/**
 * Empty – replaces antd Empty
 * Usage: <Empty />
 *        <Empty description="No results found" />
 *        <Empty icon={<SearchX />} description="No matches" />
 */
const Empty = ({ className, icon, description = 'No data', children }) => (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12 text-center', className)}>
        <div className="text-gray-600">
            {icon ?? <Inbox className="h-12 w-12 mx-auto" />}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
        {children}
    </div>
)
export { Empty }
