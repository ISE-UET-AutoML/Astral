import { Bot as RobotOutlined, User as UserOutlined } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import ChatbotImage from "src/assets/images/chatbot.png";
import NormalImage from "src/assets/images/normal.png";

const CreationMethodModal = ({
  open,
  onCancel,
  onSelectChatbot,
  onSelectManual,
}) => {
  const options = [
    {
      id: "chatbot",
      title: "AI Assistant",
      description: "Let our AI guide you through project creation step by step",
      image: ChatbotImage,
      icon: <RobotOutlined className="text-2xl text-blue-500" />,
      action: onSelectChatbot,
    },
    {
      id: "normal",
      title: "Manual Creation",
      description: "Create your project with full control over all settings",
      image: NormalImage,
      icon: <UserOutlined className="text-2xl text-blue-500" />,
      action: onSelectManual,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>How would you like to create your project?</DialogTitle>
          <DialogDescription>
            Choose the method that works best for you
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {options.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={option.action}
                className="w-full flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-blue-400 dark:hover:border-blue-400/50 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 text-left"
              >
                <div className="p-4 overflow-hidden bg-gray-50 dark:bg-black/20">
                  <img
                    alt={option.title}
                    src={option.image}
                    className="w-full rounded-xl brightness-90"
                  />
                </div>
                <div className="p-4 flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0">{option.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {option.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreationMethodModal;
