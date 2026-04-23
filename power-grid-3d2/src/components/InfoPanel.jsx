const TYPE_ICONS = {
  coal: '🏭', nuclear: '⚛️', solar: '☀️', wind: '💨',
  substation: '⚡', meter: '📊', sensor: '📡', battery: '🔋',
}

const TYPE_COLORS = {
  coal: '#888888', nuclear: '#ffaa00', solar: '#ffdd00', wind: '#00ddff',
  substation: '#4488ff', meter: '#00ff88', sensor: '#ff44aa', battery: '#aa44ff',
}

const TYPE_LABELS = {
  coal: 'Fossil Fuel', nuclear: 'Nuclear', solar: 'Renewable', wind: 'Renewable',
  substation: 'Infrastructure', meter: 'IoT Device', sensor: 'IoT Sensor', battery: 'Energy Storage',
}

const JOURNEY_COLORS = {
  Generate: '#ffaa00', Transmit: '#4488ff', Distribute: '#00ddff',
  Store: '#aa44ff', Measure: '#ff44aa',
}

function statColor(v) {
  const s = String(v)
  if (s === 'true' || v === 'Normal' || v === 'Charging') return '#22d3a0'
  if (s === 'false' || v === 'Error') return '#ef4444'
  return undefined
}

function statDisplay(v) {
  if (String(v) === 'true') return '● Online'
  if (String(v) === 'false') return '● Offline'
  return String(v)
}

export default function InfoPanel({ node, onClose }) {
  if (!node) return null

  const color       = TYPE_COLORS[node.type]
  const label       = TYPE_LABELS[node.type]
  const journeyColor = JOURNEY_COLORS[node.journeyStep] || color
  const icon        = TYPE_ICONS[node.type]
  const stats       = Object.entries(node.stats || {})

  return (
    <div className="info-panel" style={{ '--node-color': color }}>

      {/* ── Header ── */}
      <div className="info-header">
        <div className="info-header-accent" />
        <h2>{icon} {node.label}</h2>
        <button className="info-close" onClick={onClose} title="Close (Esc)">✕</button>
      </div>

      <div className="info-body">

        {/* Badges */}
        <div className="info-badges">
          <span
            className="type-badge"
            style={{ background: `${color}1a`, color, border: `1px solid ${color}40` }}
          >
            {label}
          </span>
          {node.journeyStep && (
            <span
              className="type-badge"
              style={{ background: `${journeyColor}1a`, color: journeyColor, border: `1px solid ${journeyColor}40` }}
            >
              {node.journeyStep}
            </span>
          )}
        </div>

        {/* Simple explanation */}
        {node.simpleExplain && (
          <div className="simple-explain info-section">
            <div className="simple-explain-header">💡 In Simple Words</div>
            <p>{node.simpleExplain}</p>
          </div>
        )}

        {/* Analogy */}
        {node.analogy && (
          <div className="analogy-box info-section">
            <span className="analogy-label">🔄 Analogy</span>
            <p>{node.analogy}</p>
          </div>
        )}

        {/* Technical description */}
        <div className="info-section">
          <p className="tech-desc">{node.description}</p>
        </div>

        {/* Stats grid */}
        {stats.length > 0 && (
          <div className="info-section">
            <div className="info-stats">
              {stats.map(([k, v]) => (
                <div key={k} className="stat-card">
                  <div className="stat-label">{k}</div>
                  <div className="stat-value" style={{ color: statColor(v) }}>
                    {statDisplay(v)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fun fact */}
        {node.funFact && (
          <div className="fun-fact">
            <div className="fun-fact-label">🎯 Did you know?</div>
            <p>{node.funFact}</p>
          </div>
        )}

      </div>
    </div>
  )
}
