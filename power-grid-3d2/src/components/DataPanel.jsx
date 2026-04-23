import { useState, useEffect, useRef } from 'react'
import { CHART_DATA } from '../data/gridData'

const HOURS = ['0', '3', '6', '9', '12', '15', '18', '21', '24']

const MODES = [
  { key: 'consumption', label: 'Demand', unit: 'MW', color: '#63c7ff' },
  { key: 'renewable', label: 'Renewables', unit: 'MW', color: '#2ed6a5' },
  { key: 'gridLoad', label: 'Utilization', unit: '%', color: '#f8b84a' },
]

function useCounter(target, duration = 900) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    const start = performance.now()
    const from = 0
    const delta = target - from

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - (1 - t) ** 3
      setValue(Math.round(from + delta * ease))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return value
}

export default function DataPanel() {
  const [mode, setMode] = useState('consumption')

  const data = CHART_DATA[mode]
  const max = Math.max(...data)
  const modeConfig = MODES.find((entry) => entry.key === mode)
  const color = modeConfig.color
  const currentHour = new Date().getHours()

  const totalMW = useCounter(3900)
  const renewablePct = useCounter(18)
  const gridEff = useCounter(97)

  return (
    <aside className="data-panel">
      <header className="data-panel-header">
        <div className="data-panel-title-wrap">
          <span className="data-panel-title">Operational Analytics</span>
          <span className="data-panel-live">
            <span className="data-panel-live-dot" /> Live stream
          </span>
        </div>

        <div className="chart-mode-btns">
          {MODES.map((entry) => (
            <button
              key={entry.key}
              className={`chart-mode-btn ${mode === entry.key ? 'active' : ''}`}
              onClick={() => setMode(entry.key)}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </header>

      <div className="chart-container">
        <div className="chart-row">
          {data.map((value, index) => {
            const isCurrent = index === currentHour
            const heightPct = `${(value / max) * 100}%`
            const background = isCurrent
              ? `linear-gradient(180deg, ${color} 0%, ${color}90 100%)`
              : `linear-gradient(180deg, ${color}50 0%, ${color}1c 100%)`

            return (
              <div
                key={index}
                className={`chart-bar${isCurrent ? ' current' : ''}`}
                data-val={`${value}${modeConfig.unit}`}
                style={{
                  height: heightPct,
                  background,
                  boxShadow: isCurrent ? `0 0 14px ${color}80` : 'none',
                }}
              />
            )
          })}
        </div>

        <div className="chart-axis">
          {HOURS.map((hour) => (
            <span key={hour}>{hour}h</span>
          ))}
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-val" style={{ color: '#63c7ff' }}>
            {totalMW.toLocaleString()}
          </div>
          <div className="kpi-label">MW Output</div>
        </div>

        <div className="kpi">
          <div className="kpi-val" style={{ color: '#2ed6a5' }}>
            {renewablePct}%
          </div>
          <div className="kpi-label">Renewables</div>
        </div>

        <div className="kpi">
          <div className="kpi-val" style={{ color: '#f8b84a' }}>
            {gridEff}%
          </div>
          <div className="kpi-label">Efficiency</div>
        </div>
      </div>
    </aside>
  )
}
