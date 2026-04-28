import React, { useEffect, useState } from 'react'
import useAdminAuth from 'src/features/auth/hooks/useAdminAuth'
import { useLocation, Navigate } from 'react-router-dom'
import { Spinner } from 'src/components/ui/spinner'
import { Outlet } from 'react-router-dom'

export default function RequireAdminAuth() {
	const { authed, admin, refresh } = useAdminAuth()
	const location = useLocation()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const refreshAuth = async () => {
			try {
				// Refresh to get latest user data
				await refresh()
				// Give state updates a moment to propagate
				setTimeout(() => {
					setLoading(false)
				}, 50)
			} catch (error) {
				console.error('Error refreshing admin auth:', error)
				setLoading(false)
			}
		}

		refreshAuth()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<Spinner className="size-8 text-blue-600" />
			</div>
		)
	}

	if (!authed || !admin) {
		// Non-admin user or not authenticated, redirect to login
		return (
			<Navigate to="/login" replace state={{ path: location.pathname }} />
		)
	}

	return <Outlet />
}
