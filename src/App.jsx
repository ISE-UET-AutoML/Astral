import React from 'react'
import { Router } from './routes'
import { AdminAuthProvider } from './hooks/useAdminAuth'

function App() {
	return (
		<AdminAuthProvider>
			<Router />
		</AdminAuthProvider>
	)
}

export default App
