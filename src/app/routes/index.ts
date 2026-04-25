import authed from './authed'
import nonAuthed from './nonAuthed'
import error404 from './404'
import testing from './testing'
import admin from './admin'
import { createElement } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

export const router = createBrowserRouter([
	authed,
	nonAuthed,
	admin,
	error404,
	testing,
])

export function Router() {
	return createElement(RouterProvider, { router })
}
