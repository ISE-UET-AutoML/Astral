import React from 'react'
import { Modal } from 'antd'
import { RobotOutlined, UserOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import ChatbotImage from 'src/assets/images/chatbot.png'
import NormalImage from 'src/assets/images/normal.png'

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
            styles={{
                content: { background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)', borderRadius: '16px', border: '1px solid rgba(31,41,55,0.15)' },
                header: { background: 'transparent', borderBottom: '1px solid rgba(31,41,55,0.1)' },
            }}
            className="dark:[&_.ant-modal-content]:!bg-gradient-to-br dark:[&_.ant-modal-content]:!from-[#0F2027] dark:[&_.ant-modal-content]:!via-[#203A43] dark:[&_.ant-modal-content]:!to-[#2C5364] dark:[&_.ant-modal-title]:!text-white dark:[&_.ant-modal-close]:!text-white"
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
