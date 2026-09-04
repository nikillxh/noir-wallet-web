import { Instance, Instances, RoundedBox, Text3D } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import helvetiker from '../../assets/font'

type BlackPillProps = ThreeElements['group'] & {
  withCarrier?: boolean
}

const boardComponents: Array<{
  position: [number, number, number]
  size: [number, number, number]
  color: string
}> = [
  { position: [-0.55, 0.58, 0.2], size: [0.48, 0.22, 0.16], color: '#c7b68a' },
  { position: [0.72, 0.6, 0.19], size: [0.32, 0.19, 0.13], color: '#151817' },
  { position: [1.38, -0.58, 0.2], size: [0.56, 0.24, 0.15], color: '#b4b6ad' },
  { position: [-1.2, -0.6, 0.19], size: [0.34, 0.18, 0.12], color: '#171918' },
  { position: [0.24, -0.62, 0.19], size: [0.25, 0.18, 0.11], color: '#ad9b67' },
  { position: [1.92, 0.57, 0.2], size: [0.42, 0.2, 0.15], color: '#171918' },
]

export default function BlackPill({ withCarrier = true, ...props }: BlackPillProps) {
  const headerPins = Array.from({ length: 20 }, (_, index) => -2.28 + index * 0.24)
  const carrierHoles = Array.from({ length: 13 * 6 }, (_, index) => ({
    x: -2.88 + (index % 13) * 0.48,
    y: -1.2 + Math.floor(index / 13) * 0.48,
  }))

  return (
    <group {...props}>
      {withCarrier && (
        <group position={[0.08, 0, -0.19]}>
          <RoundedBox castShadow args={[6.35, 3.25, 0.17]} radius={0.09} smoothness={3}>
            <meshStandardMaterial color="#8d431d" roughness={0.73} />
          </RoundedBox>
          <Instances limit={carrierHoles.length}>
            <cylinderGeometry args={[0.055, 0.055, 0.025, 10]} />
            <meshStandardMaterial color="#26180f" roughness={0.8} />
            {carrierHoles.map(({ x, y }, index) => (
              <Instance
                key={index}
                position={[x, y, 0.095]}
                rotation={[Math.PI / 2, 0, 0]}
              />
            ))}
          </Instances>
        </group>
      )}

      <RoundedBox castShadow receiveShadow args={[5.281, 2.078, 0.15]} radius={0.09} smoothness={4}>
        <meshStandardMaterial color="#111817" roughness={0.61} metalness={0.08} />
      </RoundedBox>

      <Instances limit={headerPins.length * 2}>
        <cylinderGeometry args={[0.082, 0.082, 0.08, 12]} />
        <meshStandardMaterial color="#bd9a51" metalness={0.72} roughness={0.28} />
        {[-0.9, 0.9].flatMap((y) =>
          headerPins.map((x, index) => (
            <Instance
              key={`${y}-${index}`}
              position={[x, y, 0.15]}
              rotation={[Math.PI / 2, 0, 0]}
            />
          )),
        )}
      </Instances>
      <Instances castShadow limit={headerPins.length * 2}>
        <cylinderGeometry args={[0.035, 0.035, 0.3, 8]} />
        <meshStandardMaterial color="#d6d0b6" metalness={0.82} roughness={0.24} />
        {[-0.9, 0.9].flatMap((y) =>
          headerPins.map((x, index) => (
            <Instance
              key={`${y}-${index}`}
              position={[x, y, 0.28]}
              rotation={[Math.PI / 2, 0, 0]}
            />
          )),
        )}
      </Instances>

      <RoundedBox castShadow args={[0.95, 0.95, 0.16]} radius={0.055} smoothness={3} position={[0.15, 0, 0.17]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#202526" roughness={0.47} />
      </RoundedBox>
      <mesh position={[0.02, 0.13, 0.265]}>
        <circleGeometry args={[0.055, 18]} />
        <meshStandardMaterial color="#565d5b" roughness={0.58} />
      </mesh>

      <RoundedBox castShadow args={[0.7, 1.1, 0.36]} radius={0.09} smoothness={4} position={[-2.55, 0, 0.2]}>
        <meshStandardMaterial color="#a9acaa" metalness={0.72} roughness={0.24} />
      </RoundedBox>
      <RoundedBox args={[0.15, 0.62, 0.12]} radius={0.04} smoothness={3} position={[-2.91, 0, 0.22]}>
        <meshStandardMaterial color="#202322" roughness={0.55} />
      </RoundedBox>

      {[-1.52, 1.58].map((x, index) => (
        <group key={x} position={[x, 0, 0.17]}>
          <RoundedBox castShadow args={[0.48, 0.42, 0.2]} radius={0.07} smoothness={4}>
            <meshStandardMaterial color="#d1d0c8" roughness={0.48} metalness={0.18} />
          </RoundedBox>
          <RoundedBox args={[0.25, 0.22, 0.12]} radius={0.055} smoothness={4} position={[0, 0, 0.13]}>
            <meshStandardMaterial color={index === 0 ? '#343938' : '#3d4442'} roughness={0.58} />
          </RoundedBox>
        </group>
      ))}

      {boardComponents.map((component, index) => (
        <RoundedBox
          key={index}
          castShadow
          args={component.size}
          radius={0.025}
          smoothness={2}
          position={component.position}
        >
          <meshStandardMaterial color={component.color} roughness={0.52} metalness={0.12} />
        </RoundedBox>
      ))}

      <group position={[-0.72, -0.32, 0.17]} scale={0.14}>
        <Text3D font={helvetiker} size={0.68} height={0.018} curveSegments={3}>
          WEACT F401
          <meshBasicMaterial color="#d7ded9" />
        </Text3D>
      </group>
      <group position={[-0.15, 0.18, 0.265]} scale={0.1} rotation={[0, 0, Math.PI / 4]}>
        <Text3D font={helvetiker} size={0.56} height={0.012} curveSegments={3}>
          STM32
          <meshBasicMaterial color="#939b98" />
        </Text3D>
      </group>

      <mesh position={[2.2, -0.6, 0.22]}>
        <circleGeometry args={[0.075, 20]} />
        <meshStandardMaterial color="#dc3d32" emissive="#9b120e" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}
