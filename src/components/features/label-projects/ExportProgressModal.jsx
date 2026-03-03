import React from 'react'
import { DataPreparingIcon } from 'src/assets/svgicon'

export function ExportProgressModal({ isExporting }) {
	if (!isExporting) return null

	return (
		<div className="absolute inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

			<div className="relative z-10 w-full max-w-md">
				<div className="rounded-2xl shadow-2xl overflow-hidden border [background:var(--modal-bg)] [border-color:var(--modal-border)]">
					<div className="px-8 py-6 border-b [background:var(--modal-header-bg)] [border-color:var(--modal-header-border)]">
						<div className="flex items-center justify-center">
							<div className="relative">
								<div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin">
									<div className="w-14 h-14 rounded-full m-1 flex items-center justify-center [background:var(--modal-bg)]">
										<DataPreparingIcon className="w-6 h-6 animate-pulse text-[var(--accent-text)]" />
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="px-8 py-6 text-center">
						<h3 className="text-xl font-semibold mb-3 text-[var(--modal-title-color)]">
							Preparing Your Data
						</h3>
						<p className="leading-relaxed text-[var(--text)]">
							The system is exporting labels and preparing your data for
							training.
							<br />
							<span className="text-sm mt-2 block text-[var(--secondary-text)]">
								This process may take a few minutes. Please do not close this
								window.
							</span>
						</p>

						<div className="mt-6">
							<div className="flex justify-center space-x-1">
								<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]" />
								<div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:150ms]" />
								<div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:300ms]" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

