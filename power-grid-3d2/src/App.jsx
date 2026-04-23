import { useState, useCallback, useEffect } from 'react'
import Scene from './components/Scene'
import InfoPanel from './components/InfoPanel'
import DataPanel from './components/DataPanel'
import TourModal from './components/TourModal'
import WelcomeModal from './components/WelcomeModal'
import Glossary from './components/Glossary'
import { GRID_NODES } from './data/gridData'

const TYPE_COLORS = {
  coal: '#6f7484',
  nuclear: '#f8b84a',
  solar: '#ffd26e',
  wind: '#69c8ff',
  substation: '#6f9fff',
  meter: '#2ed6a5',
  sensor: '#ff7cb7',
  battery: '#b997ff',
}

const LEGEND_ITEMS = [
  { type: 'coal', label: 'Coal Plant', role: 'Baseload thermal generation' },
  { type: 'nuclear', label: 'Nuclear Plant', role: 'Stable low-carbon generation' },
  { type: 'solar', label: 'Solar Farm', role: 'Daytime renewable generation' },
  { type: 'wind', label: 'Wind Farm', role: 'Weather-driven generation' },
  { type: 'substation', label: 'Substation', role: 'Voltage step-up and step-down' },
  { type: 'battery', label: 'Battery Storage', role: 'Stores and dispatches energy' },
  { type: 'meter', label: 'Smart Meter', role: 'Household consumption telemetry' },
  { type: 'sensor', label: 'Sensor Network', role: 'Grid monitoring and diagnostics' },
]

const JOURNEY_STEPS = [
  { label: 'Generate', short: 'GEN', types: ['coal', 'nuclear', 'solar', 'wind'] },
  { label: 'Transmit', short: 'TX', types: ['substation'] },
  { label: 'Store', short: 'BESS', types: ['battery'] },
  { label: 'Distribute', short: 'DIST', types: ['substation'] },
  { label: 'Measure', short: 'IOT', types: ['meter', 'sensor'] },
  { label: 'Consumer', short: 'HOME', types: [] },
]

const FLOOR_MODES = ['grid', 'concrete', 'terrain', 'tech']

export default function App() {
  const [selectedNode, setSelectedNode] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showWelcome, setShowWelcome] = useState(true)
  const [tourOpen, setTourOpen] = useState(false)
  const [tourStep, setTourStep] = useState(0)
  const [focusId, setFocusId] = useState(null)
  const [labelsOn, setLabelsOn] = useState(true)
  const [floorMode, setFloorMode] = useState('grid')
  const [legendTypeIndex, setLegendTypeIndex] = useState({})
  const [clockStr, setClockStr] = useState('')

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    setClockStr(fmt())
    const timer = setInterval(() => setClockStr(fmt()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSelect = useCallback((node) => {
    setSelectedNode((prev) => {
      if (prev?.id === node.id) {
        setFocusId(null)
        return null
      }
      setFocusId(node.id)
      return node
    })
  }, [])

  const handleHover = useCallback((node, event) => {
    setHoveredNode(node)
    if (event) setMousePos({ x: event.clientX, y: event.clientY })
  }, [])

  const handleLegendClick = useCallback(
    (type) => {
      const nodes = GRID_NODES.filter((node) => node.type === type)
      if (!nodes.length) return
      const idx = legendTypeIndex[type] || 0
      const next = (idx + 1) % nodes.length
      setLegendTypeIndex((prev) => ({ ...prev, [type]: next }))
      const node = nodes[next]
      setSelectedNode(node)
      setFocusId(node.id)
    },
    [legendTypeIndex],
  )

  const handleTourSelectNode = useCallback((id) => {
    if (!id) return
    const node = GRID_NODES.find((entry) => entry.id === id)
    if (!node) return
    setSelectedNode(node)
    setFocusId(node.id)
  }, [])

  const handleJourneyClick = useCallback((step) => {
    if (!step.types.length) return
    const node = GRID_NODES.find((entry) => step.types.includes(entry.type))
    if (!node) return
    setSelectedNode(node)
    setFocusId(node.id)
  }, [])

  const handleStartTour = () => {
    setShowWelcome(false)
    setTourStep(0)
    setTourOpen(true)
  }

  const handleInfoPanelClose = useCallback(() => {
    setSelectedNode(null)
    setFocusId(null)
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      if (tourOpen) {
        setTourOpen(false)
      } else if (selectedNode) {
        setSelectedNode(null)
        setFocusId(null)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tourOpen, selectedNode])

  const totalOutput = GRID_NODES.reduce((sum, node) => sum + (node.output || 0), 0)
  const renewableOutput = GRID_NODES
    .filter((node) => node.type === 'solar' || node.type === 'wind')
    .reduce((sum, node) => sum + (node.output || 0), 0)
  const renewableShare = Math.round((renewableOutput / totalOutput) * 100)
  const activeJourneyStep = selectedNode?.journeyStep ?? null

  return (
    <>
      <Scene
        selectedId={selectedNode?.id}
        onSelect={handleSelect}
        onHover={handleHover}
        focusId={focusId}
        labelsOn={labelsOn}
        floorMode={floorMode}
      />

      <div className="backdrop-layer" />

      <header className="top-header">
        <div className="brand-wrap">
          <span className="brand-mark">PG</span>
          <div>
            <h1>Power Grid Intelligence Console</h1>
            <p>Interactive digital twin with real-time IoT context</p>
          </div>
        </div>

        <div className="header-kpis">
          <div className="head-kpi">
            <span>Total Output</span>
            <strong>{totalOutput.toLocaleString()} MW</strong>
          </div>
          <div className="head-kpi">
            <span>Renewable Share</span>
            <strong>{renewableShare}%</strong>
          </div>
          <div className="head-kpi">
            <span>Local Time</span>
            <strong>{clockStr}</strong>
          </div>
        </div>

        <div className="header-actions">
          <Glossary />
          <button
            className="btn"
            onClick={() => {
              const idx = FLOOR_MODES.indexOf(floorMode)
              const next = FLOOR_MODES[(idx + 1) % FLOOR_MODES.length]
              setFloorMode(next)
            }}
            title="Switch floor texture"
          >
            Floor: {floorMode[0].toUpperCase() + floorMode.slice(1)}
          </button>
          <button className={`btn ${labelsOn ? 'active' : ''}`} onClick={() => setLabelsOn((v) => !v)}>
            {labelsOn ? 'Hide Labels' : 'Show Labels'}
          </button>
          <button
            className="btn btn-primary-inline"
            onClick={() => {
              setTourStep(0)
              setTourOpen(true)
            }}
          >
            Start Tour
          </button>
          <button className="btn" onClick={() => handleInfoPanelClose()}>
            Reset View
          </button>
        </div>
      </header>

      <section className="status-strip" aria-label="Grid status overview">
        <div className="status-pills">
          <div className="status-pill online">Grid Stable</div>
          <div className="status-pill">IoT Nodes: 1,288</div>
          <div className="status-pill">Active Alerts: 2</div>
          <div className="status-pill">Avg Efficiency: 97.2%</div>
        </div>

        <div className="journey-rail" aria-label="Electricity journey">
          <span className="journey-label-title">Energy Journey</span>
          {JOURNEY_STEPS.map((step, index) => {
            const isActive = activeJourneyStep === step.label
            return (
              <button
                key={step.label}
                type="button"
                className={`journey-node${isActive ? ' is-active' : ''}`}
                onClick={() => handleJourneyClick(step)}
                title={step.types.length ? `Focus ${step.label}` : ''}
              >
                <span>{step.short}</span>
                <small>{step.label}</small>
                {index < JOURNEY_STEPS.length - 1 && <i className="journey-sep" />}
              </button>
            )
          })}
        </div>
      </section>

      <div className="left-rail">
        <aside className="legend-card">
          <div className="legend-head">
            <h2>Asset Legend</h2>
            <p>Click an asset type to cycle focus</p>
          </div>

          <div className="legend-list">
            {LEGEND_ITEMS.map((item) => (
              <button
                key={item.type}
                className="legend-item"
                onClick={() => handleLegendClick(item.type)}
                title={`Focus ${item.label}`}
              >
                <span className="legend-dot" style={{ background: TYPE_COLORS[item.type], color: TYPE_COLORS[item.type] }} />
                <span className="legend-body">
                  <strong>{item.label}</strong>
                  <small>{item.role}</small>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <DataPanel />
      </div>

      {tourOpen && (
        <TourModal
          step={tourStep}
          onNext={() => setTourStep((value) => value + 1)}
          onPrev={() => setTourStep((value) => value - 1)}
          onClose={() => setTourOpen(false)}
          onSelectNode={handleTourSelectNode}
        />
      )}

      {focusId && (
        <button className="exit-focus-btn" onClick={handleInfoPanelClose} title="Exit focused view (Esc)">
          Exit Focused View
        </button>
      )}

      {selectedNode && <InfoPanel node={selectedNode} onClose={handleInfoPanelClose} />}

      {hoveredNode && !selectedNode && (
        <div
          className="hover-tooltip"
          style={{
            left: Math.min(Math.max(mousePos.x, 120), window.innerWidth - 120),
            top: Math.min(Math.max(mousePos.y - 40, 24), window.innerHeight - 60),
          }}
        >
          {hoveredNode.label}
        </div>
      )}

      {showWelcome && <WelcomeModal onStartTour={handleStartTour} onExplore={() => setShowWelcome(false)} />}
    </>
  )
}
