import Editor from "@monaco-editor/react";
import { useTheme } from "src/theme/ThemeProvider";

const getLanguageFromFile = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "py":
      return "python";
    case "js":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "json":
      return "json";
    case "html":
      return "html";
    case "css":
      return "css";
    case "scss":
      return "scss";
    case "md":
      return "markdown";
    case "yaml":
    case "yml":
      return "yaml";
    case "xml":
      return "xml";
    case "sql":
      return "sql";
    case "sh":
    case "bash":
      return "shell";
    default:
      return "plaintext";
  }
};

const MONACO_OPTIONS = {
  readOnly: false,
  minimap: { enabled: true },
  automaticLayout: true,
  fontSize: 14,
  renderValidationDecorations: "off" as const,
  tabCompletion: "on" as const,
  quickSuggestionsDelay: 50,
  suggestOnTriggerCharacters: true,
  suggest: { showWords: true, showSnippets: true },
  quickSuggestions: { other: true, comments: false, strings: true },
  parameterHints: { enabled: true },
  acceptSuggestionOnCommitCharacter: true,
  acceptSuggestionOnEnter: "on" as const,
  inlineSuggest: { enabled: true },
  wordBasedSuggestions: "allDocuments" as const,
  snippetSuggestions: "inline" as const,
};

const CodeEditorPanel = ({
  currentFile,
  code,
  originalCode,
  isSaving,
  isDeploying,
  onCodeChange,
  onSave,
  onDeploy,
}: {
  currentFile: string;
  code: string;
  originalCode: string;
  isSaving?: boolean;
  isDeploying?: boolean;
  onCodeChange: (v: string) => void;
  onSave?: () => void;
  onDeploy?: () => void;
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const hasUnsavedChanges = code !== originalCode;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900">
      {/* File tab bar */}
      {currentFile && (
        <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-white/10 dark:bg-slate-900">
          <span className="truncate text-sm text-gray-700 dark:text-gray-300">
            {currentFile}
          </span>
          {isSaving && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Saving…
            </span>
          )}
          {!isSaving && hasUnsavedChanges && (
            <span
              className="size-2 shrink-0 rounded-full bg-amber-400"
              title="Unsaved changes"
            />
          )}
        </div>
      )}

      {/* Monaco editor */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <Editor
          height="100%"
          path={currentFile || "untitled"}
          language={getLanguageFromFile(currentFile)}
          theme={isDark ? "vs-dark" : "vs-light"}
          value={code}
          onChange={(v) => onCodeChange(v ?? "")}
          options={MONACO_OPTIONS}
        />
      </div>
    </div>
  );
};

export default CodeEditorPanel;
