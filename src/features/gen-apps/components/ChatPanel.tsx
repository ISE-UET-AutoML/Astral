import { useEffect, useRef, useState } from "react";
import { StopCircle, History, Send } from "lucide-react";
import MessagesPanel from "./MessagesPanel";
import ManageVersionPanel from "./ManageVersionPanel";

const TABS = { chat: "chat", history: "history" };

const ChatPanel = ({
  appId,
  input,
  onInputChange,
  onSendMessage,
  isStreaming,
  streamingContent,
  liveMessages,
  onDeployVersion,
}) => {
  const textareaRef = useRef(null);
  const [activeTab, setActiveTab] = useState(TABS.chat);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [input]);

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden border-r border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-slate-900">
      {/* Tabs */}
      <div className="flex h-12 shrink-0 border-b border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setActiveTab(TABS.chat)}
          className={`flex h-full flex-1 items-center justify-center border-b-2 px-4 text-sm font-medium transition-colors -mb-px ${
            activeTab === TABS.chat
              ? "border-blue-500 bg-white text-blue-600 dark:border-blue-400 dark:bg-slate-900 dark:text-white"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Chat
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(TABS.history)}
          className={`flex h-full flex-1 items-center justify-center gap-1.5 border-b-2 px-4 text-sm font-medium transition-colors -mb-px ${
            activeTab === TABS.history
              ? "border-blue-500 bg-white text-blue-600 dark:border-blue-400 dark:bg-slate-900 dark:text-white"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <History className="size-4" />
          History
        </button>
      </div>

      {/* Chat content */}
      {activeTab === TABS.chat && (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <MessagesPanel
            appId={appId}
            liveMessages={liveMessages}
            streamingContent={streamingContent}
            isStreaming={isStreaming}
            onDeployVersion={onDeployVersion}
          />
        </div>
      )}

      {/* History content */}
      {activeTab === TABS.history && (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <ManageVersionPanel appId={appId} onDeployVersion={onDeployVersion} />
        </div>
      )}

      {/* Input bar — only shown in chat tab */}
      {activeTab === TABS.chat && (
        <div className="shrink-0 border-t border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-end gap-1 rounded-xl border border-gray-200 bg-gray-50 px-1 dark:border-white/10 dark:bg-white/5">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              placeholder={
                isStreaming ? "Waiting for response…" : "Enter message…"
              }
              disabled={isStreaming}
              rows={1}
              style={{ overflowY: "hidden", maxHeight: "160px" }}
              className="mx-2 flex-1 resize-none bg-transparent py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:opacity-50 dark:text-white dark:placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={onSendMessage}
              disabled={isStreaming}
              className="mb-1.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-blue-600 disabled:opacity-40 dark:hover:bg-white/10 dark:hover:text-blue-400"
            >
              {isStreaming ? (
                <StopCircle className="size-5" />
              ) : (
                <Send className="size-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
