import React, { useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { HeartHandshake, Scale, Zap } from 'lucide-react'
import { TRAINING_MODE_TAGS } from 'src/constants/clouldInstance'

const BADGE_BASE =
	'inline-flex min-w-[5.25rem] items-center justify-center rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide'

const MODES = {
	balance: {
		title: 'Balance mode',
		badge: 'DEFAULT',
		badgeClass: `${BADGE_BASE} bg-slate-200/90 text-slate-700 border-slate-300/80 dark:bg-white/10 dark:text-white/90 dark:border-white/15`,
		description:
			'Optimized for standard computational tasks. Maintains efficiency while providing the consistent reliability of the core Astral architecture.',
		iconBoxClass:
			'bg-slate-200/90 text-slate-600 border-slate-300/60 dark:bg-white/10 dark:text-white dark:border-white/15',
		icon: <Scale className="text-3xl md:text-4xl" aria-hidden />,
		buttonClass:
			'relative w-full py-4 md:py-5 px-6 rounded-2xl text-sm md:text-base font-bold tracking-wide text-slate-800 bg-slate-200/90 hover:bg-slate-300/95 border border-slate-300/70 transition-colors shadow-sm dark:text-white dark:bg-white/15 dark:hover:bg-white/20 dark:border-white/20',
		buttonSuffix: <span className="text-lg leading-none" aria-hidden>→</span>,
		cardShadow: 'shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)]',
	},
	max: {
		title: 'Max mode',
		badge: 'IML',
		badgeClass: `${BADGE_BASE} bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-500/20 dark:text-sky-100 dark:border-sky-400/35`,
		description:
			'High-performance tier utilizing IML protocols. Designed for extreme datasets and complex neural architectures requiring maximum throughput.',
		iconBoxClass:
			'bg-sky-100 text-blue-700 border-sky-200/80 dark:bg-sky-500/25 dark:text-sky-50 dark:border-sky-400/40',
		icon: <Zap className="text-3xl md:text-4xl" aria-hidden />,
		buttonClass:
			'relative w-full py-4 md:py-5 px-6 rounded-2xl text-sm md:text-base font-bold tracking-wide text-white bg-blue-600 hover:bg-blue-700 border border-blue-700/30 transition-colors shadow-[0_12px_28px_-6px_rgba(37,99,235,0.45)]',
		buttonSuffix: <Zap className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.5} aria-hidden />,
		cardShadow: 'shadow-[0_24px_56px_-12px_rgba(37,99,235,0.22)] dark:shadow-[0_16px_44px_-10px_rgba(37,99,235,0.35)]',
	},
}

function ModeCardLarge({ spec, onSelect }) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={`group text-left h-full w-full max-w-xl mx-auto flex flex-col gap-6 sm:gap-7 md:gap-8 rounded-[28px] border border-slate-200/90 bg-white p-8 sm:p-10 md:p-12 min-h-[min(440px,72vh)] lg:min-h-[460px] transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:border-[var(--border)] dark:bg-[var(--card-gradient)] dark:focus-visible:ring-offset-[var(--surface)] ${spec.cardShadow}`}
		>
			<div className="flex items-start justify-between gap-4">
				<div
					className={`flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl border ${spec.iconBoxClass}`}
				>
					{spec.icon}
				</div>
				<span className={`shrink-0 ${spec.badgeClass}`}>{spec.badge}</span>
			</div>

			<h2 className="text-2xl sm:text-3xl md:text-[2rem] font-bold text-slate-900 dark:text-[var(--text)] leading-tight">
				{spec.title}
			</h2>

			<p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-[var(--secondary-text)] flex-1 min-h-[5.5rem] sm:min-h-[7.5rem] md:min-h-[8rem]">
				{spec.description}
			</p>

			<div className={`${spec.buttonClass} mt-auto flex w-full shrink-0 items-center`}>
				<span className="w-full text-center pr-9 sm:pr-10">CONTINUE</span>
				<span className="pointer-events-none absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center sm:right-5">
					{spec.buttonSuffix}
				</span>
			</div>
		</button>
	)
}

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
			<div
				className="min-h-full overflow-y-auto py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-10 dark:bg-[var(--surface)]"
			>
				<div className="mx-auto max-w-[1200px] text-center mb-8 sm:mb-12 md:mb-16">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-[var(--title-project)]">
						Choose training mode
					</h1>
					<p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-slate-600 dark:text-[var(--secondary-text)] leading-relaxed">
						Pick how training runs on the cloud. Balance uses Astral defaults; Max
						uses the IML high-throughput tier.
					</p>
					
				</div>

				<div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
					<ModeCardLarge
						spec={MODES.balance}
						onSelect={() => go(TRAINING_MODE_TAGS.balance)}
					/>
					<ModeCardLarge
						spec={MODES.max}
						onSelect={() => go(TRAINING_MODE_TAGS.max)}
					/>
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
							We have fully integrated the partner system into the Astral ecosystem
							as a native component.
						</span>
					</p>
				</div>
			</div>
		</>
	)
}

export default ChooseTrainingMode
