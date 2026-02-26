// Temporary dump data for App messages API (/apps/{app_id}/messages)
// Mirrors the shape of AppMessageList from the backend.

const DUMP_APP_MESSAGES = {
	total: 4,
	items: [
		{
			id: '11111111-1111-1111-1111-111111111111',
			app_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
			role: 'user',
			content: 'Fix the errors in App.tsx and make sure all pages render correctly.',
			adapt_id: 'adapt-run-1',
			version_number: 4,
			created_at: '2026-02-26T10:00:00.000Z',
		},
		{
			id: '22222222-2222-2222-2222-222222222222',
			app_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
			role: 'assistant',
			content:
				"I can see the issue – the imports at the top of App.tsx are incomplete. I'll fix those and ensure all referenced components exist.\n\nPerfect! Now the app should work. All the missing components and imports have been created. The VolunteerHub application is now complete with:\n\n✅ All 14 pages implemented (Landing, Login, Register, Volunteer Dashboard, Events List, Event Detail, Volunteer History, Manager Dashboard, Admin Dashboard, and placeholders for remaining features)\n✅ Brand identity with Coral/Teal/Navy/Gold colors\n✅ Poppins font for headings, Inter for body text\n✅ Responsive design with desktop/tablet/mobile breakpoints\n✅ Complete navigation system (Navbar, Sidebar, Mobile Bottom Nav, Footer)\n✅ Mock authentication system supporting volunteer/manager/admin roles\n✅ Event cards with registration progress\n✅ Stats dashboards for all user types\n✅ Fully functional routing system\n\nThe app is ready to use. Users can navigate between different pages, log in as different roles, and explore the volunteer event management system.",
			adapt_id: 'adapt-run-1',
			version_number: 4,
			created_at: '2026-02-26T10:02:00.000Z',
		},
		{
			id: '33333333-3333-3333-3333-333333333333',
			app_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
			role: 'user',
			content: 'Great, now optimize the bundle size and ensure lazy loading for heavy pages.',
			adapt_id: 'adapt-run-2',
			version_number: 5,
			created_at: '2026-02-26T10:10:00.000Z',
		},
		{
			id: '44444444-4444-4444-4444-444444444444',
			app_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
			role: 'assistant',
			content:
				"I've enabled code-splitting and lazy loading for heavy routes, reduced duplicate dependencies, and ensured that initial load focuses on the most important screens. The bundle size is now significantly smaller and navigation remains smooth.",
			adapt_id: 'adapt-run-2',
			version_number: 5,
			created_at: '2026-02-26T10:12:30.000Z',
		},
	],
}

/**
 * Temporary hook that returns dump messages
 * shaped like the /apps/{app_id}/messages API response.
 *
 * Later you can replace the implementation with a real fetch call.
 *
 * @param {string} appId
 * @returns {{ total: number, items: Array }}
 */
export const useAmtaMessages = (appId) => {
	// appId is currently unused but kept for future API wiring
	void appId
	return DUMP_APP_MESSAGES
}

export default useAmtaMessages

