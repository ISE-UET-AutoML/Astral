import * as React from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
/**
 * Dropdown – replaces antd Dropdown + Menu
 * 
 * Usage:
 * <Dropdown
 *   trigger={<Button>Options</Button>}
 *   items={[
 *     { key: '1', label: 'Edit', onClick: () => {} },
 *     { key: '2', label: 'Delete', danger: true, onClick: () => {} },
 *     { type: 'divider' },
 *     { key: '3', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
 *   ]}
 * />
 */
const Dropdown = ({
    trigger,
    items = [],
    placement = 'bottom-end',
    className }) => {
    const alignClass = placement.includes('start') ? 'left-0' : 'right-0'
    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button as={Fragment}>{trigger}</Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 scale-95 translate-y-1"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-1"
            >
                <Menu.Items
                    className={cn(
                        'absolute z-50 mt-2 w-48 origin-top-right rounded-xl shadow-xl',
                        'bg-gray-900/95 backdrop-blur-sm border border-white/10',
                        'focus:outline-none overflow-hidden',
                        alignClass,
                        className
                    )}
                >
                    {items.map((item, idx) => {
                        if (item.type === 'divider') {
                            return <div key={`divider-${idx}`} className="h-px bg-white/10 my-1" />
                        }
                        return (
                            <Menu.Item key={item.key ?? idx}>
                                {({ active }) => (
                                    <button
                                        onClick={item.onClick}
                                        disabled={item.disabled}
                                        className={cn(
                                            'flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors',
                                            active
                                                ? item.danger
                                                    ? 'bg-red-500/20 text-red-300'
                                                    : 'bg-white/10 text-white'
                                                : item.danger
                                                    ? 'text-red-400'
                                                    : 'text-gray-300',
                                            item.disabled && 'opacity-40 cursor-not-allowed'
                                        )}
                                    >
                                        {item.icon && <span className="shrink-0">{item.icon}</span>}
                                        {item.label}
                                    </button>
                                )}
                            </Menu.Item>
                        )
                    })}
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
/**
 * DropdownButton – convenience wrapper with a default chevron button trigger
 */
const DropdownButton = ({ label, items, className, triggerClassName, ...props }) => (
    <Dropdown
        items={items}
        trigger={
            <button
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm',
                    'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300',
                    'transition-colors focus:outline-none',
                    triggerClassName
                )}
            >
                {label}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
        }
        className={className}
        {...props}
    />
)
export { Dropdown, DropdownButton }
