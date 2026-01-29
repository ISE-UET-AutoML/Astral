import React from 'react'
import { Router } from './routes'
import TeacherDayTheme from './components/themes/teacher-day'
import ChristmasTheme from './components/themes/christmas'
import LunarNewYearTheme from './components/themes/lunarnewyear'
import { AdminAuthProvider } from './hooks/useAdminAuth'

function App() {
	return (
		<AdminAuthProvider>
			<LunarNewYearTheme />
			<Router />
		</AdminAuthProvider>
	)
}

export default App
