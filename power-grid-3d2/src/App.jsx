import { useState, useCallback, useEffect } from 'react'
import Scene from './components/Scene'
import InfoPanel from './components/InfoPanel'
import DataPanel from './components/DataPanel'
import TourModal from './components/TourModal'
import WelcomeModal from './components/WelcomeModal'
import Glossary from './components/Glossary'
import { GRID_NODES } from './data/gridData'

const TYPE_COLORS = {
  coal: '#888888', nuclear: '#ffaa00', solar: '#ffdd00', wind: '#00ddff',
  substation: '#4488ff', meter: '#00ff88', sensor: '#ff44aa', battery: '#aa44ff',
}

const LEGEND_ITEMS = [
  { type: 'coal',       label: 'Coal Plant',      role: 'Burns fuel → electricity' },
  { type: 'nuclear',    label: 'Nuclear Plant',    role: 'Splits atoms → electricity' },
  { type: 'solar',      label: 'Solar Farm',       role: 'Sunlight → electricity' },
  { type: 'wind',       label: 'Wind Farm',        role: 'Wind → electricity' },
  { type: 'substation', label: 'Substation',       role: 'Steps voltage up/down' },
  { type: 'battery',    label: 'Battery Storage',  role: 'Stores excess energy' },
  { type: 'meter',      label: 'Smart Meter',      role: 'Measures your usage' },
  { type: 'sensor',     label: 'Sensor Network',   role: 'Monitors grid health' },
]

const JOURNEY_STEPS = [
  { label: 'Generate',  icon: '🏭', types: ['coal', 'nuclear', 'solar', 'wind'] },
  { label: 'Transmit',  icon: '🔌', types: ['substation'] },
  { label: 'Store',     icon: '🔋', types: ['battery'] },
  { label: 'Distribute',icon: '🏘️', types: ['substation'] },
  { label: 'Measure',   icon: '📊', types: ['meter', 'sensor'] },
  { label: 'You 🏠',    icon: '🏠', types: [] },
]

export default function App() {
  const [selectedNode,    setSelectedNode]    = useState(null)
  const [hoveredNode,     setHoveredNode]     = useState(null)
  const [mousePos,        setMousePos]        = useState({ x: 0, y: 0 })
  const [showWelcome,     setShowWelcome]     = useState(true)
  const [tourOpen,        setTourOpen]        = useState(false)
  const [tourStep,        setTourStep]        = useState(0)
  const [focusId,         setFocusId]         = useState(null)
  const [labelsOn,        setLabelsOn]        = useState(true)
  const [legendTypeIndex, setLegendTypeIndex] = useState({})

  const handleSelect = useCallback(node => {
    setSelectedNode(prev => prev?.id === node.id ? null : node)
  }, [])

  const handleHover = useCallback((node, e) => {
    setHoveredNode(node)
    if (e) setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  const handleLegendClick = useCallback(type => {
    const nodes = GRID_NODES.filter(n => n.type === type)
    if (!nodes.length) return
    const idx = (legendTypeIndex[type] || 0)
    const next = (idx + 1) % nodes.length
    setLegendTypeIndex(prev => ({ ...prev, [type]: next }))
    const node = nodes[next]
    setSelectedNode(node)
    setFocusId(node.id)
  }, [legendTypeIndex])

  const handleTourSelectNode = useCallback(id => {
    if (!id) return
    const node = GRID_NODES.find(n => n.id === id)
    if (node) { setSelectedNode(node); setFocusId(node.id) }
  }, [])

  /* Clicking a journey step focuses the first matching node */
  const handleJourneyClick = useCallback(step => {
    if (!step.types.length) return
    const node = GRID_NODES.find(n => step.types.includes(n.type))
    if (node) { setSelectedNode(node); setFocusId(node.id) }
  }, [])

  const handleStartTour = () => { setShowWelcome(false); setTourStep(0); setTourOpen(true) }

  const handleInfoPanelClose = useCallback(() => {
    setSelectedNode(null); setFocusId(null)
  }, [])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') {
        if (tourOpen) setTourOpen(false)
        else if (selectedNode) { setSelectedNode(null); setFocusId(null) }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tourOpen, selectedNode])

  const totalOutput      = GRID_NODES.reduce((s, n) => s + (n.output || 0), 0)
  const activeJourneyStep = selectedNode?.journeyStep ?? null

  return (
    <>
      <Scene
        selectedId={selectedNode?.id}
        onSelect={handleSelect}
        onHover={handleHover}
        focusId={focusId}
        labelsOn={labelsOn}
      />

      {/* ── Header ── */}
      <header className="header">
        <div className="header-title">
          <div className="header-logo">⚡</div>
          <div>
            <h1>Power Grid 3D</h1>
            <span>Smart Grid &amp; IoT Visualization</span>
          </div>
        </div>
        <div className="header-actions">
          <button
            className={`btn ${labelsOn ? 'active' : ''}`}
            onClick={() => setLabelsOn(v => !v)}
          >
            {labelsOn ? '🏷 Labels On' : '🏷 Labels Off'}
          </button>
          <button className="btn tour" onClick={() => { setTourStep(0); setTourOpen(true) }}>
            ▶ Tour
          </button>
          <button className="btn" onClick={() => { setSelectedNode(null); setFocusId(null) }}>
            ↺ Reset
          </button>
        </div>
      </header>

      {/* ── Status Bar ── */}
      <div className="status-bar">
        <div className="status-item"><span className="status-dot green" /><strong>Grid:</strong> Stable</div>
        <div className="status-item"><span className="status-dot green" /><strong>{totalOutput.toLocaleString()} MW</strong> Online</div>
        <div className="status-item"><span className="status-dot green" /><strong>97.2%</strong> Efficiency</div>
        <div className="status-item"><span className="status-dot yellow" /><strong>2</strong> Alerts</div>
        <div className="status-item"><span className="status-dot green" /><strong>1,288</strong> IoT Connected</div>
      </div>

      {/* ── Electricity Journey Banner ── */}
      <div className="journey-banner">
        <span className="journey-title">Journey:</span>
        {JOURNEY_STEPS.map((step, i) => {
          const isActive = activeJourneyStep === step.label
          return (
            <div
              key={step.label}
              className={`journey-step${isActive ? ' journey-active' : ''}`}
              onClick={() => handleJourneyClick(step)}
              title={step.types.length ? `Jump to ${step.label}` : ''}
            >
              <span className="journey-icon">{step.icon}</span>
              <span className="journey-label">{step.label}</span>
              {i < JOURNEY_STEPS.length - 1 && <span className="journey-arrow">›</span>}
            </div>
          )
        })}
      </div>

      {/* ── Legend ── */}
      <div className="legend">
        <h3>Grid Components</h3>
        {LEGEND_ITEMS.map(item => (
          <div
            key={item.type}
            className="legend-item"
            onClick={() => handleLegendClick(item.type)}
            title={`Click to focus ${item.label}`}
          >
            <div className="legend-dot" style={{ background: TYPE_COLORS[item.type], color: TYPE_COLORS[item.type] }} />
            <div className="legend-text">
              <span className="legend-name">{item.label}</span>
              <span className="legend-role">{item.role}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Glossary ── */}
      <Glossary />

      {/* ── Tour (must precede InfoPanel for CSS sibling selector) ── */}
      {tourOpen && (
        <TourModal
          step={tourStep}
          onNext={() => setTourStep(s => s + 1)}
          onPrev={() => setTourStep(s => s - 1)}
          onClose={() => setTourOpen(false)}
          onSelectNode={handleTourSelectNode}
        />
      )}

      {/* ── Info Panel ── */}
      {selectedNode && (
        <InfoPanel node={selectedNode} onClose={handleInfoPanelClose} />
      )}

      {/* ── Hover Tooltip ── */}
      {hoveredNode && !selectedNode && (
        <div
          className="hover-tooltip"
          style={{
            left: Math.min(Math.max(mousePos.x, 90), window.innerWidth - 90),
            top:  Math.min(Math.max(mousePos.y - 44, 20), window.innerHeight - 50),
          }}
        >
          {hoveredNode.label}
        </div>
      )}

      {/* ── Data Panel ── */}
      <DataPanel />

      {/* ── Welcome Modal ── */}
      {showWelcome && (
        <WelcomeModal
          onStartTour={handleStartTour}
          onExplore={() => setShowWelcome(false)}
        />
      )}
    </>
  )
}
