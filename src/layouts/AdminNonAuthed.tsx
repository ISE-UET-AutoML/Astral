import React, { useEffect, useState } from 'react'
import useAdminAuth from 'src/features/auth/hooks/useAdminAuth'
import { useLocation, Navigate } from 'react-router-dom'
import { Spinner } from 'src/components/ui/spinner'
import { Outlet } from 'react-router-dom'

export default function AdminNonAuthed() {
	const { authed, refresh } = useAdminAuth()
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

	if (authed) {
		// Admin user already authenticated, redirect to admin dashboard
		return (
			<Navigate
				to="/admin/dashboard"
				replace
				state={{ path: location.pathname }}
			/>
		)
	}

	// Non-admin trying to access admin area, redirect to login
	return <Outlet />
}
