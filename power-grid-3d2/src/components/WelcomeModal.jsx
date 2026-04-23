const JOURNEY_STEPS = [
  { icon: '🏭', label: 'Generate',  desc: 'Make electricity' },
  { icon: '🔌', label: 'Transmit',  desc: 'Send it far' },
  { icon: '🏘️', label: 'Distribute', desc: 'Bring it near' },
  { icon: '📊', label: 'Measure',   desc: 'Track usage' },
  { icon: '🏠', label: 'You!',      desc: 'Power home' },
]

export default function WelcomeModal({ onStartTour, onExplore }) {
  return (
    <div className="modal-backdrop">
      <div className="welcome-modal">

        {/* Gradient hero */}
        <div className="welcome-hero">
          <span className="welcome-emoji">⚡</span>
          <h1>Power Grid 3D</h1>
          <span className="welcome-subtitle">
            An interactive guide to how electricity reaches your home
          </span>
        </div>

        <div className="welcome-body">
          {/* Water analogy */}
          <div className="welcome-analogy">
            <span className="analogy-icon">💧</span>
            <div>
              <strong>Think of it like a water supply system</strong>
              <p>
                Just like water is pumped from a source, through pipes, and into your tap —
                electricity is generated at a power plant, carried through wires, and delivered
                to your home.
              </p>
            </div>
          </div>

          {/* Journey steps */}
          <div className="welcome-journey">
            {JOURNEY_STEPS.map((step, i) => (
              <>
                <div key={step.label} className="welcome-step">
                  <div className="welcome-step-icon">{step.icon}</div>
                  <div className="welcome-step-label">{step.label}</div>
                  <div className="welcome-step-desc">{step.desc}</div>
                </div>
                {i < JOURNEY_STEPS.length - 1 && (
                  <span key={`arrow-${i}`} className="welcome-step-arrow">›</span>
                )}
              </>
            ))}
          </div>

          {/* CTA */}
          <div className="welcome-actions">
            <button className="btn-primary" onClick={onStartTour}>▶ Start Guided Tour</button>
            <button className="btn-secondary" onClick={onExplore}>Explore on my own</button>
          </div>
          <p className="welcome-hint">
            💡 Click any glowing node in the 3D view to learn what it does
          </p>
        </div>

      </div>
    </div>
  )
}
