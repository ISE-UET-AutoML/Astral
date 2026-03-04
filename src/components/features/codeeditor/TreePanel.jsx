/**
 * Recursive tree component for file navigation
 * @param {{node: object, path: string, onOpen: Function}} props
 */
const Tree = ({ node, path, onOpen }) => {
	const sortedEntries = Object.entries(node.children || {}).sort(([nameA, dataA], [nameB, dataB]) => {
		if (dataA.type === 'dir' && dataB.type !== 'dir') return -1
		if (dataA.type !== 'dir' && dataB.type === 'dir') return 1
		return nameA.localeCompare(nameB, undefined, {
			sensitivity: 'base',
			numeric: true,
			ignorePunctuation: true,
		})
	})

	return (
		<>
			{sortedEntries.map(([name, data]) => {
				const p = path ? `${path}/${name}` : name
				return (
					<div key={p} className="ml-3">
						{data.type === 'dir' ? (
							<details>
								<summary className="cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2a2d2e] px-2 py-1 rounded text-sm text-gray-700 dark:text-[#cccccc] marker:text-gray-500 dark:marker:text-[#888]">
									📁 {name}
								</summary>
								<Tree node={data} path={p} onOpen={onOpen} />
							</details>
						) : (
							<div
								className="cursor-pointer py-1 px-2 hover:bg-blue-50 dark:hover:bg-[#2a2d2e] rounded text-sm flex items-center gap-2 text-gray-700 dark:text-[#cccccc]"
								onClick={() => onOpen(p)}
							>
								📄 {name}
							</div>
						)}
					</div>
				)
			})}
		</>
	)
}

/**
 * Tree panel – header pinned, file list scrollable.
 * @param {{tree: object|null, onOpen: Function}} props
 */
const TreePanel = ({ tree, onOpen }) => {
	return (
		<div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-white dark:bg-[#252526] border-r border-gray-200 dark:border-[#333]">
			<div className="shrink-0 px-4 py-3 border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252526] font-semibold text-gray-700 dark:text-[#cccccc]">
				Files
			</div>
			<div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 text-sm text-gray-700 dark:text-[#cccccc] bg-white dark:bg-[#252526] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-thumb]:rounded-full">
				{tree ? <Tree node={tree} path="" onOpen={onOpen} /> : 'Loading files...'}
			</div>
		</div>
	)
}

export default TreePanel
