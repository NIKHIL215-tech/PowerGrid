import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

const TYPE_COLORS = {
  coal: '#888888',
  nuclear: '#ffaa00',
  solar: '#ffdd00',
  wind: '#00ddff',
  substation: '#4488ff',
  meter: '#00ff88',
  sensor: '#ff44aa',
  battery: '#aa44ff',
}

const TYPE_EMISSIVE = {
  coal: '#333333',
  nuclear: '#442200',
  solar: '#443300',
  wind: '#003344',
  substation: '#001144',
  meter: '#003322',
  sensor: '#440022',
  battery: '#220044',
}

function CoalPlant({ color, hovered }) {
  return (
    <group>
      <mesh castShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[1.8, 1.2, 1.2]} />
        <meshStandardMaterial color={color} emissive={hovered ? color : '#111'} emissiveIntensity={hovered ? 0.4 : 0} />
      </mesh>
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 1.6, 8]} />
          <meshStandardMaterial color="#555" />
        </mesh>
      ))}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[2.4, 0.3, 1.6]} />
        <meshStandardMaterial color="#444" />
      </mesh>
    </group>
  )
}

function NuclearPlant({ color, hovered }) {
  return (
    <group>
      <mesh castShadow position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.8, 1.0, 1.6, 12]} />
        <meshStandardMaterial color={color} emissive={hovered ? color : '#220'} emissiveIntensity={hovered ? 0.5 : 0.1} />
      </mesh>
      <mesh position={[1.2, 0.5, 0]} castShadow>
        <boxGeometry args={[1.0, 1.0, 0.9]} />
        <meshStandardMaterial color="#aaa" />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.82, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    </group>
  )
}

function SolarFarm({ color, hovered }) {
  const panels = []
  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      panels.push(
        <mesh key={`${r}-${c}`} position={[r * 0.9, 0.35, c * 0.9]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
          <boxGeometry args={[0.75, 0.04, 0.55]} />
          <meshStandardMaterial color={color} emissive={hovered ? color : '#221100'} emissiveIntensity={hovered ? 0.5 : 0.05} metalness={0.8} roughness={0.2} />
        </mesh>
      )
    }
  }
  return <group>{panels}</group>
}

function WindFarm({ color, hovered, time }) {
  return (
    <group>
      {[-1.2, 0, 1.2].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh castShadow position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.07, 0.1, 1.8, 6]} />
            <meshStandardMaterial color="#ddd" />
          </mesh>
          <group position={[0, 1.8, 0]} rotation={[0, 0, time * (0.8 + i * 0.15)]}>
            {[0, 1, 2].map(b => (
              <mesh key={b} position={[0.35 * Math.cos(b * Math.PI * 2 / 3), 0.35 * Math.sin(b * Math.PI * 2 / 3), 0]} rotation={[0, 0, b * Math.PI * 2 / 3]} castShadow>
                <boxGeometry args={[0.06, 0.7, 0.04]} />
                <meshStandardMaterial color={color} emissive={hovered ? color : '#001122'} emissiveIntensity={hovered ? 0.4 : 0} />
              </mesh>
            ))}
          </group>
        </group>
      ))}
    </group>
  )
}

function Substation({ color, hovered }) {
  return (
    <group>
      <mesh castShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[1.6, 0.6, 1.2]} />
        <meshStandardMaterial color="#334" emissive={hovered ? color : '#001'} emissiveIntensity={hovered ? 0.4 : 0.05} />
      </mesh>
      {[-0.5, 0.5].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 1.4, 6]} />
            <meshStandardMaterial color="#888" />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.35, 0.5, 0.25]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function SmartMeter({ color, hovered, time }) {
  return (
    <group>
      {[[-0.5, 0, -0.3], [0, 0, 0], [0.5, 0, 0.3], [-0.3, 0, 0.5]].map(([x, y, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh castShadow position={[0, 0.3, 0]}>
            <boxGeometry args={[0.22, 0.6, 0.12]} />
            <meshStandardMaterial color="#334" />
          </mesh>
          <mesh position={[0, 0.3, 0.07]}>
            <boxGeometry args={[0.18, 0.14, 0.01]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3 + 0.2 * Math.sin(time * 2 + i)} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Sensor({ color, hovered, time }) {
  return (
    <group>
      {[[-0.8, 0], [0, 0], [0.8, 0], [-0.4, 0.7], [0.4, 0.7]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh castShadow position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 1.0, 6]} />
            <meshStandardMaterial color="#555" />
          </mesh>
          <mesh position={[0, 1.05, 0]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5 + 0.3 * Math.sin(time * 3 + i * 1.2)} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Battery({ color, hovered, time }) {
  return (
    <group>
      {[[-0.9, 0], [0, 0], [0.9, 0]].map(([x, z], i) => (
        <mesh key={i} castShadow position={[x, 0.55, z]}>
          <boxGeometry args={[0.7, 1.1, 0.6]} />
          <meshStandardMaterial
            color="#223"
            emissive={color}
            emissiveIntensity={0.1 + 0.15 * Math.abs(Math.sin(time * 0.5 + i * 0.8))}
          />
        </mesh>
      ))}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2.8, 0.08, 0.8]} />
        <meshStandardMaterial color="#555" />
      </mesh>
    </group>
  )
}

const SHAPES = { coal: CoalPlant, nuclear: NuclearPlant, solar: SolarFarm, wind: WindFarm, substation: Substation, meter: SmartMeter, sensor: Sensor, battery: Battery }

export default function GridNode({ node, selected, onSelect, onHover, labelsOn = true }) {
  const groupRef = useRef()
  const ringRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [time, setTime] = useState(0)

  useFrame((state, delta) => {
    setTime(t => t + delta)
    if (groupRef.current) {
      const targetY = hovered || selected ? 0.25 : 0
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1)
    }
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * (selected ? 1.5 : 0.5)
      ringRef.current.material.opacity = selected ? 0.9 : hovered ? 0.5 : 0.2
    }
  })

  const color = TYPE_COLORS[node.type]
  const Shape = SHAPES[node.type]

  return (
    <group
      ref={groupRef}
      position={node.position}
      onClick={e => { e.stopPropagation(); onSelect(node) }}
      onPointerOver={e => { e.stopPropagation(); setHovered(true); onHover(node, e) }}
      onPointerOut={() => { setHovered(false); onHover(null) }}
    >
      {/* Ground circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1.4, 32]} />
        <meshStandardMaterial color={color} transparent opacity={selected ? 0.2 : 0.07} />
      </mesh>

      {/* Spinning ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.2, 1.4, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* The 3D model */}
      {Shape && <Shape color={color} hovered={hovered} time={time} />}

      {/* Point light for selected */}
      {(selected || hovered) && <pointLight color={color} intensity={2} distance={6} />}

      {/* Label */}
      {labelsOn && (
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.35}
          color={selected ? color : '#aabbcc'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {node.label}
        </Text>
      )}
    </group>
  )
}
