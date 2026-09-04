import { Html } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { memo, useEffect, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import { MathUtils, PCFShadowMap } from 'three'
import type { Group } from 'three'
import ATECC608A from './models/ATECC608A'
import BlackPill from './models/BlackPill'
import { WalletContainer, WalletLid } from './models/WalletChassis'

type ExplodedWalletProps = {
  reducedMotion: boolean
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

const smoothstep = (from: number, to: number, value: number) => {
  const t = clamp01((value - from) / (to - from))
  return t * t * (3 - 2 * t)
}

function Marker({
  position,
  eyebrow,
  title,
  detail,
  progress,
  side,
}: {
  position: [number, number, number]
  eyebrow: string
  title: string
  detail: string
  progress: MutableRefObject<number>
  side: 'left' | 'right'
}) {
  const marker = useRef<HTMLDivElement>(null)

  useFrame(() => {
    if (marker.current) {
      marker.current.style.opacity = String(smoothstep(0.86, 0.97, progress.current))
    }
  })

  return (
    <Html position={position} center zIndexRange={[20, 0]}>
      <div ref={marker} className={`part-marker part-marker--${side}`} style={{ opacity: 0 }}>
        <span>{eyebrow}</span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
    </Html>
  )
}

function WalletAssembly({ progress }: { progress: MutableRefObject<number> }) {
  const assembly = useRef<Group>(null)
  const lid = useRef<Group>(null)
  const board = useRef<Group>(null)
  const secureElement = useRef<Group>(null)
  const container = useRef<Group>(null)
  const { viewport } = useThree()

  const responsiveScale = Math.min(1, viewport.width / 11)

  useFrame((_, delta) => {
    const damping = Math.min(delta, 0.1)
    const rotation = smoothstep(0.12, 0.4, progress.current)
    const explosion = smoothstep(0.42, 0.82, progress.current)

    if (assembly.current) {
      assembly.current.rotation.x = MathUtils.damp(
        assembly.current.rotation.x,
        rotation * 0.7,
        7,
        damping,
      )
      assembly.current.rotation.z = MathUtils.damp(
        assembly.current.rotation.z,
        rotation * -0.36,
        7,
        damping,
      )
      const scale = responsiveScale * MathUtils.lerp(1, 0.76, explosion)
      assembly.current.scale.setScalar(
        MathUtils.damp(assembly.current.scale.x, scale, 6, damping),
      )
      assembly.current.position.y = MathUtils.damp(
        assembly.current.position.y,
        MathUtils.lerp(0, 0.25, explosion),
        6,
        damping,
      )
    }

    if (lid.current) {
      lid.current.position.z = MathUtils.damp(
        lid.current.position.z,
        MathUtils.lerp(1.62, 5.1, explosion),
        6,
        damping,
      )
    }

    if (board.current) {
      board.current.position.z = MathUtils.damp(
        board.current.position.z,
        MathUtils.lerp(0.92, 2.05, explosion),
        6,
        damping,
      )
      board.current.position.x = MathUtils.damp(
        board.current.position.x,
        MathUtils.lerp(0, -0.4, explosion),
        6,
        damping,
      )
    }

    if (secureElement.current) {
      secureElement.current.position.z = MathUtils.damp(
        secureElement.current.position.z,
        MathUtils.lerp(0.6, 0.25, explosion),
        6,
        damping,
      )
      secureElement.current.position.x = MathUtils.damp(
        secureElement.current.position.x,
        MathUtils.lerp(2.55, 2.05, explosion),
        6,
        damping,
      )
    }

    if (container.current) {
      container.current.position.z = MathUtils.damp(
        container.current.position.z,
        MathUtils.lerp(0, -2.2, explosion),
        6,
        damping,
      )
    }
  })

  return (
    <group ref={assembly} scale={responsiveScale}>
      <group ref={container}>
        <WalletContainer />
      </group>
      <group ref={secureElement} position={[2.55, -0.76, 0.6]}>
        <ATECC608A scale={0.88} />
      </group>
      <group ref={board} position={[0, 0, 0.92]}>
        <BlackPill scale={0.88} />
      </group>
      <group ref={lid} position={[0, 0, 1.62]}>
        <WalletLid />
      </group>

      <Marker
        position={[5.9, 1.15, 5.2]}
        eyebrow="01 / INTERFACE"
        title="CHASSIS + CONTROLS"
        detail="OLED · five-way input"
        progress={progress}
        side="right"
      />
      <Marker
        position={[-5.25, 0.7, 2.2]}
        eyebrow="02 / COMPUTE"
        title="STM32F401"
        detail="WeAct BlackPill · 84 MHz"
        progress={progress}
        side="left"
      />
      <Marker
        position={[4.5, -1.35, 0.3]}
        eyebrow="03 / TRUST"
        title="ATECC608A"
        detail="hardware secure element"
        progress={progress}
        side="right"
      />
      <Marker
        position={[-5, -1.4, -2.05]}
        eyebrow="04 / ENCLOSURE"
        title="LOWER CHASSIS"
        detail="protective shell"
        progress={progress}
        side="left"
      />
    </group>
  )
}

const ProductScene = memo(function ProductScene({
  progress,
}: {
  progress: MutableRefObject<number>
}) {
  return (
    <>
      <color attach="background" args={['#171919']} />
      <ambientLight intensity={0.5} color="#d9e0dd" />
      <directionalLight
        castShadow
        color="#fff8ed"
        intensity={3.6}
        position={[-7, 8, 12]}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <directionalLight color="#788f96" intensity={1.25} position={[8, 3, 6]} />
      <spotLight
        color="#ffffff"
        intensity={40}
        angle={0.45}
        penumbra={0.9}
        position={[1, -8, 10]}
      />

      <WalletAssembly progress={progress} />

      <mesh receiveShadow position={[0, 0, -4.1]}>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>
    </>
  )
})

export default function ExplodedWallet({ reducedMotion }: ExplodedWalletProps) {
  const section = useRef<HTMLElement>(null)
  const sceneProgress = useRef(0)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = section.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '100px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    let frame = 0

    const update = () => {
      frame = 0
      const element = section.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const distance = Math.max(1, rect.height - window.innerHeight)
      const nextProgress = clamp01(-rect.top / distance)
      sceneProgress.current = reducedMotion
        ? nextProgress < 0.5
          ? 0
          : 1
        : nextProgress
      setProgress(nextProgress)
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
  }, [reducedMotion, visible])

  const phase =
    progress < 0.14
      ? 'TOP'
      : progress < 0.42
        ? 'ORIENTATION'
        : progress < 0.86
          ? 'ARCHITECTURE'
          : 'COMPONENTS'

  return (
    <section ref={section} id="hardware" className="product" aria-label="NOIR wallet exploded view">
      <div className="product__sticky">
        <div className="product__chrome" aria-hidden="true">
          <span>NOIR / v0</span>
          <span>HARDWARE ARCHITECTURE</span>
        </div>

        <Canvas
          shadows={{ type: PCFShadowMap }}
          frameloop={visible ? 'always' : 'never'}
          dpr={[1, 1.35]}
          camera={{ position: [0, 0, 16], fov: 36, near: 0.1, far: 80 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <ProductScene progress={sceneProgress} />
        </Canvas>

        <div className="phase-readout" aria-live="polite">
          <span>{String(Math.min(4, Math.floor(progress * 4) + 1)).padStart(2, '0')}</span>
          <strong>{phase}</strong>
          <i>
            <b style={{ transform: `scaleX(${progress})` }} />
          </i>
        </div>
      </div>
    </section>
  )
}
