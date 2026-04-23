import React, { useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Check, HeartHandshake, Scale, Zap } from 'lucide-react'
import { TRAINING_MODE_TAGS } from 'src/constants/clouldInstance'

const BADGE_BASE =
	'inline-flex min-w-[5.25rem] items-center justify-center rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide'

const MODES = {
	astral: {
		title: 'Astral',
		badge: 'ASTRAL',
		badgeClass: `${BADGE_BASE} bg-slate-200/90 text-slate-700 border-slate-300/80 dark:bg-white/10 dark:text-white/90 dark:border-white/15`,
		description:
			'Train with the core Astral pipeline. This keeps the standard single-experiment flow and uses Astral defaults for cloud training.',
		iconBoxClass:
			'bg-slate-200/90 text-slate-600 border-slate-300/60 dark:bg-white/10 dark:text-white dark:border-white/15',
		icon: <Scale className="text-3xl md:text-4xl" aria-hidden />,
		buttonClass:
			'relative w-full py-4 md:py-5 px-6 rounded-2xl text-sm md:text-base font-bold tracking-wide text-slate-800 bg-slate-200/90 hover:bg-slate-300/95 border border-slate-300/70 transition-colors shadow-sm dark:text-white dark:bg-white/15 dark:hover:bg-white/20 dark:border-white/20',
		buttonSuffix: (
			<span className="text-lg leading-none" aria-hidden>
				→
			</span>
		),
		cardShadow:
			'shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)]',
	},
	iml: {
		title: 'iML',
		badge: 'IML',
		badgeClass: `${BADGE_BASE} bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-500/20 dark:text-sky-100 dark:border-sky-400/35`,
		description:
			'Train with the iML pipeline. This also runs as a single experiment, but routes training through the iML-backed flow.',
		iconBoxClass:
			'bg-sky-100 text-blue-700 border-sky-200/80 dark:bg-sky-500/25 dark:text-sky-50 dark:border-sky-400/40',
		icon: <Zap className="text-3xl md:text-4xl" aria-hidden />,
		buttonClass:
			'relative w-full py-4 md:py-5 px-6 rounded-2xl text-sm md:text-base font-bold tracking-wide text-white bg-blue-600 hover:bg-blue-700 border border-blue-700/30 transition-colors shadow-[0_12px_28px_-6px_rgba(37,99,235,0.45)]',
		buttonSuffix: (
			<Zap
				className="h-[1.125rem] w-[1.125rem]"
				strokeWidth={2.5}
				aria-hidden
			/>
		),
		cardShadow:
			'shadow-[0_24px_56px_-12px_rgba(37,99,235,0.22)] dark:shadow-[0_16px_44px_-10px_rgba(37,99,235,0.35)]',
	},
}

function ModeCardLarge({ spec, selected, onToggle }) {
	return (
		<button
			type="button"
			onClick={onToggle}
			aria-pressed={selected}
			className={`group text-left h-full w-full max-w-xl mx-auto flex flex-col gap-6 sm:gap-7 md:gap-8 rounded-[28px] border border-slate-200/90 bg-white p-8 sm:p-10 md:p-12 min-h-[min(440px,72vh)] lg:min-h-[460px] transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:border-[var(--border)] dark:bg-[var(--card-gradient)] dark:focus-visible:ring-offset-[var(--surface)] ${spec.cardShadow} ${
				selected
					? 'border-blue-400 ring-2 ring-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.15)]'
					: ''
			}`}
		>
			<div className="flex items-start justify-between gap-4">
				<div
					className={`flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl border ${spec.iconBoxClass}`}
				>
					{spec.icon}
				</div>
				<span className={`shrink-0 ${spec.badgeClass}`}>
					{selected ? 'SELECTED' : spec.badge}
				</span>
			</div>

			<h2 className="text-2xl sm:text-3xl md:text-[2rem] font-bold text-slate-900 dark:text-[var(--text)] leading-tight">
				{spec.title}
			</h2>

			<p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-[var(--secondary-text)] flex-1 min-h-[5.5rem] sm:min-h-[7.5rem] md:min-h-[8rem]">
				{spec.description}
			</p>

			<div
				className={`${spec.buttonClass} mt-auto flex w-full shrink-0 items-center`}
			>
				<span className="w-full text-center pr-9 sm:pr-10">
					{selected ? 'SELECTED' : 'SELECT'}
				</span>
				<span className="pointer-events-none absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center sm:right-5">
					{selected ? (
						<Check
							className="h-[1.125rem] w-[1.125rem]"
							strokeWidth={2.5}
							aria-hidden
						/>
					) : (
						spec.buttonSuffix
					)}
				</span>
			</div>
		</button>
	)
}

const ChooseTrainingMode = () => {
	const navigate = useNavigate()
	const {
		projectInfo,
		updateFields,
		selectedProject,
		trainingTags = [],
	} = useOutletContext()
	const selectedTags = Array.isArray(trainingTags) ? trainingTags : []

	useEffect(() => {
		if (!projectInfo?.id) return
		if (!selectedProject?.dataset_id) {
			navigate(`/app/project/${projectInfo.id}/build/uploadData`, {
				replace: true,
			})
		}
	}, [projectInfo?.id, selectedProject, navigate])

	const toggleTag = (tag) => {
		updateFields({
			trainingTags: selectedTags.includes(tag)
				? selectedTags.filter((value) => value !== tag)
				: [...selectedTags, tag],
		})
	}

	const handleContinue = () => {
		if (!projectInfo?.id || selectedTags.length === 0) return
		navigate(`/app/project/${projectInfo.id}/build/selectInstance`)
	}

	return (
		<>
			<div className="min-h-full overflow-y-auto py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-10 dark:bg-[var(--surface)]">
				<div className="mx-auto max-w-[1200px] text-center mb-8 sm:mb-12 md:mb-16">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-[var(--title-project)]">
						Choose training mode
					</h1>
					<p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-slate-600 dark:text-[var(--secondary-text)] leading-relaxed">
						Select one or more training pipelines for this run. Each
						selected method starts its own experiment and its own
						cloud instance.
					</p>
				</div>

				<div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
					<ModeCardLarge
						spec={MODES.astral}
						selected={selectedTags.includes(
							TRAINING_MODE_TAGS.astral
						)}
						onToggle={() => toggleTag(TRAINING_MODE_TAGS.astral)}
					/>
					<ModeCardLarge
						spec={MODES.iml}
						selected={selectedTags.includes(TRAINING_MODE_TAGS.iml)}
						onToggle={() => toggleTag(TRAINING_MODE_TAGS.iml)}
					/>
				</div>

				<div className="mx-auto mt-10 flex max-w-[1200px] justify-center">
					<button
						type="button"
						onClick={handleContinue}
						disabled={selectedTags.length === 0}
						className="inline-flex min-w-[280px] items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold tracking-wide text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
					>
						{selectedTags.length === 0
							? 'Select at least one method'
							: `Continue with ${selectedTags.length} method${selectedTags.length > 1 ? 's' : ''}`}
					</button>
				</div>

				<div className="mx-auto max-w-3xl px-2 mt-10 sm:mt-14 md:mt-16">
					<p
						className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2.5 text-center text-xs sm:text-sm leading-relaxed text-slate-400 dark:text-slate-500/90"
						role="note"
					>
						<HeartHandshake
							className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem] shrink-0 text-slate-400 dark:text-slate-500"
							strokeWidth={1.5}
							aria-hidden
						/>
						<span>
							We have fully integrated the partner system into the
							Astral ecosystem as a native component.
						</span>
					</p>
				</div>
			</div>
		</>
	)
}

export default ChooseTrainingMode
