import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { Button as UiButton } from "src/components/ui/button";
import { Input as UiInput } from "src/components/ui/input";
import { Badge as UiBadge } from "src/components/ui/badge";
import { Spinner as UiSpinner } from "src/components/ui/spinner";
import {
  Tooltip as UiTooltip,
  TooltipContent as UiTooltipContent,
  TooltipProvider as UiTooltipProvider,
  TooltipTrigger as UiTooltipTrigger,
} from "src/components/ui/tooltip";
import {
  Paperclip as PaperClipOutlined,
  Send as SendOutlined,
  Database as DatabaseOutlined,
  CirclePlay as PlayCircleOutlined,
  CirclePlus as PlusCircleOutlined,
  Bot as RobotOutlined,
} from "lucide-react";
import MarkdownRenderer from "@/src/features/projects/components/MarkdownRenderer";
import logoIcon from "src/assets/images/logoIcon.png";
const cx = (...classes) => classes.filter(Boolean).join(" ");
const Spin = ({ tip, children, className = "", ...props }) => (
  <div className={cx("inline-flex items-center gap-2", className)} {...props}>
    <UiSpinner />
    {tip && <span>{tip}</span>}
    {children}
  </div>
);
const Button = ({
  children,
  icon,
  loading,
  disabled,
  htmlType,
  type,
  className = "",
  ...props
}) => (
  <UiButton
    type={htmlType || "button"}
    disabled={disabled || loading}
    className={className}
    {...props}
  >
    {loading && <UiSpinner className="mr-2" />}
    {icon && <span className="inline-flex">{icon}</span>}
    {children}
  </UiButton>
);
const Input = ({ className = "", ...props }) => (
  <UiInput className={className} {...props} />
);
Input.TextArea = ({ className = "", ...props }) => (
  <textarea
    className={cx(
      "min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
      className,
    )}
    {...props}
  />
);
const Tag = ({ color, children, className = "", ...props }) => (
  <UiBadge className={className} {...props}>
    {children}
  </UiBadge>
);
const Tooltip = ({ title, children, ...props }) => (
  <UiTooltipProvider>
    <UiTooltip>
      <UiTooltipTrigger asChild>{children || <span />}</UiTooltipTrigger>
      {title && <UiTooltipContent {...props}>{title}</UiTooltipContent>}
    </UiTooltip>
  </UiTooltipProvider>
);
const Typography = {
  Title: ({ level = 3, children, className = "", ...props }) => {
    const Heading = `h${level}`;
    return (
      <Heading className={cx("font-semibold", className)} {...props}>
        {children}
      </Heading>
    );
  },
  Text: ({ children, className = "", ...props }) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
  Paragraph: ({ children, className = "", ...props }) => (
    <p className={className} {...props}>
      {children}
    </p>
  ),
};
const Space = ({
  children,
  className = "",
  direction = "horizontal",
  size = 8,
  ...props
}) => (
  <div
    className={cx(
      "flex",
      direction === "vertical" ? "flex-col" : "flex-row items-center",
      className,
    )}
    style={{ gap: typeof size === "number" ? size : undefined, ...props.style }}
    {...props}
  >
    {children}
  </div>
);
const Modal = ({
  open,
  visible,
  onCancel,
  onClose,
  title,
  footer,
  children,
  width,
  className = "",
  centered,
  ...props
}) => {
  const isOpen = open ?? visible;
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 p-4 supports-backdrop-filter:backdrop-blur-sm"
      onClick={onCancel || onClose}
    >
      <div
        className={cx(
          "max-h-[90vh] overflow-auto rounded-xl border bg-background p-4 shadow-xl",
          className,
        )}
        style={{
          width: typeof width === "number" ? width : width || undefined,
          ...props.style,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {title && <div className="mb-4 text-lg font-semibold">{title}</div>}
        {children}
        {footer !== null && footer !== undefined && (
          <div className="mt-4 flex justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
};

const { TextArea } = Input;
const { Title } = Typography;

const ChatMessage = ({ message, role }) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 self-end">
          <img src={logoIcon} alt="Assistant" />
        </div>
      )}
      <div
        className={clsx(
          "relative max-w-[70%] rounded-xl border border-gray-200 dark:border-gray-700 px-2 py-0 pl-2 pr-2",
          isUser
            ? "rounded-tr-none bg-gray-700 text-white"
            : "rounded-tl-none bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200",
        )}
      >
        {message.content === "loading..." ? (
          <div className="flex items-center justify-center p-4">
            <Spin size="small" />
          </div>
        ) : (
          <MarkdownRenderer markdownText={message.content} />
        )}
      </div>
    </div>
  );
};

const AIAssistantModal = ({
  open,
  onCancel,
  messages,
  showTitle,
  showChatbotButtons,
  input,
  setInput,
  handleKeyPress,
  selectedDataset,
  datasets,
  getDatasets,
  newChat,
  proceedFromChat,
  chatContainerRef,
  setShowTitle,
  setMessages,
  setShowChatbotButtons,
  isLoading = false,
}) => {
  const [showCreateButton, setShowCreateButton] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      const lastAssistantMessage = messages
        .filter((m) => m.role === "assistant")
        .pop();
      if (lastAssistantMessage && lastAssistantMessage.content.length > 300) {
        setShowCreateButton(true);
      } else {
        setShowCreateButton(false);
      }
    }
  }, [messages]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1000}
      centered
      maskClosable={false} // Prevents closing when clicking outside
      keyboard={false} // Prevents closing when pressing Esc
      styles={{
        body: {
          padding: 0,
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
    >
      <div className="flex flex-col h-[650px] mt-6">
        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-auto p-4 space-y-4 relative"
        >
          {showTitle ? (
            <div className="text-center my-12 space-y-4">
              <RobotOutlined className="text-6xl text-blue-600 mb-4" />
              <Title level={2}>How can I help with?</Title>
            </div>
          ) : (
            <div>
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                  role={message.role}
                />
              ))}

              {isLoading && (
                <div className="flex justify-center my-4">
                  <Spin size="large" tip="Generating response..." />
                </div>
              )}
            </div>
          )}

          {showChatbotButtons && showCreateButton && (
            <div className="flex justify-center space-x-4 mt-6">
              <Button
                icon={<PlayCircleOutlined />}
                onClick={proceedFromChat}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Create Now
              </Button>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="mb-2 bg-gray-50 dark:bg-gray-800">
          {selectedDataset && (
            <Tag color="blue" icon={<DatabaseOutlined />} className="mb-2">
              {datasets[selectedDataset].title}
            </Tag>
          )}

          <div className="flex space-x-2">
            <div className="">
              <Button
                icon={<PlusCircleOutlined />}
                onClick={newChat}
                className="text-blue-600 hover:bg-blue-700"
              >
                New
              </Button>
            </div>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your project goals..."
              autoSize={{ minRows: 1, maxRows: 6 }}
              className="flex-1"
            />

            <Space>
              <Tooltip title="Attach dataset">
                <Button
                  type="text"
                  icon={<PaperClipOutlined />}
                  onClick={getDatasets}
                />
              </Tooltip>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                icon={<SendOutlined />}
                onClick={() => {
                  if (input.trim()) {
                    setShowTitle(false);
                    setShowChatbotButtons(true);
                    setMessages([
                      ...messages,
                      {
                        role: "user",
                        content: input,
                      },
                      {
                        role: "assistant",
                        content: "loading...",
                      },
                    ]);
                    setInput("");
                  }
                }}
              ></Button>
            </Space>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AIAssistantModal;
