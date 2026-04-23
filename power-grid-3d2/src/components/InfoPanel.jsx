const TYPE_ICONS = {
  coal: 'CL',
  nuclear: 'NU',
  solar: 'SO',
  wind: 'WI',
  substation: 'SS',
  meter: 'MT',
  sensor: 'SN',
  battery: 'BT',
}

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

const TYPE_LABELS = {
  coal: 'Thermal Generation',
  nuclear: 'Nuclear Generation',
  solar: 'Renewable Generation',
  wind: 'Renewable Generation',
  substation: 'Transmission Infrastructure',
  meter: 'Advanced Metering Infrastructure',
  sensor: 'Field Sensor Network',
  battery: 'Grid Storage System',
}

const JOURNEY_COLORS = {
  Generate: '#f8b84a',
  Transmit: '#6f9fff',
  Distribute: '#69c8ff',
  Store: '#b997ff',
  Measure: '#ff7cb7',
}

function statColor(value) {
  const content = String(value)
  if (content === 'true' || value === 'Normal' || value === 'Charging') return '#2ed6a5'
  if (content === 'false' || value === 'Error') return '#ff6d8e'
  return undefined
}

function statDisplay(value) {
  if (String(value) === 'true') return 'Online'
  if (String(value) === 'false') return 'Offline'
  return String(value)
}

function parsePct(value) {
  const matched = String(value).match(/^([\d.]+)\s*%$/)
  return matched ? Math.min(parseFloat(matched[1]), 100) : null
}

function StatCard({ label, value, nodeColor }) {
  const displayColor = statColor(value) || nodeColor
  const pct = parsePct(value)

  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: displayColor }}>
        {statDisplay(value)}
      </div>
      {pct !== null && (
        <div className="stat-fill-track">
          <div className="stat-fill-bar" style={{ width: `${pct}%`, background: displayColor }} />
        </div>
      )}
    </div>
  )
}

export default function InfoPanel({ node, onClose }) {
  if (!node) return null

  const color = TYPE_COLORS[node.type]
  const label = TYPE_LABELS[node.type]
  const journeyColor = JOURNEY_COLORS[node.journeyStep] || color
  const icon = TYPE_ICONS[node.type]
  const stats = Object.entries(node.stats || {})

  return (
    <aside className="info-panel" style={{ '--node-color': color }}>
      <div className="info-hero">
        <div className="info-hero-bg" />
        <div className="info-hero-glow" />

        <div className="info-hero-top">
          <span className="info-hero-icon-wrap">{icon}</span>
          <div className="info-hero-name">
            <h2>{node.label}</h2>
            <div className="info-hero-badges">
              <span className="type-badge" style={{ background: `${color}20`, color, border: `1px solid ${color}45` }}>
                {label}
              </span>
              {node.journeyStep && (
                <span
                  className="type-badge"
                  style={{
                    background: `${journeyColor}20`,
                    color: journeyColor,
                    border: `1px solid ${journeyColor}45`,
                  }}
                >
                  {node.journeyStep}
                </span>
              )}
            </div>
          </div>
          <button className="info-close" onClick={onClose} title="Close panel (Esc)">
            X
          </button>
        </div>

        <div className="info-hero-status">
          <span className="info-hero-status-dot" />
          Real-time operational telemetry
        </div>
      </div>

      <div className="info-body">
        {node.simpleExplain && (
          <section className="info-section">
            <div className="section-label">Simple Explanation</div>
            <div className="simple-explain">
              <p>{node.simpleExplain}</p>
            </div>
          </section>
        )}

        {node.analogy && (
          <section className="info-section">
            <div className="section-label">Analogy</div>
            <div className="analogy-box">
              <p>{node.analogy}</p>
            </div>
          </section>
        )}

        <section className="info-section">
          <div className="section-label">Technical Overview</div>
          <p className="tech-desc">{node.description}</p>
        </section>

        {stats.length > 0 && (
          <section className="info-section">
            <div className="section-label">Live Metrics</div>
            <div className="info-stats">
              {stats.map(([key, value]) => (
                <StatCard key={key} label={key} value={value} nodeColor={color} />
              ))}
            </div>
          </section>
        )}

        {node.funFact && (
          <section className="fun-fact">
            <div className="fun-fact-label">Did You Know?</div>
            <p>{node.funFact}</p>
          </section>
        )}
      </div>
    </aside>
  )
}
