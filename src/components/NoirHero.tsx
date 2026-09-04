import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'

type NoirHeroProps = {
  reducedMotion: boolean
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

const smoothstep = (from: number, to: number, value: number) => {
  const t = clamp01((value - from) / (to - from))
  return t * t * (3 - 2 * t)
}

export default function NoirHero({ reducedMotion }: NoirHeroProps) {
  const section = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [pointerActive, setPointerActive] = useState(false)
  const pointer = useRef({
    targetX: 68,
    targetY: 34,
    frame: 0,
  })

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const element = section.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const distance = Math.max(1, rect.height - window.innerHeight)
      setProgress(clamp01(-rect.top / distance))
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(
    () => () => {
      if (pointer.current.frame) cancelAnimationFrame(pointer.current.frame)
    },
    [],
  )

  const commitPointer = () => {
    const state = pointer.current
    section.current?.style.setProperty('--pointer-x', `${state.targetX}%`)
    section.current?.style.setProperty('--pointer-y', `${state.targetY}%`)
    state.frame = 0
  }

  const moveLight = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return
    pointer.current.targetX = clamp01(event.clientX / window.innerWidth) * 100
    pointer.current.targetY = clamp01(event.clientY / window.innerHeight) * 100
    setPointerActive(true)
    if (!pointer.current.frame) pointer.current.frame = requestAnimationFrame(commitPointer)
  }

  const restLight = () => {
    pointer.current.targetX = 68
    pointer.current.targetY = 34
    setPointerActive(false)
    if (!pointer.current.frame) pointer.current.frame = requestAnimationFrame(commitPointer)
  }

  const exit = smoothstep(0.08, 0.92, progress)
  const exitOpacity = 1 - smoothstep(0.68, 0.98, progress)
  const cueOpacity = (1 - smoothstep(0.08, 0.44, progress)) * (reducedMotion ? 1 : 0.86)
  const compositionStyle = {
    '--hero-exit-y': `${exit * -44}vh`,
    '--hero-exit-scale': 1 - exit * 0.08,
    opacity: exitOpacity,
  } as CSSProperties

  return (
    <section
      ref={section}
      id="noir"
      className="hero"
      aria-label="NOIR v0"
      data-pointer-active={pointerActive}
      onPointerMove={moveLight}
      onPointerLeave={restLight}
    >
      <div className="hero__sticky">
        <div className="hero__ambient" aria-hidden="true" />
        <div className="hero__composition" style={compositionStyle}>
          <div className="hero__version" aria-hidden="true">
            <span className="hero__version-base">v0</span>
            <span className="hero__version-light">v0</span>
            <svg className="hero__version-streak" focusable="false">
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
                v0
              </text>
            </svg>
          </div>
          <h1 className="hero__wordmark">NOIR</h1>
          <p className="hero__edition">Hardware wallet / version zero</p>
        </div>
        <div className="scroll-cue" style={{ opacity: cueOpacity }} aria-hidden="true">
          <span>Scroll to disassemble</span>
          <i />
        </div>
      </div>
    </section>
  )
}
