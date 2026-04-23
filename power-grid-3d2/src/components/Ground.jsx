import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function createNoiseTexture(size, baseColor, variance = 22) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const [r, g, b] = baseColor
  const image = ctx.createImageData(size, size)

  for (let i = 0; i < image.data.length; i += 4) {
    const n = (Math.random() - 0.5) * variance
    image.data[i] = Math.max(0, Math.min(255, r + n))
    image.data[i + 1] = Math.max(0, Math.min(255, g + n))
    image.data[i + 2] = Math.max(0, Math.min(255, b + n))
    image.data[i + 3] = 255
  }

  ctx.putImageData(image, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(12, 12)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

function createTechTexture(size = 512) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#061322'
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = 'rgba(70, 170, 255, 0.25)'
  ctx.lineWidth = 1
  const step = 32
  for (let i = 0; i <= size; i += step) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(size, i)
    ctx.stroke()
  }

  ctx.strokeStyle = 'rgba(120, 220, 255, 0.12)'
  ctx.lineWidth = 2
  for (let i = 0; i <= size; i += step * 4) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(size, i)
    ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(6, 6)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

function buildTerrainGeometry(size = 80, seg = 120) {
  const geo = new THREE.PlaneGeometry(size, size, seg, seg)
  const pos = geo.attributes.position

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const h =
      Math.sin(x * 0.1) * 0.35 +
      Math.cos(y * 0.12) * 0.28 +
      Math.sin((x + y) * 0.08) * 0.25
    pos.setZ(i, h)
  }

  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

export default function Ground({ mode = 'grid' }) {
  const gridRef = useRef()

  const concreteTexture = useMemo(() => createNoiseTexture(512, [86, 93, 101], 24), [])
  const terrainTexture = useMemo(() => createNoiseTexture(512, [50, 67, 46], 28), [])
  const techTexture = useMemo(() => createTechTexture(512), [])
  const terrainGeometry = useMemo(() => buildTerrainGeometry(), [])

  const concreteTiles = useMemo(() => {
    const tiles = []
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        tiles.push({
          x: x * 11,
          z: z * 11,
          h: 0.02 + ((x + z) % 2 === 0 ? 0.01 : 0),
        })
      }
    }
    return tiles
  }, [])

  const techRails = useMemo(() => {
    const rails = []
    for (let i = -5; i <= 5; i++) {
      rails.push({ x: i * 7, z: 0, rot: [0, 0, 0], long: true })
      rails.push({ x: 0, z: i * 7, rot: [0, Math.PI / 2, 0], long: true })
    }
    return rails
  }, [])

  const floorMaterial = useMemo(() => {
    if (mode === 'concrete') {
      return {
        color: '#697687',
        map: concreteTexture,
        roughness: 0.95,
        metalness: 0.06,
      }
    }

    if (mode === 'terrain') {
      return {
        color: '#49694f',
        map: terrainTexture,
        roughness: 0.98,
        metalness: 0.03,
      }
    }

    if (mode === 'tech') {
      return {
        color: '#0f2439',
        map: techTexture,
        roughness: 0.82,
        metalness: 0.14,
      }
    }

    return {
      color: '#050d1a',
      map: null,
      roughness: 0.92,
      metalness: 0.08,
    }
  }, [mode, concreteTexture, terrainTexture, techTexture])

  useFrame(({ clock }) => {
    if (!gridRef.current) return
    const base = mode === 'grid' ? 0.14 : mode === 'tech' ? 0.1 : 0.06
    gridRef.current.material.opacity = base + 0.02 * Math.sin(clock.getElapsedTime() * 0.5)
  })

  return (
    <group>
      {mode === 'terrain' ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]} receiveShadow geometry={terrainGeometry}>
          <meshStandardMaterial
            color={floorMaterial.color}
            map={floorMaterial.map}
            roughness={floorMaterial.roughness}
            metalness={floorMaterial.metalness}
          />
        </mesh>
      ) : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[80, 80]} />
          <meshStandardMaterial
            color={floorMaterial.color}
            map={floorMaterial.map}
            roughness={floorMaterial.roughness}
            metalness={floorMaterial.metalness}
          />
        </mesh>
      )}

      {mode === 'concrete' &&
        concreteTiles.map((tile, idx) => (
          <mesh key={idx} position={[tile.x, tile.h, tile.z]} receiveShadow>
            <boxGeometry args={[10.4, tile.h, 10.4]} />
            <meshStandardMaterial color="#5f6c7d" roughness={0.95} metalness={0.04} />
          </mesh>
        ))}

      {mode === 'tech' && (
        <group>
          {techRails.map((rail, idx) => (
            <mesh key={idx} position={[rail.x, 0.06, rail.z]} rotation={rail.rot} receiveShadow>
              <boxGeometry args={[80, 0.08, 0.35]} />
              <meshStandardMaterial color="#1c3a58" emissive="#204f7a" emissiveIntensity={0.18} metalness={0.28} roughness={0.55} />
            </mesh>
          ))}
          {[12, 24, 36].map((radius) => (
            <mesh key={radius} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
              <torusGeometry args={[radius, 0.1, 10, 90]} />
              <meshStandardMaterial color="#2f638d" emissive="#3aa9ff" emissiveIntensity={0.2} metalness={0.5} roughness={0.35} />
            </mesh>
          ))}
        </group>
      )}

      {(mode === 'grid' || mode === 'tech') && (
        <gridHelper ref={gridRef} args={[80, 40, '#003355', '#001122']} position={[0, 0.005, 0]} />
      )}

      {mode !== 'terrain' && [10, 20, 30].map((radius) => (
        <mesh key={radius} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[radius - 0.5, radius, 64]} />
          <meshBasicMaterial color={mode === 'concrete' ? '#1d2a38' : '#001833'} transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  )
}
