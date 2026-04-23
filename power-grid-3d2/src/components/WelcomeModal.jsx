const JOURNEY_STEPS = [
  { code: 'GEN', label: 'Generate', desc: 'Produce electrical energy' },
  { code: 'TX', label: 'Transmit', desc: 'Move at high voltage' },
  { code: 'DIST', label: 'Distribute', desc: 'Route to local zones' },
  { code: 'IOT', label: 'Measure', desc: 'Monitor in real time' },
  { code: 'LOAD', label: 'Consumer', desc: 'Power homes and industry' },
]

export default function WelcomeModal({ onStartTour, onExplore }) {
  return (
    <div className="modal-backdrop">
      <div className="welcome-modal">
        <div className="welcome-hero">
          <div className="welcome-hero-top">
            <span className="welcome-emoji">PG</span>
            <span className="welcome-chip">Digital Twin</span>
          </div>
          <h1>Power Grid 3D Command Brief</h1>
          <span className="welcome-subtitle">
            Explore how generation, transmission, storage, and IoT coordinate to deliver stable electricity from source to consumer.
          </span>
          <div className="welcome-hero-metrics">
            <div className="welcome-hero-metric">
              <strong>5</strong>
              <span>Flow Stages</span>
            </div>
            <div className="welcome-hero-metric">
              <strong>1,288</strong>
              <span>IoT Nodes</span>
            </div>
            <div className="welcome-hero-metric">
              <strong>97.2%</strong>
              <span>Avg Efficiency</span>
            </div>
          </div>
        </div>

        <div className="welcome-body">
          <div className="welcome-analogy">
            <span className="analogy-icon">FLOW</span>
            <div>
              <strong>Think of the grid as a managed utility pipeline</strong>
              <p>
                Energy is produced at centralized sources, transported through high-capacity infrastructure,
                conditioned by substations, and delivered to consumers with live sensor feedback at every step.
              </p>
            </div>
          </div>

          <div className="welcome-journey">
            {JOURNEY_STEPS.map((step, index) => (
              <div
                key={step.label}
                className={`welcome-step-wrap${index === JOURNEY_STEPS.length - 1 ? ' is-last' : ''}`}
              >
                <div className="welcome-step">
                  <div className="welcome-step-icon">{step.code}</div>
                  <div className="welcome-step-label">{step.label}</div>
                  <div className="welcome-step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="welcome-actions">
            <button className="btn-primary" onClick={onStartTour}>
              Launch Guided Tour
            </button>
            <button className="btn-secondary" onClick={onExplore}>
              Continue to Dashboard
            </button>
          </div>

          <p className="welcome-hint">Tip: Click any highlighted node in the 3D map to inspect live details.</p>
        </div>
      </div>
    </div>
  )
}
