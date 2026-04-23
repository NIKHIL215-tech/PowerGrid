import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Ground() {
  const gridRef = useRef()

  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.12 + 0.03 * Math.sin(clock.getElapsedTime() * 0.5)
    }
  })

  return (
    <group>
      {/* Base ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#050d1a" />
      </mesh>

      {/* Grid overlay */}
      <gridHelper ref={gridRef} args={[80, 40, '#003355', '#001122']} position={[0, 0.005, 0]} />

      {/* Subtle fog rings */}
      {[10, 20, 30].map(r => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[r - 0.5, r, 64]} />
          <meshBasicMaterial color="#001833" transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  )
}
