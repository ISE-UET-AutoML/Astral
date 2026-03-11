import React from 'react'
import { Router } from './routes'
import { AdminAuthProvider } from './hooks/useAdminAuth'
import { Toaster } from "sonner";

function App() {
	return (
		<>
			<Toaster position="top-right" richColors />
			<AdminAuthProvider>
				<Router />
			</AdminAuthProvider>
		</>
	)
}

export default App
