import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'

const TYPE_COLORS = {
  coal: '#8b8f99',
  nuclear: '#eab35d',
  solar: '#d2b643',
  wind: '#58c3f6',
  substation: '#5d8fff',
  meter: '#2fd8a7',
  sensor: '#ff72b6',
  battery: '#9158ff',
}

const MTL = {
  metalDark: { color: '#2e3442', metalness: 0.62, roughness: 0.35 },
  metalLight: { color: '#9ea8b8', metalness: 0.68, roughness: 0.3 },
  panelGlass: { color: '#2e4a72', metalness: 0.85, roughness: 0.2 },
  groundPad: { color: '#242b36', metalness: 0.12, roughness: 0.9 },
}

function CoalPlant({ color, hovered }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
        <boxGeometry args={[3.4, 0.16, 2.4]} />
        <meshStandardMaterial {...MTL.groundPad} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
        <boxGeometry args={[2.4, 1.2, 1.6]} />
        <meshStandardMaterial color="#515a66" metalness={0.2} roughness={0.7} />
      </mesh>

      <mesh castShadow position={[0.95, 1.35, 0]}>
        <boxGeometry args={[0.9, 0.5, 1.1]} />
        <meshStandardMaterial color="#636c78" metalness={0.32} roughness={0.6} />
      </mesh>

      {[-0.75, 0.05, 0.85].map((x, i) => (
        <group key={i} position={[x, 0, -0.62]}>
          <mesh castShadow position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 1.8, 12]} />
            <meshStandardMaterial color="#8f96a4" metalness={0.45} roughness={0.45} />
          </mesh>
          <mesh position={[0, 1.95, 0]}>
            <sphereGeometry args={[0.11, 10, 10]} />
            <meshStandardMaterial color="#5a6474" emissive={hovered ? color : '#2f3440'} emissiveIntensity={hovered ? 0.35 : 0.1} />
          </mesh>
        </group>
      ))}

      {[-0.9, 0.9].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.42, 0.72]}>
          <boxGeometry args={[0.55, 0.6, 0.45]} />
          <meshStandardMaterial color="#36404d" emissive={hovered ? color : '#12161d'} emissiveIntensity={hovered ? 0.25 : 0.06} />
        </mesh>
      ))}

      <mesh castShadow position={[0, 1.42, 0.82]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 2.1, 10]} />
        <meshStandardMaterial color="#8a95a6" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  )
}

function NuclearPlant({ color, hovered }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
        <boxGeometry args={[3.2, 0.16, 2.3]} />
        <meshStandardMaterial {...MTL.groundPad} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.95, 1.05, 1.45, 24]} />
        <meshStandardMaterial color="#8f969f" metalness={0.12} roughness={0.8} />
      </mesh>

      <mesh castShadow position={[0, 1.57, 0]}>
        <sphereGeometry args={[0.98, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#c6cad1" metalness={0.16} roughness={0.58} emissive={hovered ? color : '#221300'} emissiveIntensity={hovered ? 0.28 : 0.05} />
      </mesh>

      {[[-1.22, -0.52], [1.22, -0.52]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh castShadow position={[0, 0.68, 0]}>
            <cylinderGeometry args={[0.38, 0.5, 1.35, 16]} />
            <meshStandardMaterial color="#939aa5" metalness={0.1} roughness={0.85} />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <sphereGeometry args={[0.37, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#bec4cc" />
          </mesh>
        </group>
      ))}

      <mesh castShadow position={[0, 0.45, 0.98]}>
        <boxGeometry args={[1.55, 0.58, 0.45]} />
        <meshStandardMaterial color="#596273" metalness={0.25} roughness={0.62} />
      </mesh>
    </group>
  )
}

function SolarFarm({ color, hovered }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[3.5, 0.08, 3]} />
        <meshStandardMaterial color="#2d3328" roughness={0.95} metalness={0.05} />
      </mesh>

      {Array.from({ length: 12 }).map((_, idx) => {
        const row = Math.floor(idx / 4)
        const col = idx % 4
        const x = -1.35 + col * 0.9
        const z = -0.95 + row * 0.9
        return (
          <group key={idx} position={[x, 0, z]}>
            <mesh castShadow position={[0, 0.34, 0]}>
              <boxGeometry args={[0.06, 0.5, 0.06]} />
              <meshStandardMaterial {...MTL.metalLight} />
            </mesh>
            <mesh castShadow position={[0, 0.64, 0]} rotation={[-0.52, 0, 0]}>
              <boxGeometry args={[0.7, 0.03, 0.5]} />
              <meshStandardMaterial color={hovered ? '#3a6196' : MTL.panelGlass.color} emissive={hovered ? color : '#162338'} emissiveIntensity={hovered ? 0.22 : 0.08} metalness={0.84} roughness={0.18} />
            </mesh>
          </group>
        )
      })}

      <mesh castShadow position={[1.46, 0.35, 1.1]}>
        <boxGeometry args={[0.4, 0.45, 0.32]} />
        <meshStandardMaterial color="#5f6876" metalness={0.3} roughness={0.55} />
      </mesh>
    </group>
  )
}

function WindTurbine({ x, z, color, hovered, speed }) {
  const rotorRef = useRef()

  useFrame(({ clock }) => {
    if (rotorRef.current) {
      // Absolute-time rotation keeps the rotor locked to its center pivot with no drift.
      rotorRef.current.rotation.z = clock.elapsedTime * speed
    }
  })

  return (
    <group position={[x, 0, z]}>
      <mesh castShadow position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 2.3, 12]} />
        <meshStandardMaterial color="#d5d8de" metalness={0.45} roughness={0.32} />
      </mesh>
      <mesh castShadow position={[0, 2.34, 0.06]}>
        <boxGeometry args={[0.28, 0.2, 0.56]} />
        <meshStandardMaterial color="#eceef2" metalness={0.35} roughness={0.35} />
      </mesh>

      <group ref={rotorRef} position={[0, 2.34, 0.36]}>
        <mesh castShadow>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={hovered ? '#b4e8ff' : '#e8edf5'} emissive={hovered ? color : '#12161e'} emissiveIntensity={hovered ? 0.35 : 0} />
        </mesh>
        {[0, 1, 2].map((blade) => (
          <group key={blade} rotation={[0, 0, blade * ((Math.PI * 2) / 3)]}>
            <mesh castShadow position={[0, 0.5, 0]}>
              <boxGeometry args={[0.06, 1.0, 0.03]} />
              <meshStandardMaterial color={hovered ? '#a7ddff' : '#f0f2f5'} emissive={hovered ? color : '#151b24'} emissiveIntensity={hovered ? 0.4 : 0} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

function WindFarm({ color, hovered }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[3.4, 0.08, 2]} />
        <meshStandardMaterial color="#202c34" roughness={0.92} />
      </mesh>
      <WindTurbine x={-1.08} z={0} color={color} hovered={hovered} speed={1.2} />
      <WindTurbine x={0} z={0} color={color} hovered={hovered} speed={1.45} />
      <WindTurbine x={1.08} z={0} color={color} hovered={hovered} speed={1.1} />
    </group>
  )
}

function Substation({ color, hovered }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
        <boxGeometry args={[3, 0.12, 2.2]} />
        <meshStandardMaterial color="#2a3340" roughness={0.88} />
      </mesh>

      {[-0.9, 0, 0.9].map((x, i) => (
        <group key={i} position={[x, 0, -0.4]}>
          <mesh castShadow position={[0, 0.48, 0]}>
            <boxGeometry args={[0.58, 0.8, 0.44]} />
            <meshStandardMaterial color="#505b6a" emissive={hovered ? color : '#0e1220'} emissiveIntensity={hovered ? 0.3 : 0.08} />
          </mesh>
          <mesh castShadow position={[0, 0.98, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.5, 10]} />
            <meshStandardMaterial color="#b2bcc9" metalness={0.65} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {[[-1.2, 1.0], [1.2, 1.0]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh castShadow position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 1.8, 8]} />
            <meshStandardMaterial {...MTL.metalLight} />
          </mesh>
          <mesh castShadow position={[0, 1.84, 0]}>
            <boxGeometry args={[0.2, 0.12, 0.2]} />
            <meshStandardMaterial color="#768299" />
          </mesh>
        </group>
      ))}

      <mesh castShadow position={[0, 1.85, 1.0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 2.4, 10]} />
        <meshStandardMaterial color="#97a2b2" metalness={0.72} roughness={0.26} />
      </mesh>
    </group>
  )
}

function SmartMeter({ color, hovered }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[2.8, 0.08, 2.2]} />
        <meshStandardMaterial color="#243039" roughness={0.92} />
      </mesh>

      {[[-0.95, -0.45], [0, -0.45], [0.95, -0.45], [-0.45, 0.55], [0.55, 0.55]].map(([x, z], idx) => (
        <group key={idx} position={[x, 0, z]}>
          <mesh castShadow position={[0, 0.34, 0]}>
            <boxGeometry args={[0.32, 0.64, 0.2]} />
            <meshStandardMaterial color="#3d4858" />
          </mesh>
          <mesh position={[0, 0.35, 0.11]}>
            <boxGeometry args={[0.2, 0.2, 0.02]} />
            <meshStandardMaterial color={hovered ? '#7ff4ce' : '#2fd8a7'} emissive={color} emissiveIntensity={hovered ? 0.55 : 0.28} />
          </mesh>
          <mesh castShadow position={[0, 0.74, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
            <meshStandardMaterial color="#c0c8d4" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Sensor({ color, hovered }) {
  const pulseRef = useRef()

  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const s = 0.85 + 0.15 * Math.sin(clock.elapsedTime * 2.5)
      pulseRef.current.scale.set(s, s, s)
    }
  })

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[2.8, 0.08, 1.9]} />
        <meshStandardMaterial color="#2b2733" roughness={0.9} />
      </mesh>

      {[[-0.8, 0], [0, 0], [0.8, 0], [-0.35, 0.62], [0.35, 0.62]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh castShadow position={[0, 0.56, 0]}>
            <cylinderGeometry args={[0.05, 0.07, 1.1, 8]} />
            <meshStandardMaterial color="#7d8798" />
          </mesh>
          <mesh position={[0, 1.16, 0]}>
            <sphereGeometry args={[0.13, 10, 10]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.78 : 0.45} />
          </mesh>
        </group>
      ))}

      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0.2]}>
        <ringGeometry args={[0.4, 0.48, 30]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>
    </group>
  )
}

function Battery({ color, hovered }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[3.4, 0.1, 2.1]} />
        <meshStandardMaterial color="#2b2438" roughness={0.88} />
      </mesh>

      {[-1.05, 0, 1.05].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh castShadow position={[0, 0.52, 0]}>
            <boxGeometry args={[0.86, 1.02, 0.92]} />
            <meshStandardMaterial color="#423069" emissive={color} emissiveIntensity={hovered ? 0.35 : 0.16} metalness={0.35} roughness={0.52} />
          </mesh>
          <mesh castShadow position={[0, 1.07, 0]}>
            <boxGeometry args={[0.82, 0.08, 0.88]} />
            <meshStandardMaterial color="#606b7f" />
          </mesh>
          <mesh position={[0, 0.52, 0.47]}>
            <boxGeometry args={[0.66, 0.42, 0.02]} />
            <meshStandardMaterial color="#9ca7b8" metalness={0.65} roughness={0.28} />
          </mesh>
        </group>
      ))}

      <mesh castShadow position={[0, 1.22, 0]}>
        <boxGeometry args={[3, 0.08, 0.95]} />
        <meshStandardMaterial color="#4f5968" metalness={0.45} roughness={0.45} />
      </mesh>

      <mesh castShadow position={[-1.45, 0.34, 0.75]}>
        <boxGeometry args={[0.35, 0.55, 0.28]} />
        <meshStandardMaterial color="#5b6574" />
      </mesh>
    </group>
  )
}

const SHAPES = {
  coal: CoalPlant,
  nuclear: NuclearPlant,
  solar: SolarFarm,
  wind: WindFarm,
  substation: Substation,
  meter: SmartMeter,
  sensor: Sensor,
  battery: Battery,
}

export default function GridNode({ node, selected, onSelect, onHover, labelsOn = true }) {
  const groupRef = useRef()
  const ringRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      const targetY = hovered || selected ? 0.2 : 0
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.09)
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.25
      ringRef.current.material.opacity = selected ? 0.95 : hovered ? 0.56 : 0.24
    }
  })

  const color = TYPE_COLORS[node.type]
  const Shape = SHAPES[node.type]

  return (
    <group
      ref={groupRef}
      position={node.position}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(node)
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        setHovered(true)
        onHover(node, event)
      }}
      onPointerOut={() => {
        setHovered(false)
        onHover(null)
      }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[1.85, 44]} />
        <meshStandardMaterial color={color} transparent opacity={selected ? 0.22 : 0.08} />
      </mesh>

      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.5, 1.82, 42]} />
        <meshStandardMaterial color={color} transparent opacity={0.24} side={THREE.DoubleSide} />
      </mesh>

      {Shape && <Shape color={color} hovered={hovered || selected} />}

      {(selected || hovered) && <pointLight color={color} intensity={1.7} distance={7} />}

      {labelsOn && (
        <Billboard position={[0, 2.9, 0]} follow lockX={false} lockY={false} lockZ={false}>
          <Text
            fontSize={0.34}
            color={selected ? color : '#b5c8dc'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#02060d"
            renderOrder={10}
          >
            {node.label}
          </Text>
        </Billboard>
      )}
    </group>
  )
}
