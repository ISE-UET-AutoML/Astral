import * as React from 'react'
import { cn } from 'src/lib/utils'
import { Inbox, UploadCloud, File, X as XIcon } from 'lucide-react'
/**
 * FileDragger – replaces antd Upload.Dragger
 *
 * Usage:
 * <FileDragger
 *   accept=".jpg,.png,.csv"
 *   multiple
 *   fileList={fileList}
 *   onChange={(files) => setFileList(files)}
 *   onRemove={(file) => ...}
 *   maxSize={20}   // MB
 *   title="Click or drag file to this area"
 *   hint="Support JPG, PNG, CSV. Max 20MB."
 * />
 */
const FileDragger = ({
    accept,
    multiple = false,
    fileList = [],
    onChange,
    onRemove,
    maxSize,         // MB
    title,
    hint,
    className,
    disabled = false }) => {
    const inputRef = React.useRef(null)
    const [isDragging, setIsDragging] = React.useState(false)
    const processFiles = (rawFiles) => {
        const arr = Array.from(rawFiles)
        const valid = arr.filter((f) => {
            if (maxSize && f.size / 1024 / 1024 > maxSize) return false
            return true
        })
        // Build antd-compatible file objects
        const wrapped = valid.map((f) => ({
            uid: `${Date.now()}-${Math.random()}`,
            name: f.name,
            size: f.size,
            type: f.type,
            originFileObj: f,
            status: 'done' }))
        const next = multiple ? [...fileList, ...wrapped] : wrapped.slice(0, 1)
        onChange?.(next)
    }
    const onInputChange = (e) => {
        processFiles(e.target.files)
        e.target.value = ''
    }
    const onDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        if (disabled) return
        processFiles(e.dataTransfer.files)
    }
    return (
        <div className={cn('space-y-2', className)}>
            {/* Drop zone */}
            <div
                onClick={() => !disabled && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className={cn(
                    'flex flex-col items-center justify-center gap-3 rounded-xl p-8 cursor-pointer',
                    'border-2 border-dashed transition-all duration-200',
                    isDragging
                        ? 'border-blue-400 bg-blue-500/10'
                        : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <UploadCloud className="h-10 w-10 text-blue-400 opacity-80" />
                    <p className="text-sm font-medium text-gray-200">
                        {title ?? 'Click or drag file to this area to upload'}
                    </p>
                    {hint && (
                        <p className="text-xs text-gray-500 max-w-xs">{hint}</p>
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={onInputChange}
                    className="sr-only"
                    disabled={disabled}
                />
            </div>
            {/* File list */}
            {fileList.length > 0 && (
                <ul className="space-y-1 max-h-48 overflow-y-auto rounded-lg border border-white/10 p-2">
                    {fileList.map((file) => (
                        <li
                            key={file.uid}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-white/5"
                        >
                            <File className="h-4 w-4 shrink-0 text-blue-400" />
                            <span className="flex-1 truncate text-gray-300">{file.name}</span>
                            <span className="shrink-0 text-xs text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                            </span>
                            {onRemove && (
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); onRemove(file) }}
                                    className="shrink-0 rounded p-0.5 text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <XIcon className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
export { FileDragger }
