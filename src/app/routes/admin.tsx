import AdminDashboard from 'src/features/admin/pages/admin/dashboard'
import AdminUserDetail from 'src/features/admin/pages/admin/user'
import RequireAdminAuth from 'src/layouts/RequireAdminAuth'

const adminRoutes = {
	path: '/admin',
	children: [
		{
			element: <RequireAdminAuth />,
			children: [
				{
					path: 'dashboard',
					element: <AdminDashboard />,
				},
				{
					path: 'user/:userId',
					element: <AdminUserDetail />,
				},
			],
		},
	],
}

export default adminRoutes
