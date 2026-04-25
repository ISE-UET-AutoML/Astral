import React, { useEffect, useMemo, useRef } from 'react'

function usePrefersReducedMotion() {
	const query = useMemo(
		() =>
			typeof window !== 'undefined'
				? window.matchMedia('(prefers-reduced-motion: reduce)')
				: null,
		[]
	)
	return query?.matches ?? false
}

export default function AstralCanvas({
	shapeType: _shapeType,
	offsetX = 0,
	rollSpeed: _rollSpeed,
	baseSpinYaw = 0.0025,
	mouseMaxYaw = 0.45,
	mouseMaxPitch = 0.35,
	followEasing = 0.04,
	logoSrc = '/PrimaryLogo.svg',
	logoWidth = 400,
	sizeHalf: _sizeHalf,
	cameraZ: _cameraZ,
	focalLength: _focalLength,
}) {
	const canvasRef = useRef(null)
	const containerRef = useRef(null)
	const prefersReducedMotion = usePrefersReducedMotion()

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		const container = containerRef.current
		let animId
		let W = 0,
			H = 0,
			cx = 0,
			cy = 0
		let yaw = 0.5,
			pitch = 0.3
		let tYaw = 0,
			tPitch = 0

		// ── Geometry ──────────────────────────────────────────────
		// 3 orbital rings at different tilts
		const rings = [
			{
				rx: 1.0,
				ry: 0.28,
				rz: 0.95,
				tilt: 0.0,
				phase: 0,
				count: 80,
				speed: 0.0004,
			},
			{
				rx: 0.85,
				ry: 0.85,
				rz: 0.28,
				tilt: Math.PI * 0.33,
				phase: 1.1,
				count: 70,
				speed: 0.0006,
			},
			{
				rx: 0.28,
				ry: 0.95,
				rz: 0.88,
				tilt: Math.PI * 0.62,
				phase: 2.3,
				count: 60,
				speed: 0.0003,
			},
		]

		// Floating particles scattered in space
		const floaters = Array.from({ length: 55 }, () => {
			const theta = Math.random() * Math.PI * 2
			const phi = Math.acos(2 * Math.random() - 1)
			const r = 60 + Math.random() * 110
			return {
				x: r * Math.sin(phi) * Math.cos(theta),
				y: r * Math.sin(phi) * Math.sin(theta),
				z: r * Math.cos(phi),
				size: 0.6 + Math.random() * 1.4,
				alpha: 0.25 + Math.random() * 0.55,
				twinkle: Math.random() * Math.PI * 2,
				twinkleSpeed: 0.5 + Math.random() * 1.5,
			}
		})

		function resize() {
			const r = container.getBoundingClientRect()
			W = Math.max(200, Math.floor(r.width))
			H = Math.max(200, Math.floor(r.height))
			canvas.width = W
			canvas.height = H
			cx = W / 2 + offsetX
			cy = H / 2
		}

		function onMouseMove(e) {
			const r = container.getBoundingClientRect()
			if (r.width > 0 && r.height > 0) {
				tYaw =
					((e.clientX - r.left - r.width / 2) / (r.width / 2)) *
					mouseMaxYaw
				tPitch =
					((e.clientY - r.top - r.height / 2) / (r.height / 2)) *
					mouseMaxPitch
			}
		}

		function mulMV(m, [x, y, z]) {
			return [
				m[0] * x + m[1] * y + m[2] * z,
				m[3] * x + m[4] * y + m[5] * z,
				m[6] * x + m[7] * y + m[8] * z,
			]
		}

		function rotMat(y, p) {
			const cy = Math.cos(y),
				sy = Math.sin(y)
			const cp = Math.cos(p),
				sp = Math.sin(p)
			return [cy, sy * sp, sy * cp, 0, cp, -sp, -sy, cy * sp, cy * cp]
		}

		// Scale factor driven by container size
		function scale() {
			return Math.min(W, H) / 520
		}

		function project(x, y, z, R, CAM_Z, FOCAL) {
			const [px, py, pz] = mulMV(R, [x, y, z])
			const z2 = pz + CAM_Z
			if (z2 <= 0.1) return { x: 0, y: 0, z: z2, pz, clip: true }
			return {
				x: (FOCAL * px) / z2 + cx,
				y: (FOCAL * py) / z2 + cy,
				z: z2,
				pz,
				clip: false,
			}
		}

		function draw(t) {
			ctx.clearRect(0, 0, W, H)

			yaw += (tYaw - yaw) * followEasing + baseSpinYaw
			pitch += (tPitch - pitch) * followEasing

			const s = scale()
			const CAM_Z = 520
			const FOCAL = 400 * s
			const RADIUS = 155 * s
			const R = rotMat(yaw, pitch)

			// ── Subtle ambient center glow ──────────────────────
			if (
				Number.isFinite(cx) &&
				Number.isFinite(cy) &&
				Number.isFinite(RADIUS)
			) {
				const ambient = ctx.createRadialGradient(
					cx,
					cy,
					0,
					cx,
					cy,
					Math.max(0.1, RADIUS * 1.1)
				)
				ambient.addColorStop(0, 'rgba(0,200,255,0.05)')
				ambient.addColorStop(0.5, 'rgba(0,120,220,0.025)')
				ambient.addColorStop(1, 'rgba(0,0,0,0)')
				ctx.fillStyle = ambient
				ctx.fillRect(0, 0, W, H)
			}

			// ── Floating background particles ───────────────────
			floaters.forEach((f) => {
				const p = project(f.x * s, f.y * s, f.z * s, R, CAM_Z, FOCAL)
				if (p.clip) return
				const sc = Math.max(0.3, Math.min(1.5, 500 / p.z))
				const twk =
					0.6 + 0.4 * Math.sin(t * 0.001 * f.twinkleSpeed + f.twinkle)
				const al =
					f.alpha *
					twk *
					Math.max(0.1, Math.min(1, (500 / p.z) * 0.9))

				ctx.fillStyle = `rgba(120,220,255,${al * 0.7})`
				ctx.shadowColor = `rgba(80,200,255,${al * 0.5})`
				ctx.shadowBlur = 4 * sc
				ctx.beginPath()
				ctx.arc(p.x, p.y, f.size * sc, 0, Math.PI * 2)
				ctx.fill()
			})

			// ── Orbital rings ────────────────────────────────────
			rings.forEach((ring, ri) => {
				const ringAngle = t * 0.001 * ring.speed * 1000 + ring.phase

				// Build ring points in local space then rotate
				const pts3d = []
				for (let i = 0; i < ring.count; i++) {
					const theta = (i / ring.count) * Math.PI * 2 + ringAngle
					// Ellipse in local plane
					const lx = RADIUS * ring.rx * Math.cos(theta)
					const ly = RADIUS * ring.ry * Math.sin(theta)
					const lz = RADIUS * ring.rz * Math.sin(theta) * 0.15

					// Tilt ring around Z axis
					const ct = Math.cos(ring.tilt),
						st = Math.sin(ring.tilt)
					const tx = lx * ct - ly * st
					const ty = lx * st + ly * ct
					pts3d.push({ x: tx, y: ty, z: lz })
				}

				// Project all ring points
				const projected = pts3d.map((p) =>
					project(p.x, p.y, p.z, R, CAM_Z, FOCAL)
				)

				// Draw per-segment for depth fading
				for (let i = 0; i < ring.count; i++) {
					const p0 = projected[i]
					const p1 = projected[(i + 1) % ring.count]
					if (p0.clip || p1.clip) continue
					const avgZ = (p0.z + p1.z) * 0.5
					const ds = Math.max(0.3, Math.min(1.4, 500 / avgZ))
					const al = Math.max(
						0.03,
						Math.min(0.3, (480 / avgZ) * 0.25)
					)

					ctx.strokeStyle = `rgba(0,210,255,${al})`
					ctx.shadowColor = `rgba(0,180,255,0.3)`
					ctx.shadowBlur = 3 * ds
					ctx.lineWidth = 0.7 * ds
					ctx.lineCap = 'round'
					ctx.beginPath()
					ctx.moveTo(p0.x, p0.y)
					ctx.lineTo(p1.x, p1.y)
					ctx.stroke()
				}

				// Draw dots on ring — only every Nth for sparsity
				const step = ri === 0 ? 8 : ri === 1 ? 10 : 12
				for (let i = 0; i < ring.count; i += step) {
					const p = projected[i]
					if (
						p.clip ||
						!Number.isFinite(p.x) ||
						!Number.isFinite(p.y)
					)
						continue
					const sc = Math.max(0.3, Math.min(1.5, 500 / p.z))
					const al = Math.max(0.1, Math.min(0.95, (500 / p.z) * 0.85))

					// Halo
					const haloRadius = Math.max(0.1, 6 * sc)
					const g = ctx.createRadialGradient(
						p.x,
						p.y,
						0,
						p.x,
						p.y,
						haloRadius
					)
					g.addColorStop(0, `rgba(0,230,255,${al * 0.7})`)
					g.addColorStop(0.4, `rgba(0,180,255,${al * 0.2})`)
					g.addColorStop(1, 'rgba(0,150,255,0)')
					ctx.fillStyle = g
					ctx.shadowBlur = 0
					ctx.beginPath()
					ctx.arc(p.x, p.y, haloRadius, 0, Math.PI * 2)
					ctx.fill()

					// Core
					ctx.fillStyle = `rgba(180,240,255,${al})`
					ctx.shadowColor = `rgba(0,220,255,0.8)`
					ctx.shadowBlur = Math.max(0, 8 * sc)
					ctx.beginPath()
					ctx.arc(p.x, p.y, Math.max(0.1, 1.8 * sc), 0, Math.PI * 2)
					ctx.fill()
				}
			})

			// Center core (bright dot) removed — logo + ambient glow handle focus

			ctx.shadowBlur = 0
		}

		function loop(t) {
			draw(t)
			animId = requestAnimationFrame(loop)
		}

		resize()
		window.addEventListener('resize', resize)
		window.addEventListener('mousemove', onMouseMove)
		if (!prefersReducedMotion) requestAnimationFrame(loop)
		else draw(0)

		return () => {
			cancelAnimationFrame(animId)
			window.removeEventListener('resize', resize)
			window.removeEventListener('mousemove', onMouseMove)
		}
	}, [
		offsetX,
		baseSpinYaw,
		mouseMaxYaw,
		mouseMaxPitch,
		followEasing,
		prefersReducedMotion,
	])

	return (
		<div ref={containerRef} className="w-full h-full relative">
			<canvas ref={canvasRef} className="w-full h-full block" />
			{/* Logo — absolute center, pointer-events-none so mouse still controls canvas */}
			<img
				src={logoSrc}
				width={logoWidth}
				alt="ASTRAL"
				className="pointer-events-none"
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					// Shift logo so the bright core sits near the end of the word "ASTRAL",
					// và hạ logo xuống thêm ~10% theo trục Y (gần tâm hơn).
					transform: `translate(-50%, -30%) translateX(${offsetX - logoWidth * 0.1}px)`,
				}}
			/>
		</div>
	)
}
