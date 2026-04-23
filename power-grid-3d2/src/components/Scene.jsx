import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { GRID_NODES, TRANSMISSION_LINES } from '../data/gridData'
import GridNode from './GridNode'
import TransmissionLines from './TransmissionLines'
import Ground from './Ground'

function CameraFocus({ targetId, controlsRef }) {
  const { camera } = useThree()
  const prevTarget = useRef(null)
  const animTarget = useRef(new THREE.Vector3(0, 0, 0))
  const animPos = useRef(new THREE.Vector3(0, 22, 28))
  const isAnimating = useRef(false)

  useEffect(() => {
    if (targetId === prevTarget.current) return
    prevTarget.current = targetId
    isAnimating.current = true

    if (!targetId) {
      animTarget.current.set(0, 0, 0)
      animPos.current.set(0, 22, 28)
    } else {
      const node = GRID_NODES.find(n => n.id === targetId)
      if (!node) return
      const [x, , z] = node.position
      animTarget.current.set(x, 0, z)
      animPos.current.set(x + 8, 8, z + 10)
    }
  }, [targetId])

  useFrame((state, delta) => {
    if (!isAnimating.current) return

    const t = 1.0 - Math.pow(0.001, delta)
    camera.position.lerp(animPos.current, t)
    camera.lookAt(animTarget.current)

    if (controlsRef.current) {
      controlsRef.current.target.lerp(animTarget.current, t)
      controlsRef.current.update()
    }

    const posDist = camera.position.distanceTo(animPos.current)
    const tgtDist = controlsRef.current
      ? controlsRef.current.target.distanceTo(animTarget.current)
      : 0

    if (posDist < 0.05 && tgtDist < 0.05) {
      isAnimating.current = false
      camera.position.copy(animPos.current)
      if (controlsRef.current) {
        controlsRef.current.target.copy(animTarget.current)
        controlsRef.current.update()
      }
    }
  })

  return null
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[20, 30, 10]} intensity={0.8} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[0, 15, 0]} intensity={0.4} color="#0044ff" />
      <hemisphereLight skyColor="#0a1a3a" groundColor="#000510" intensity={0.5} />
    </>
  )
}

function ErrorFallback({ error, resetError }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: '#0a0e1a', color: '#e0f0ff',
      padding: 20, textAlign: 'center', zIndex: 1000
    }}>
      <div style={{ fontSize: '2rem', marginBottom: 16 }}>⚠️</div>
      <h2 style={{ color: '#00c8ff', marginBottom: 12 }}>3D View Unavailable</h2>
      <p style={{ color: '#7090a0', marginBottom: 20, maxWidth: 400 }}>
        The 3D graphics engine encountered an issue. This may be due to driver updates or browser memory limits.
      </p>
      <button 
        onClick={resetError}
        style={{
          padding: '8px 20px', borderRadius: 7, border: 'none',
          background: '#00c8ff', color: '#000', fontSize: '0.85rem', fontWeight: 700,
          cursor: 'pointer'
        }}
      >
        Try Again
      </button>
    </div>
  )
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00c8ff" wireframe />
    </mesh>
  )
}

export default function Scene({ selectedId, onSelect, onHover, focusId, labelsOn, floorMode = 'grid' }) {
  const [hasError, setHasError] = useState(false)
  const controlsRef = useRef()
  
  useEffect(() => {
    const handleWebGLContextLost = (e) => {
      e.preventDefault()
      console.warn('WebGL context lost, attempting recovery...')
    }
    
    const handleWebGLContextRestored = () => {
      console.log('WebGL context restored')
      setHasError(false)
    }

    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleWebGLContextLost)
      canvas.addEventListener('webglcontextrestored', handleWebGLContextRestored)
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleWebGLContextLost)
        canvas.removeEventListener('webglcontextrestored', handleWebGLContextRestored)
      }
    }
  }, [])

  if (hasError) {
    return <ErrorFallback error={null} resetError={() => setHasError(false)} />
  }

  return (
    <Canvas
      camera={{ position: [0, 22, 28], fov: 55, near: 0.1, far: 500 }}
      shadows
      style={{ position: 'fixed', inset: 0 }}
      gl={{ 
        antialias: true, 
        toneMapping: THREE.ACESFilmicToneMapping, 
        toneMappingExposure: 1.2,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false
      }}
      onError={(error) => {
        console.error('Canvas error:', error)
        setHasError(true)
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <color attach="background" args={['#050d1a']} />
        <fog attach="fog" args={['#050d1a', 40, 90]} />
        <Stars radius={80} depth={40} count={3000} factor={3} saturation={0.3} fade speed={0.5} />
        <Lights />
        <Ground mode={floorMode} />
        <TransmissionLines lines={TRANSMISSION_LINES} nodes={GRID_NODES} />
        {GRID_NODES.map(node => (
          <GridNode
            key={node.id}
            node={node}
            selected={node.id === selectedId}
            onSelect={onSelect}
            onHover={onHover}
            labelsOn={labelsOn}
          />
        ))}
        <OrbitControls
          ref={controlsRef}
          enablePan
          enableZoom
          minDistance={6}
          maxDistance={60}
          maxPolarAngle={Math.PI * 0.85}
        />
        <CameraFocus targetId={focusId} controlsRef={controlsRef} />
      </Suspense>
    </Canvas>
  )
}
