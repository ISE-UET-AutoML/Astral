import React, { useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { ColumnWidthOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shared/ui/card'
import { TRAINING_MODE_TAGS } from 'src/constants/clouldInstance'

const ModeCard = ({ title, description, badge, icon, onSelect, accentClass }) => (
	<button
		type="button"
		onClick={onSelect}
		className={`group text-left w-full rounded-2xl border transition-all duration-300 p-0 h-full min-h-[220px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] ${accentClass}`}
	>
		<Card className="h-full border-0 bg-transparent shadow-none rounded-2xl">
			<CardHeader className="pb-2">
				<div className="flex items-start justify-between gap-3">
					<CardTitle className="text-xl font-semibold text-[var(--text)] flex items-center gap-2">
						<span className="text-[var(--accent-text)] opacity-90 group-hover:opacity-100 transition-opacity">
							{icon}
						</span>
						{title}
					</CardTitle>
					{badge && (
						<span className="shrink-0 text-xs font-medium px-2 py-1 rounded-lg border [border-color:var(--border)] bg-[var(--input-bg)] text-[var(--secondary-text)]">
							{badge}
						</span>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-[var(--secondary-text)] text-sm leading-relaxed">{description}</p>
				<span className="mt-6 inline-flex items-center text-sm font-medium text-[var(--accent-text)] group-hover:underline">
					Continue →
				</span>
			</CardContent>
		</Card>
	</button>
)

const ChooseTrainingMode = () => {
	const navigate = useNavigate()
	const { projectInfo, updateFields, selectedProject } = useOutletContext()

	useEffect(() => {
		if (!projectInfo?.id) return
		if (!selectedProject?.dataset_id) {
			navigate(`/app/project/${projectInfo.id}/build/uploadData`, {
				replace: true,
			})
		}
	}, [projectInfo?.id, selectedProject, navigate])

	const go = (tag) => {
		if (!projectInfo?.id) return
		updateFields({ trainingTag: tag })
		navigate(`/app/project/${projectInfo.id}/build/selectInstance`)
	}

	return (
		<>
			<style>{`
				body, html {
					background-color: var(--surface) !important;
				}
			`}</style>
			<div
				className="h-full overflow-y-auto px-3 py-8 sm:px-6 lg:px-8"
				style={{ background: 'var(--surface)' }}
			>
				<div className="mx-auto max-w-4xl text-center mb-10">
					<h1
						className="text-4xl md:text-5xl font-bold mb-4"
						style={{ color: 'var(--title-project)' }}
					>
						Choose training mode
					</h1>
					<p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--secondary-text)' }}>
						Balance mode keeps the familiar Astral training path. Max mode uses the IML training tier
						for heavier workloads.
					</p>
				</div>

				<div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
					<ModeCard
						title="Balance mode"
						badge="Default"
						description="Same experience as before: sensible defaults and cost-aware instance selection. Sends tag astral to training."
						icon={
							<ColumnWidthOutlined
								className="text-2xl text-[var(--accent-text)]"
								aria-hidden
							/>
						}
						accentClass="border-[var(--border)] [background:var(--card-gradient)] hover:border-emerald-500/40 hover:shadow-lg"
						onSelect={() => go(TRAINING_MODE_TAGS.balance)}
					/>
					<ModeCard
						title="Max mode"
						badge="IML"
						description="Maximum training tier for demanding jobs. Sends tag iml to the training API."
						icon={
							<ThunderboltOutlined
								className="text-2xl text-[var(--accent-text)]"
								aria-hidden
							/>
						}
						accentClass="border-[var(--border)] [background:var(--card-gradient)] hover:border-violet-500/40 hover:shadow-lg"
						onSelect={() => go(TRAINING_MODE_TAGS.max)}
					/>
				</div>
			</div>
		</>
	)
}

export default ChooseTrainingMode
