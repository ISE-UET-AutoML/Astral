const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${8 + ((index * 19) % 84)}%`,
  size: 2 + (index % 4),
  opacity: 0.2 + ((index % 5) * 0.08),
}))

const LandingMotionFX = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden z-[2]"
      aria-hidden="true"
    >
      <div className="landing-neural-grid absolute inset-0 opacity-45" />

      <div
        data-landing="scan-beam"
        className="landing-scan-beam absolute top-0 h-full w-[38vw] opacity-0"
      />

      <div
        data-landing="motion-core"
        className="absolute right-[5%] top-[22%] h-[520px] w-[520px] max-w-[55vw]"
      >
        <span
          data-landing="orbit-ring"
          className="landing-orbit-ring landing-orbit-ring-1"
        />
        <span
          data-landing="orbit-ring"
          className="landing-orbit-ring landing-orbit-ring-2"
        />
        <span
          data-landing="orbit-ring"
          className="landing-orbit-ring landing-orbit-ring-3"
        />
      </div>

      {particles.map((particle) => (
        <span
          key={particle.id}
          data-landing="particle"
          className="landing-particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  )
}

export default LandingMotionFX
