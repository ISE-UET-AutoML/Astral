import { useEffect } from "react"
import type { RefObject } from "react"
import {
  animate,
  createTimeline,
  stagger,
  splitText,
  spring,
  type JSAnimation,
  type TextSplitter,
  type Timeline,
} from "animejs"

/**
 * Hero intro + ambient motion (anime.js v4), scoped under `rootRef`.
 * Respects `prefers-reduced-motion: reduce`.
 */
export function useLandingPageAnime(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const q = (sel: string) => root.querySelector<HTMLElement>(sel)
    const qAll = (sel: string) =>
      Array.from(root.querySelectorAll<HTMLElement>(sel))

    const line1 = q('[data-landing="hero-line-1"]')
    const line2 = q('[data-landing="hero-line-2"]')
    const sub = q('[data-landing="hero-sub"]')
    const cta = q('[data-landing="hero-cta"]')
    const robot = q('[data-landing="hero-robot"]')
    const orb = q('[data-landing="orb"]')
    const scanBeam = q('[data-landing="scan-beam"]')
    const decoTl = q('[data-landing="deco-grid-tl"]')
    const decoBr = q('[data-landing="deco-grid-br"]')
    const particles = qAll('[data-landing="particle"]')
    const orbitRings = qAll('[data-landing="orbit-ring"]')

    const loopAnims: JSAnimation[] = []
    let intro: Timeline | null = null
    let headlineSplit: TextSplitter | null = null
    const heroChars = line1
      ? ((headlineSplit = splitText(line1, {
          words: false,
          chars: { class: "landing-title-char" },
        })).chars as HTMLElement[])
      : []

    if (line1 && line2 && sub && cta) {
      const buttons = cta.querySelectorAll<HTMLElement>(
        "[data-slot='button'], a[data-slot='button'], button"
      )

      intro = createTimeline({ defaults: { ease: "out(3)" } })

      if (orb) {
        intro.add(
          orb,
          {
            opacity: [0, 0.9],
            scale: [0.65, 1],
            duration: 1500,
            ease: "out(3)",
          },
          0
        )
      }

      intro
        .add(
          line1,
          {
            opacity: [0, 1],
            y: [52, 0],
            filter: ["blur(14px)", "blur(0px)"],
            duration: 900,
          },
          orb ? 80 : 0
        )
        .add(
          line2,
          {
            opacity: [0, 1],
            y: [40, 0],
            rotate: ["-1.5deg", "0deg"],
            scale: [0.92, 1],
            duration: 1100,
            ease: spring({ stiffness: 220, damping: 22 }),
          },
          "<+=120"
        )
        .add(
          sub,
          {
            opacity: [0, 1],
            y: [28, 0],
            filter: ["blur(10px)", "blur(0px)"],
            duration: 780,
            ease: "outQuart",
          },
          "<+=90"
        )

      if (heroChars.length) {
        loopAnims.push(
          animate(heroChars, {
            y: [
              { to: "-2.75rem", ease: "outExpo", duration: 600 },
              { to: 0, ease: "outBounce", duration: 800, delay: 100 },
            ],
            rotate: {
              from: "-1turn",
              delay: 0,
            },
            delay: stagger(50),
            ease: "inOutCirc",
            loopDelay: 1000,
            loop: true,
          })
        )
      }

      if (buttons.length) {
        intro.add(
          buttons,
          {
            opacity: [0, 1],
            y: [22, 0],
            scale: [0.94, 1],
            duration: 720,
            delay: stagger(100, { from: "first" }),
            ease: "out(3)",
          },
          "<+=140"
        )
      }
    }

    if (robot) {
      loopAnims.push(
        animate(robot, {
          y: [0, -24, 0, 12, 0],
          rotate: [0, 0.7, -0.45, 0.25, 0],
          scale: [1, 1.015, 1],
          duration: 9800,
          ease: "inOutSine",
          loop: true,
        })
      )
    }

    if (line2) {
      loopAnims.push(
        animate(line2, {
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          duration: 4200,
          ease: "inOutSine",
          loop: true,
        })
      )
    }

    if (heroChars.length) {
      loopAnims.push(
        animate(heroChars, {
          scale: [1, 1.08, 1],
          filter: ["drop-shadow(0 0 0 rgba(101,255,160,0))", "drop-shadow(0 0 16px rgba(101,255,160,.55))", "drop-shadow(0 0 0 rgba(101,255,160,0))"],
          duration: 2400,
          delay: stagger(58, { from: "center" }),
          ease: "inOutSine",
          loop: true,
        })
      )
    }

    if (particles.length) {
      loopAnims.push(
        animate(particles, {
          y: [80, -180],
          x: [-32, 42],
          opacity: [0, 0.95, 0],
          scale: [0.45, 1.35, 0.65],
          duration: 6200,
          delay: stagger(145, { from: "random" }),
          ease: "inOutSine",
          loop: true,
        })
      )
    }

    if (orbitRings.length) {
      loopAnims.push(
        animate(orbitRings, {
          rotate: [0, 360],
          duration: 16000,
          delay: stagger(900),
          ease: "linear",
          loop: true,
        })
      )
    }

    if (scanBeam) {
      loopAnims.push(
        animate(scanBeam, {
          opacity: [0, 0.72, 0],
          x: ["-10vw", "155vw"],
          duration: 5200,
          delay: 900,
          ease: "inOutQuad",
          loop: true,
        })
      )
    }

    if (decoTl) {
      loopAnims.push(
        animate(decoTl, {
          y: [0, -10, 0],
          x: [0, 6, 0],
          duration: 11000,
          ease: "inOutSine",
          loop: true,
        })
      )
    }
    if (decoBr) {
      loopAnims.push(
        animate(decoBr, {
          y: [0, 12, 0],
          x: [0, -8, 0],
          duration: 13000,
          ease: "inOutSine",
          loop: true,
        })
      )
    }

    return () => {
      intro?.cancel()
      for (const a of loopAnims) {
        a.cancel()
      }
      headlineSplit?.revert()
    }
  }, [rootRef])
}
