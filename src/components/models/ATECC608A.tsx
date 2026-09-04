import { RoundedBox, Text3D } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import helvetiker from '../../assets/font'

type ATECC608AProps = ThreeElements['group']

export default function ATECC608A(props: ATECC608AProps) {
  const holes = Array.from({ length: 6 * 4 }, (_, index) => ({
    x: -1.04 + (index % 6) * 0.42,
    y: -0.63 + Math.floor(index / 6) * 0.42,
  }))
  const pins = [-0.34, -0.11, 0.11, 0.34]

  return (
    <group {...props}>
      <RoundedBox castShadow receiveShadow args={[2.5, 1.55, 0.16]} radius={0.07} smoothness={3}>
        <meshStandardMaterial color="#8b421e" roughness={0.72} />
      </RoundedBox>

      {holes.map(({ x, y }, index) => (
        <group key={index} position={[x, y, 0.095]}>
          <mesh>
            <ringGeometry args={[0.045, 0.086, 14]} />
            <meshStandardMaterial color="#b8884a" metalness={0.58} roughness={0.32} />
          </mesh>
          <mesh position={[0, 0, -0.012]}>
            <circleGeometry args={[0.038, 12]} />
            <meshStandardMaterial color="#231810" roughness={0.8} />
          </mesh>
        </group>
      ))}

      <group position={[0, 0, 0.17]}>
        <RoundedBox castShadow args={[1.02, 0.78, 0.25]} radius={0.07} smoothness={4}>
          <meshStandardMaterial color="#171a1a" roughness={0.46} />
        </RoundedBox>

        {[-1, 1].flatMap((side) =>
          pins.map((x) => (
            <group key={`${side}-${x}`}>
              <RoundedBox
                castShadow
                args={[0.13, 0.33, 0.055]}
                radius={0.025}
                smoothness={3}
                position={[x, side * 0.49, -0.02]}
              >
                <meshStandardMaterial color="#b7b5a9" metalness={0.74} roughness={0.28} />
              </RoundedBox>
              <RoundedBox
                args={[0.13, 0.12, 0.09]}
                radius={0.018}
                smoothness={2}
                position={[x, side * 0.65, -0.07]}
              >
                <meshStandardMaterial color="#d0cdbf" metalness={0.76} roughness={0.25} />
              </RoundedBox>
            </group>
          )),
        )}

        <mesh position={[-0.34, 0.2, 0.135]}>
          <circleGeometry args={[0.065, 18]} />
          <meshStandardMaterial color="#444a48" roughness={0.58} />
        </mesh>

        <group position={[-0.31, -0.08, 0.135]} scale={0.095}>
          <Text3D font={helvetiker} size={0.54} height={0.01} curveSegments={3}>
            608A
            <meshBasicMaterial color="#858d89" />
          </Text3D>
        </group>
      </group>

      {[
        [-0.64, -0.45],
        [-0.22, -0.45],
        [0.22, -0.45],
        [0.64, -0.45],
        [-0.64, 0.45],
        [-0.22, 0.45],
        [0.22, 0.45],
        [0.64, 0.45],
      ].map(([x, y], index) => (
        <mesh key={index} position={[x, y, 0.19]}>
          <sphereGeometry args={[0.075, 10, 8]} />
          <meshStandardMaterial color="#c5c0ae" metalness={0.67} roughness={0.34} />
        </mesh>
      ))}
    </group>
  )
}
