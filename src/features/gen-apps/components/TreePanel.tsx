import { ChevronRight, Folder, FileText } from "lucide-react";
import { useState } from "react";

const TreeNode = ({
  name,
  data,
  path,
  onOpen,
}: {
  name: string;
  data: any;
  path: string;
  onOpen: (path: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  if (data.type === "dir") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
        >
          <ChevronRight
            className={`size-3.5 shrink-0 text-gray-400 transition-transform dark:text-gray-500 ${open ? "rotate-90" : ""}`}
          />
          <Folder className="size-3.5 shrink-0 text-amber-500" />
          <span className="truncate">{name}</span>
        </button>
        {open && (
          <div className="ml-3 border-l border-gray-200 pl-1 dark:border-white/10">
            <Tree node={data} path={path} onOpen={onOpen} />
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(path)}
      className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1 text-left text-sm text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
    >
      <span className="size-3.5 shrink-0" />
      <FileText className="size-3.5 shrink-0 text-blue-400 dark:text-blue-500" />
      <span className="truncate">{name}</span>
    </button>
  );
};

const Tree = ({
  node,
  path,
  onOpen,
}: {
  node: any;
  path: string;
  onOpen: (path: string) => void;
}) => {
  const sortedEntries = Object.entries(node.children || {}).sort(
    ([nameA, dataA]: any, [nameB, dataB]: any) => {
      if (dataA.type === "dir" && dataB.type !== "dir") return -1;
      if (dataA.type !== "dir" && dataB.type === "dir") return 1;
      return nameA.localeCompare(nameB, undefined, {
        sensitivity: "base",
        numeric: true,
        ignorePunctuation: true,
      });
    },
  );

  return (
    <div className="space-y-0.5">
      {sortedEntries.map(([name, data]: any) => {
        const p = path ? `${path}/${name}` : name;
        return (
          <TreeNode key={p} name={name} data={data} path={p} onOpen={onOpen} />
        );
      })}
    </div>
  );
};

const TreePanel = ({
  tree,
  onOpen,
}: {
  tree: any;
  onOpen: (path: string) => void;
}) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900">
      <div className="shrink-0 border-b border-gray-200 px-4 py-2.5 dark:border-white/10">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Files
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
        {tree ? (
          <Tree node={tree} path="" onOpen={onOpen} />
        ) : (
          <p className="px-2 py-4 text-xs text-gray-400 dark:text-gray-500">
            Loading files…
          </p>
        )}
      </div>
    </div>
  );
};

export default TreePanel;
