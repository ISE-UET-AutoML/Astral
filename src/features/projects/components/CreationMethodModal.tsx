import React from 'react'
import { Bot as RobotOutlined, User as UserOutlined } from 'lucide-react'
import { motion } from 'framer-motion'
import ChatbotImage from 'src/assets/images/chatbot.png'
import NormalImage from 'src/assets/images/normal.png'

const cx = (...classes) => classes.filter(Boolean).join(' ')
const Modal = ({ open, visible, onCancel, onClose, title, footer, children, width, className = '', centered, ...props }) => { const isOpen = open ?? visible; if (!isOpen) return null; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel || onClose}><div className={cx('max-h-[90vh] overflow-auto rounded-xl border bg-background p-4 shadow-xl', className)} style={{ width: typeof width === 'number' ? width : width || undefined, ...props.style }} onClick={(event) => event.stopPropagation()}>{title && <div className="mb-4 text-lg font-semibold">{title}</div>}{children}{footer !== null && footer !== undefined && <div className="mt-4 flex justify-end gap-2">{footer}</div>}</div></div> }

const CreationMethodModal = ({ open, onCancel, onSelectChatbot, onSelectManual }) => {
    const options = [
        {
            id: 'chatbot',
            title: 'AI Assistant',
            description: 'Let our AI guide you through project creation step by step',
            image: ChatbotImage,
            icon: <RobotOutlined className="text-2xl text-blue-500" />,
            action: onSelectChatbot,
        },
        {
            id: 'normal',
            title: 'Manual Creation',
            description: 'Create your project with full control over all settings',
            image: NormalImage,
            icon: <UserOutlined className="text-2xl text-blue-500" />,
            action: onSelectManual,
        },
    ]

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            width={1000}
            centered
            classNames={{
                content: 'bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-700/15 dark:!from-[#0F2027] dark:!via-[#203A43] dark:!to-[#2C5364]',
                header: 'bg-transparent border-b border-gray-700/10',
            }}
            className="[&_.ant-modal-title]:dark:!text-white [&_.ant-modal-close]:dark:!text-white"
        >
            <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    How would you like to create your project?
                </h2>
                <p className="text-gray-500 dark:text-gray-400">Choose the method that works best for you</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
                {options.map((option) => (
                    <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div
                            onClick={option.action}
                            className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-blue-400 dark:hover:border-blue-400/50 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 cursor-pointer"
                        >
                            <div className="p-4 overflow-hidden rounded-t-xl bg-gray-50 dark:bg-black/20">
                                <img
                                    alt={option.title}
                                    src={option.image}
                                    className="w-full rounded-lg brightness-90"
                                />
                            </div>
                            <div className="p-4 flex items-start gap-3">
                                <div>{option.icon}</div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{option.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Modal>
    )
}

export default CreationMethodModal
