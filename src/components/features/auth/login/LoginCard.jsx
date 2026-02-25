import React from 'react'

export default function LoginCard({ handleLogin }) {
	return (
		<div className="w-full flex justify-center">
			<div className="w-full max-w-md rounded-3xl px-8 py-9 bg-white/5 backdrop-blur-2xl border border-white/15 shadow-[0_22px_80px_rgba(0,0,0,0.7)]">
				<div className="text-center">
					<img
						src="/PrimaryLogo.svg"
						width={150}
						className="mx-auto"
						alt="ASTRAL"
					/>
					<div className="mt-6 space-y-1.5">
						<h3 className="text-white text-2xl md:text-3xl font-semibold tracking-tight">
							Welcome back
						</h3>
						<p className="text-white/60 text-sm md:text-base">
							Sign in to continue
						</p>
					</div>
				</div>

				<form onSubmit={handleLogin} className="space-y-5 mt-8">
					<div className="space-y-2">
						<label className="font-medium text-sm text-white/80">
							Email
						</label>
						<input
							type="email"
							name="email"
							required
							className="w-full px-3 py-2.5 rounded-2xl bg-white/10 text-white placeholder-white/40 outline-none border border-white/20 focus:border-[#5C8DFF] focus:ring-2 focus:ring-[#5C8DFF]/40 focus:ring-offset-0 focus:ring-offset-transparent transition-colors"
							placeholder="you@example.com"
						/>
					</div>

					<div className="space-y-2">
						<label className="font-medium text-sm text-white/80">
							Password
						</label>
						<input
							type="password"
							name="password"
							required
							className="w-full px-3 py-2.5 rounded-2xl bg-white/10 text-white placeholder-white/40 outline-none border border-white/20 focus:border-[#5C8DFF] focus:ring-2 focus:ring-[#5C8DFF]/40 focus:ring-offset-0 focus:ring-offset-transparent transition-colors"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						className="w-full mt-2 px-4 py-2.5 rounded-2xl text-white text-base md:text-lg font-semibold bg-gradient-to-r from-[#2558FF] to-[#40FF80] shadow-[0_10px_36px_rgba(92,141,255,0.45)] hover:shadow-[0_16px_46px_rgba(92,141,255,0.65)] transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5C8DFF]/70 focus:ring-offset-transparent"
					>
						Login
					</button>
				</form>

				<p className="mt-6 text-center text-white/70 text-sm">
					Don&apos;t have an account?{' '}
					<a
						href="/signup"
						className="font-medium text-[#5C8DFF] hover:text-white"
					>
						Sign up
					</a>
				</p>
			</div>
		</div>
	)
}

