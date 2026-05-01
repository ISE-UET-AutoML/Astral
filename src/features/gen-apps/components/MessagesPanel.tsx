import { useMemo, useEffect, useRef } from "react";
import { Bot, Undo2 } from "lucide-react";
import { Spinner } from "src/components/ui/spinner";
import { useAmtaMessages } from "src/shared/hooks";

const Cursor = () => (
  <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-middle" />
);

// ---------------------------------------------------------------------------
// Version card
// ---------------------------------------------------------------------------
const VersionCard = ({ msg, isOldVersion, onDeployVersion }) => (
  <div className="overflow-hidden rounded-2xl border border-blue-200 bg-blue-50/60 dark:border-blue-500/30 dark:bg-blue-900/10">
    {/* Header */}
    <div className="flex items-center justify-between border-b border-blue-200 px-4 py-2.5 dark:border-blue-500/20">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
          v{msg.version_number}
        </span>
        <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">
          Version {msg.version_number}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {msg.created_at && (
          <span className="text-[11px] text-blue-500/70 dark:text-blue-400/60">
            {new Date(msg.created_at).toLocaleString()}
          </span>
        )}
        {isOldVersion && onDeployVersion && (
          <button
            type="button"
            onClick={() => onDeployVersion(msg.version_number)}
            title={`Revert to Version ${msg.version_number}`}
            className="rounded-full p-1.5 text-blue-500 transition hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-800/40 dark:hover:text-blue-200"
          >
            <Undo2 className="size-4" />
          </button>
        )}
      </div>
    </div>
    {/* Changelog */}
    <div className="px-4 py-3">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400">
        Changelog
      </span>
      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {msg.content}
      </p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Chat bubble
// ---------------------------------------------------------------------------
const ChatBubble = ({ msg, streaming }) => {
  const isAssistant = msg.role === "assistant";

  return (
    <div
      className={`rounded-2xl border transition-colors ${
        isAssistant
          ? "border-gray-200 bg-gray-50 text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
          : "border-gray-200 bg-white text-gray-900 dark:border-white/10 dark:bg-white/10 dark:text-gray-100"
      }`}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {isAssistant && (
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-900/20">
                  <Bot className="size-4 text-blue-500 dark:text-blue-400" />
                </span>
              )}
              {isAssistant ? "Agent" : "You"}
            </span>
            {msg.created_at && !streaming && (
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                {new Date(msg.created_at).toLocaleString()}
              </span>
            )}
          </div>
          <div className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">
            {msg.content}
            {streaming && <Cursor />}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// MessageCard
// ---------------------------------------------------------------------------
const MessageCard = ({ msg, isOldVersion, streaming, onDeployVersion }) => {
  if (msg.role === "assistant" && msg.version_number && !streaming) {
    return (
      <VersionCard
        msg={msg}
        isOldVersion={isOldVersion}
        onDeployVersion={onDeployVersion}
      />
    );
  }
  return <ChatBubble msg={msg} streaming={streaming} />;
};

// ---------------------------------------------------------------------------
// MessagesPanel
// ---------------------------------------------------------------------------
const MessagesPanel = ({
  appId,
  liveMessages = [],
  streamingContent = "",
  isStreaming = false,
  onDeployVersion,
}) => {
  const { items, loading } = useAmtaMessages(appId);
  const scrollContainerRef = useRef(null);

  const sortedHistory = useMemo(
    () =>
      [...(items || [])].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      ),
    [items],
  );

  const lastVersionNumber = useMemo(() => {
    for (let i = sortedHistory.length - 1; i >= 0; i--) {
      if (sortedHistory[i].version_number)
        return sortedHistory[i].version_number;
    }
    return null;
  }, [sortedHistory]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [liveMessages.length, streamingContent, items?.length]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-50 dark:bg-slate-900 [&_::-webkit-scrollbar]:w-1 [&_::-webkit-scrollbar-thumb]:rounded-full [&_::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&_::-webkit-scrollbar-thumb]:bg-white/10 [&_::-webkit-scrollbar-track]:bg-transparent">
      <div
        ref={scrollContainerRef}
        className="min-h-0 flex-1 space-y-3 overflow-auto p-4"
      >
        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-4">
            <Spinner className="size-5 text-blue-500" />
          </div>
        )}

        {/* Persisted messages */}
        {sortedHistory.map((msg) => {
          const isOldVersion =
            msg.role === "assistant" &&
            msg.version_number &&
            lastVersionNumber &&
            msg.version_number < lastVersionNumber;
          return (
            <MessageCard
              key={msg.id}
              msg={msg}
              isOldVersion={isOldVersion}
              onDeployVersion={onDeployVersion}
            />
          );
        })}

        {/* Live optimistic messages */}
        {liveMessages.map((msg) => (
          <MessageCard
            key={msg.id}
            msg={msg}
            onDeployVersion={onDeployVersion}
          />
        ))}

        {/* Streaming bubble */}
        {isStreaming && (
          <MessageCard
            msg={{
              id: "__streaming__",
              role: "assistant",
              content: streamingContent,
              created_at: null,
            }}
            streaming
          />
        )}

        {/* Empty state */}
        {sortedHistory.length === 0 &&
          liveMessages.length === 0 &&
          !isStreaming &&
          !loading && (
            <div className="py-8 text-center text-xs text-gray-400 dark:text-gray-500">
              No messages yet. Send a message to get started.
            </div>
          )}
      </div>
    </div>
  );
};

export default MessagesPanel;
