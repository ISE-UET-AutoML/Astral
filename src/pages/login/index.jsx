import React from 'react'
import { message } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import * as auth from 'src/api/auth'
import useAuth from 'src/hooks/useAuth'
import { validateEmail, validatePassword } from 'src/utils/validate'
import { PATHS } from 'src/constants/paths'
import BackgroundShapes from 'src/components/features/landing/BackgroundShapes'
import TextCubeCanvas from 'src/components/features/auth/login/TextCubeCanvas'
import LoginCard from 'src/components/features/auth/login/LoginCard'

const RESPONSIVE_SIZES = {
	xl4k: { minWidth: 1920, sizeHalf: 360, offsetX: -380 },
	xl2: { minWidth: 1536, sizeHalf: 320, offsetX: -340 },
	xl: { minWidth: 1280, sizeHalf: 280, offsetX: -310 },
	lg: { minWidth: 1024, sizeHalf: 240, offsetX: -290 },
	default: { sizeHalf: 200, offsetX: -240 },
}

const loginToLabelStudio = async (lsToken) => {
	const labelStudioBaseUrl =
		process.env.REACT_APP_LABEL_STUDIO_URL || 'http://127.0.0.1:8080'
	const labelStudioLoginUrl = `${labelStudioBaseUrl}/user/login?user_token=${lsToken}`

	try {
		const response = await fetch(labelStudioLoginUrl, {
			credentials: 'include',
		})
		const lsResponse = await response.json()

		if (lsResponse.status !== 'success') {
			console.error('Failed to log into Label Studio.', lsResponse)
		}
	} catch (error) {
		console.error('Error during Label Studio background login:', error)
	}
}

const Login = () => {
	const navigate = useNavigate()
	const { login } = useAuth()
	const { state } = useLocation()
	const [sizeHalf, setSizeHalf] = React.useState(220)
	const [offsetX, setOffsetX] = React.useState(-260)

	React.useEffect(() => {
		const computeResponsiveSize = () => {
			const width = window.innerWidth || 1280

			for (const config of Object.values(RESPONSIVE_SIZES)) {
				if (!config.minWidth || width >= config.minWidth) {
					setSizeHalf(config.sizeHalf)
					setOffsetX(config.offsetX)
					break
				}
			}
		}

		computeResponsiveSize()
		window.addEventListener('resize', computeResponsiveSize)
		return () => window.removeEventListener('resize', computeResponsiveSize)
	}, [])

	const onLogin = async (credential) => {
		try {
			const { data } = await auth.login(credential)

			await login({
				accessToken: data.access_token,
				refreshToken: data.refresh_token,
				userId: data.user.id,
				user: data.user,
			})

			// Handle Label Studio login if token exists
			if (data.user?.ls_token) {
				loginToLabelStudio(data.user.ls_token)
			}

			// Navigate to appropriate page
			const targetPath =
				data.user.email === 'admin@astral.io'
					? '/admin/dashboard'
					: state?.path || PATHS.PROJECTS

			navigate(targetPath, { replace: true })
		} catch (error) {
			console.error('Login error:', error)
			message.error('Invalid login email or password')
		}
	}

	const handleLogin = async (e) => {
		e.preventDefault()
		const formData = new FormData(e.target)
		const email = formData.get('email')
		const password = formData.get('password')
		const credential = {
			email,
			password,
		}

		if (!validateEmail(credential.email)) {
			return message.error('Email is invalid.')
		}

		if (!validatePassword(credential.password)) {
			return message.error('Password is invalid.')
		}

		onLogin(credential)
	}

	return (
		<main className="w-full h-screen font-poppins bg-[#01000A] overflow-hidden">
			<div className="relative w-full h-full">
				<BackgroundShapes
					width="100%"
					height="100%"
					shapes={[
						{
							id: 'loginBlue',
							shape: 'circle',
							size: '520px',
							gradient: {
								type: 'radial',
								shape: 'ellipse',
								colors: [
									'#5C8DFF 0%',
									'#5C8DFF 35%',
									'transparent 75%',
								],
							},
							opacity: 0.45,
							blur: '220px',
							position: { top: '10%', right: '-140px' },
							transform: 'none',
						},
						{
							id: 'loginCyan',
							shape: 'rounded',
							size: '420px',
							gradient: {
								type: 'radial',
								shape: 'circle',
								colors: [
									'#40FFFF 0%',
									'#40FFFF 55%',
									'transparent 40%',
								],
							},
							opacity: 0.3,
							blur: '180px',
							position: { top: '5%', left: '-120px' },
							transform: 'none',
						},
						{
							id: 'loginWarm',
							shape: 'rounded',
							size: '520px',
							gradient: {
								type: 'radial',
								shape: 'circle',
								colors: [
									'#FFAF40 0%',
									'#FFAF40 50%',
									'transparent 85%',
								],
							},
							opacity: 0.2,
							blur: '220px',
							position: { bottom: '-10%', left: '50%' },
							transform: 'translate(-50%, 0%)',
						},
					]}
				/>

				{/* Background 3D shape */}
				<div className="absolute inset-0 z-0 pointer-events-none">
					<TextCubeCanvas
						shapeType="icosahedron"
						offsetX={offsetX}
						rollSpeed={0.005}
						mouseMaxYaw={0.6}
						mouseMaxPitch={0.6}
						followEasing={0.08}
						sizeHalf={sizeHalf}
						cameraZ={420}
						focalLength={360}
					/>
				</div>

				{/* Login form */}
				<div className="relative z-10 w-full h-full flex items-center justify-center px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 2xl:gap-32 items-center w-full max-w-6xl">
						<div className="hidden lg:block" />
						<LoginCard handleLogin={handleLogin} />
					</div>
				</div>
			</div>
		</main>
	)
}

export default Login
