import React from 'react'

export default function LoginCard({ handleLogin }) {
    return (
        <div className="w-full">
            <div className="backdrop-blur-xl rounded-2xl p-8 border border-white/10" className="bg-white/[0.06] shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                <div className="text-center">
                    <img
                        src="/PrimaryLogo.svg"
                        width={150}
                        className="mx-auto"
                        alt="ASTRAL"
                    />
                    <div className="mt-6 space-y-2">
                        <h3 className="text-white text-2xl font-semibold">Welcome back</h3>
                        <p className="text-white/60 text-sm">Sign in to continue</p>
                    </div>
                </div>
                <form onSubmit={handleLogin} className="space-y-5 mt-8">
                    <div>
                        <label className="font-medium text-white/80">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full mt-2 px-3 py-2 text-white placeholder-white/50 bg-white/10 outline-none border border-white/20 focus:border-white/40 shadow-sm rounded-2xl"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="font-medium text-white/80">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full mt-2 px-3 py-2 text-white placeholder-white/50 bg-white/10 outline-none border border-white/20 focus:border-white/40 shadow-sm rounded-2xl"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        className="w-full px-4 py-2 text-white text-lg font-semibold rounded-2xl duration-200"
                        className="shadow-[0_6px_24px_rgba(92,141,255,0.35)]" style={{ background: 'linear-gradient(135deg,rgb(37, 88, 255) 0%,rgb(64, 255, 128) 100%)' }}
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-white/70 text-sm">
                    Don't have an account?{' '}
                    <a
                        href="/signup"
                        className="font-medium"
                        className="text-[#5C8DFF]"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    )
}


