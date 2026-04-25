import { PATHS } from 'src/constants/paths'
import NonAuthed from 'src/layouts/nonAuthed'
import Home from 'src/features/landing/pages/home'
import Login from 'src/features/auth/pages/login'
import SignUp from 'src/features/auth/pages/signup'
import ProjectDemo from 'src/features/demo/pages/demo/ProjectDemo'


const routes = {
	element: <NonAuthed />,
	children: [
		{
			path: PATHS.ROOT,
			element: <Home />,
		},
		{
			path: PATHS.LOGIN,
			element: <Login />,
		},
		{
			path: PATHS.SIGNUP,
			element: <SignUp />,
		},
		{
			path: '/demo/:projectId',
			element: <ProjectDemo />,
		},
	],
}

export default routes
