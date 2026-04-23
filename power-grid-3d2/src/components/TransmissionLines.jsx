import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function PowerLine({ from, to, animated }) {
  const lineRef = useRef()
  const particlesRef = useRef()

  const { points, midUp } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const mid = a.clone().lerp(b, 0.5)
    mid.y += 1.5
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
    const points = curve.getPoints(40)
    return { points, midUp: mid }
  }, [from, to])

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((p, i) => {
        const t = ((clock.getElapsedTime() * 0.3 + i / 5) % 1)
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(...from),
          new THREE.Vector3(midUp.x, midUp.y, midUp.z),
          new THREE.Vector3(...to)
        )
        const pos = curve.getPoint(t)
        p.position.copy(pos)
        p.material.opacity = Math.sin(t * Math.PI) * 0.9
      })
    }
  })

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    return geo
  }, [points])

  return (
    <group>
      <line geometry={lineGeometry}>
        <lineBasicMaterial color="#004466" opacity={0.4} transparent />
      </line>
      {/* Animated power flow particles */}
      <group ref={particlesRef}>
        {[0, 0.2, 0.4, 0.6, 0.8].map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.06, 4, 4]} />
            <meshStandardMaterial color="#00c8ff" emissive="#00c8ff" emissiveIntensity={1} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default function TransmissionLines({ lines, nodes }) {
  const nodeMap = useMemo(() => {
    const m = {}
    nodes.forEach(n => { m[n.id] = n.position })
    return m
  }, [nodes])

  return (
    <group>
      {lines.map((line, i) => {
        const from = nodeMap[line.from]
        const to = nodeMap[line.to]
        if (!from || !to) return null
        return <PowerLine key={i} from={from} to={to} animated />
      })}
    </group>
  )
}
