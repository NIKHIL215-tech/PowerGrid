import { useEffect } from 'react'
import { TOUR_STEPS } from '../data/gridData'

export default function TourModal({ step, onNext, onPrev, onClose, onSelectNode }) {
  const current = TOUR_STEPS[step]
  const progress = ((step + 1) / TOUR_STEPS.length) * 100
  const isLast = step === TOUR_STEPS.length - 1

  useEffect(() => {
    if (current.target) onSelectNode(current.target)
  }, [step, current.target, onSelectNode])

  return (
    <aside className="tour-overlay">
      <button className="tour-close" onClick={onClose} title="Close tour">
        X
      </button>

      <div className="tour-modal">
        <div className="tour-header">
          <div className="tour-step-chip">
            <span className="tour-step-chip-dot" />
            Step {step + 1} of {TOUR_STEPS.length}
          </div>

          <div className="tour-progress-track">
            <div className="tour-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="tour-step-content" key={step}>
          <span className="tour-step-emoji">{current.emoji}</span>
          <h2>{current.title}</h2>
          <p>{current.body}</p>

          {current.analogy && (
            <div className="tour-analogy">
              <span className="analogy-label">Analogy</span>
              <p>{current.analogy}</p>
            </div>
          )}

          {current.tip && (
            <div className="tour-tip">
              <strong>Tip:</strong> {current.tip}
            </div>
          )}

          {current.target && (
            <div className="tour-focus-notice">
              <span className="tour-focus-icon">Focus</span>
              <div className="tour-focus-text">
                <div className="tour-focus-title">3D map aligned to the selected asset</div>
                Drag to orbit and scroll to zoom.
              </div>
            </div>
          )}
        </div>

        <div className="tour-actions">
          {step > 0 && (
            <button className="btn-secondary" onClick={onPrev}>
              Back
            </button>
          )}

          <button className="btn-primary" onClick={isLast ? onClose : onNext}>
            {isLast ? 'Finish Tour' : 'Next Step'}
          </button>

          {!isLast && (
            <button className="btn-secondary" onClick={onClose}>
              Skip
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
