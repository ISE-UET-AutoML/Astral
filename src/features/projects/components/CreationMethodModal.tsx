import { Bot, PenLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import ChatbotImage from "src/assets/images/chatbot.png";
import NormalImage from "src/assets/images/normal.png";

const options = [
  {
    id: "chatbot",
    title: "AI Assistant",
    description: "Let AI guide you through project setup",
    Icon: Bot,
    image: ChatbotImage,
  },
  {
    id: "normal",
    title: "Manual Creation",
    description: "Configure every setting yourself",
    Icon: PenLine,
    image: NormalImage,
  },
];

const CreationMethodModal = ({
  open,
  onCancel,
  onSelectChatbot,
  onSelectManual,
}) => {
  const actions = { chatbot: onSelectChatbot, normal: onSelectManual };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="w-full max-w-5xl sm:max-w-5xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-900 dark:text-white">
            How would you like to create your project?
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            Choose the method that works best for you
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {options.map(({ id, title, description, Icon, image }) => (
            <button
              key={id}
              type="button"
              onClick={actions[id]}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:bg-slate-800 dark:hover:border-blue-500/40"
            >
              {/* Fixed-height image area */}
              <div className="flex h-full w-full items-center justify-center overflow-hidden bg-gray-50 px-4 pt-4 dark:bg-white/5">
                <img
                  alt={title}
                  src={image}
                  className="h-full w-full object-contain brightness-90 dark:brightness-75"
                />
              </div>

              {/* Info */}
              <div className="flex items-center gap-2.5 p-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
                  <Icon className="size-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {title}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreationMethodModal;
