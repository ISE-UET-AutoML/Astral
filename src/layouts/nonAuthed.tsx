import React, { useEffect, useState } from 'react'
import useAuth, { type AuthContextValue } from 'src/features/auth/hooks/useAuth'
import { useLocation, Navigate } from 'react-router-dom'
import { Spinner } from 'src/components/ui/spinner'
import { PATHS } from 'src/constants/paths'
import { Outlet } from 'react-router-dom'

export default function NonAuthed() {
	const { authed, refresh } = useAuth() as AuthContextValue
	const location = useLocation()

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const refreshAuth = async () => {
			await refresh()
			setLoading(false)
		}

		refreshAuth()

		return () => {
			setLoading(true)
		}
	}, [])

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<Spinner className="size-8 text-blue-600" />
			</div>
		)
	}

	const isDemoRoute = location.pathname.startsWith('/demo')

	if (authed && !isDemoRoute) {
		return (
			<Navigate
				to={PATHS.PROJECTS}
				replace
				state={{ path: location.pathname }}
			/>
		)
	}

	return <Outlet />
}
