/**
 * Recursive tree component for file navigation
 * @param {{node: object, path: string, onOpen: Function}} props
 */
const Tree = ({ node, path, onOpen }) => {
	// Sort exactly like VS Code: directories first, then files, both alphabetically
	const sortedEntries = Object.entries(node.children || {}).sort(([nameA, dataA], [nameB, dataB]) => {
		// Priority 1: Directories before files
		if (dataA.type === 'dir' && dataB.type !== 'dir') return -1
		if (dataA.type !== 'dir' && dataB.type === 'dir') return 1
		// Priority 2: Within same type, sort alphabetically (case-insensitive, natural sort)
		return nameA.localeCompare(nameB, undefined, {
			sensitivity: 'base',
			numeric: true,
			ignorePunctuation: true
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
								<summary className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded text-sm">📁 {name}</summary>
								<Tree node={data} path={p} onOpen={onOpen} />
							</details>
						) : (
							<div
								className="cursor-pointer py-1 px-2 hover:bg-blue-50 rounded text-sm flex items-center gap-2"
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
 * Tree panel for file navigation
 * @param {{tree: object|null, onOpen: Function}} props
 */
const TreePanel = ({ tree, onOpen }) => {
	return (
		<div className="h-full bg-white border-r border-gray-200 overflow-y-auto relative w-full">
			<div className="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700 sticky top-0 w-full">
				Files
			</div>
			<div className="p-3 text-sm text-gray-700 mt-2">
				{tree ? <Tree node={tree} path="" onOpen={onOpen} /> : 'Loading files...'}
			</div>
		</div>
	)
}

export default TreePanel
