import { RoundedBox, Text3D } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import {
  CanvasTexture,
  ExtrudeGeometry,
  Path,
  Shape,
  SRGBColorSpace,
} from 'three'
import helvetiker from '../../assets/font'

const SHELL = '#deded8'
const SHELL_EDGE = '#b8bab5'
const CONTROL = '#c8cac6'
const INK = '#373a39'
const SCREEN = '#041013'
const CYAN = '#68f2ff'

type GroupProps = ThreeElements['group']

function chamferedShape(width: number, height: number, cut: number) {
  const halfWidth = width / 2
  const halfHeight = height / 2
  const shape = new Shape()
  shape.moveTo(-halfWidth + cut, -halfHeight)
  shape.lineTo(halfWidth - cut, -halfHeight)
  shape.lineTo(halfWidth, -halfHeight + cut)
  shape.lineTo(halfWidth, halfHeight - cut)
  shape.lineTo(halfWidth - cut, halfHeight)
  shape.lineTo(-halfWidth + cut, halfHeight)
  shape.lineTo(-halfWidth, halfHeight - cut)
  shape.lineTo(-halfWidth, -halfHeight + cut)
  shape.closePath()
  return shape
}

function chamferedPath(
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  cut: number,
) {
  const halfWidth = width / 2
  const halfHeight = height / 2
  const path = new Path()
  path.moveTo(centerX - halfWidth + cut, centerY - halfHeight)
  path.lineTo(centerX - halfWidth, centerY - halfHeight + cut)
  path.lineTo(centerX - halfWidth, centerY + halfHeight - cut)
  path.lineTo(centerX - halfWidth + cut, centerY + halfHeight)
  path.lineTo(centerX + halfWidth - cut, centerY + halfHeight)
  path.lineTo(centerX + halfWidth, centerY + halfHeight - cut)
  path.lineTo(centerX + halfWidth, centerY - halfHeight + cut)
  path.lineTo(centerX + halfWidth - cut, centerY - halfHeight)
  path.closePath()
  return path
}

function rectanglePath(centerX: number, centerY: number, width: number, height: number) {
  const path = new Path()
  path.moveTo(centerX - width / 2, centerY - height / 2)
  path.lineTo(centerX - width / 2, centerY + height / 2)
  path.lineTo(centerX + width / 2, centerY + height / 2)
  path.lineTo(centerX + width / 2, centerY - height / 2)
  path.closePath()
  return path
}

function useOledTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const context = canvas.getContext('2d')
    if (!context) return null

    context.fillStyle = SCREEN
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.strokeStyle = '#17444b'
    context.lineWidth = 3
    context.strokeRect(12, 12, 488, 232)
    context.fillStyle = CYAN
    context.textAlign = 'center'
    context.font = '700 58px monospace'
    context.fillText('NOIR', 256, 88)
    context.font = '24px monospace'
    context.fillText('WALLET  /  v0', 256, 132)
    context.fillStyle = '#31949e'
    context.fillRect(54, 166, 404, 2)
    context.fillStyle = CYAN
    context.font = '20px monospace'
    context.fillText('SECURE  •  READY', 256, 210)

    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    return texture
  }, [])
}

function ButtonArrow({ rotation = 0 }: { rotation?: number }) {
  const geometry = useMemo(() => {
    const shape = new Shape()
    shape.moveTo(0, 0.13)
    shape.lineTo(-0.12, -0.1)
    shape.lineTo(0.12, -0.1)
    shape.closePath()
    return new ExtrudeGeometry(shape, {
      depth: 0.018,
      bevelEnabled: false,
    })
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh geometry={geometry} rotation={[0, 0, rotation]}>
      <meshStandardMaterial color={INK} roughness={0.72} />
    </mesh>
  )
}

function DirectionButton({
  position,
  rotation = 0,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  const geometry = useMemo(() => {
    const shape = new Shape()
    shape.moveTo(-0.56, -0.34)
    shape.lineTo(0.56, -0.34)
    shape.lineTo(0.43, 0.34)
    shape.lineTo(-0.43, 0.34)
    shape.closePath()
    return new ExtrudeGeometry(shape, {
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.045,
      bevelThickness: 0.035,
    })
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <group position={position} rotation={[0, 0, rotation]}>
      <mesh castShadow geometry={geometry}>
        <meshStandardMaterial color={CONTROL} roughness={0.58} />
      </mesh>
      <group position={[0, 0.03, 0.19]}>
        <ButtonArrow />
      </group>
    </group>
  )
}

export function WalletLid(props: GroupProps) {
  const oledTexture = useOledTexture()

  const lidGeometry = useMemo(() => {
    const shape = chamferedShape(9.4, 4.65, 0.72)
    shape.holes.push(rectanglePath(-2.25, -0.12, 3.25, 2.15))
    shape.holes.push(chamferedPath(2.45, -0.08, 3.55, 3.25, 0.58))
    return new ExtrudeGeometry(shape, {
      depth: 0.26,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.07,
      bevelThickness: 0.055,
    })
  }, [])

  const controlRing = useMemo(() => {
    const shape = chamferedShape(3.78, 3.44, 0.62)
    shape.holes.push(chamferedPath(0, 0, 3.27, 2.93, 0.51))
    return new ExtrudeGeometry(shape, {
      depth: 0.19,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.04,
      bevelThickness: 0.035,
    })
  }, [])

  useEffect(
    () => () => {
      lidGeometry.dispose()
      controlRing.dispose()
      oledTexture?.dispose()
    },
    [controlRing, lidGeometry, oledTexture],
  )

  return (
    <group {...props}>
      <mesh castShadow receiveShadow geometry={lidGeometry}>
        <meshStandardMaterial color={SHELL} roughness={0.66} metalness={0.01} />
      </mesh>

      <RoundedBox
        castShadow
        args={[3.46, 2.34, 0.2]}
        radius={0.11}
        smoothness={4}
        position={[-2.25, -0.12, 0.3]}
      >
        <meshStandardMaterial color={SHELL_EDGE} roughness={0.7} />
      </RoundedBox>
      <mesh position={[-2.25, -0.12, 0.415]}>
        <planeGeometry args={[2.92, 1.74]} />
        <meshBasicMaterial color={SCREEN} map={oledTexture ?? undefined} />
      </mesh>

      <group position={[2.45, -0.08, 0.28]}>
        <mesh castShadow geometry={controlRing}>
          <meshStandardMaterial color={SHELL_EDGE} roughness={0.62} />
        </mesh>
        <DirectionButton position={[0, 0.96, 0.14]} />
        <DirectionButton position={[0, -0.96, 0.14]} rotation={Math.PI} />
        <DirectionButton position={[-1.05, 0, 0.14]} rotation={Math.PI / 2} />
        <DirectionButton position={[1.05, 0, 0.14]} rotation={-Math.PI / 2} />
        <RoundedBox
          castShadow
          args={[0.74, 0.74, 0.18]}
          radius={0.12}
          smoothness={4}
          position={[0, 0, 0.21]}
        >
          <meshStandardMaterial color={CONTROL} roughness={0.55} />
        </RoundedBox>
        <mesh position={[0, 0, 0.32]}>
          <torusGeometry args={[0.16, 0.035, 10, 32]} />
          <meshStandardMaterial color={INK} roughness={0.7} />
        </mesh>
      </group>

      <group position={[-2.15, 1.62, 0.31]} scale={0.34}>
        <Text3D
          castShadow
          font={helvetiker}
          size={0.78}
          height={0.04}
          curveSegments={6}
          bevelEnabled
          bevelSize={0.012}
          bevelThickness={0.012}
        >
          NOIR
          <meshStandardMaterial color={SHELL_EDGE} roughness={0.72} />
        </Text3D>
      </group>

      {[
        [0, 2.36, 0.02],
        [0, -2.36, 0.02],
        [-4.76, 0, 0.02],
        [4.76, 0, 0.02],
      ].map((position, index) => (
        <RoundedBox
          key={index}
          castShadow
          args={index < 2 ? [1.1, 0.22, 0.22] : [0.22, 0.92, 0.22]}
          radius={0.05}
          smoothness={3}
          position={position as [number, number, number]}
        >
          <meshStandardMaterial color={SHELL_EDGE} roughness={0.7} />
        </RoundedBox>
      ))}
    </group>
  )
}

export function WalletContainer(props: GroupProps) {
  const wallGeometry = useMemo(() => {
    const shape = chamferedShape(9.4, 4.65, 0.72)
    shape.holes.push(chamferedPath(0, 0, 8.58, 3.82, 0.52))
    return new ExtrudeGeometry(shape, {
      depth: 1.42,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.07,
      bevelThickness: 0.055,
    })
  }, [])

  const floorGeometry = useMemo(
    () =>
      new ExtrudeGeometry(chamferedShape(9.08, 4.32, 0.63), {
        depth: 0.19,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.05,
        bevelThickness: 0.04,
      }),
    [],
  )

  useEffect(
    () => () => {
      wallGeometry.dispose()
      floorGeometry.dispose()
    },
    [floorGeometry, wallGeometry],
  )

  return (
    <group {...props}>
      <mesh castShadow receiveShadow geometry={floorGeometry}>
        <meshStandardMaterial color={SHELL_EDGE} roughness={0.76} />
      </mesh>
      <mesh castShadow receiveShadow geometry={wallGeometry} position={[0, 0, 0.12]}>
        <meshStandardMaterial color={SHELL} roughness={0.69} />
      </mesh>

      {[
        [-2.75, 2.26, 1.02],
        [2.75, 2.26, 1.02],
        [-2.75, -2.26, 1.02],
        [2.75, -2.26, 1.02],
      ].map((position, index) => (
        <RoundedBox
          key={index}
          castShadow
          args={[0.8, 0.2, 0.52]}
          radius={0.045}
          smoothness={3}
          position={position as [number, number, number]}
        >
          <meshStandardMaterial color={SHELL_EDGE} roughness={0.72} />
        </RoundedBox>
      ))}
    </group>
  )
}
