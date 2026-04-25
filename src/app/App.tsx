import { Router } from './routes'
import { AdminAuthProvider } from 'src/features/auth/hooks/useAdminAuth'
import { Toaster } from 'src/components/ui/sonner'

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
