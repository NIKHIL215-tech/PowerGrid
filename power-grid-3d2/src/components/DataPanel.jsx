import { useState, useEffect, useRef } from 'react'
import { CHART_DATA } from '../data/gridData'

const HOURS = ['0', '3', '6', '9', '12', '15', '18', '21', '24']

const MODES = [
  { key: 'consumption', label: 'Load',   unit: 'MW',  color: '#00c8ff' },
  { key: 'renewable',   label: 'Solar',  unit: 'MW',  color: '#22d3a0' },
  { key: 'gridLoad',    label: 'Util%',  unit: '%',   color: '#f59e0b' },
]

/* Smooth animated counter */
function useCounter(target, duration = 900) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    const start = performance.now()
    const from = 0
    const delta = target - from

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)          // ease-out cubic
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

  const data       = CHART_DATA[mode]
  const max        = Math.max(...data)
  const modeConfig = MODES.find(m => m.key === mode)
  const color      = modeConfig.color
  const currentHour = new Date().getHours()

  const totalMW      = useCounter(3900)
  const renewablePct = useCounter(18)
  const gridEff      = useCounter(97)

  return (
    <div className="data-panel">
      <div className="data-panel-header">
        <span className="data-panel-title">Grid Analytics</span>
        <div className="chart-mode-btns">
          {MODES.map(m => (
            <button
              key={m.key}
              className={`chart-mode-btn ${mode === m.key ? 'active' : ''}`}
              onClick={() => setMode(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div className="chart-row">
        {data.map((v, i) => {
          const isCurrent = i === currentHour
          const heightPct = `${(v / max) * 100}%`
          const bg = isCurrent
            ? `linear-gradient(180deg, ${color} 0%, ${color}88 100%)`
            : `${color}33`

          return (
            <div
              key={i}
              className={`chart-bar${isCurrent ? ' current' : ''}`}
              data-val={`${v}${modeConfig.unit}`}
              style={{
                height: heightPct,
                background: bg,
                boxShadow: isCurrent ? `0 0 8px ${color}66` : 'none',
              }}
            />
          )
        })}
      </div>

      <div className="chart-axis">
        {HOURS.map(h => <span key={h}>{h}h</span>)}
      </div>

      {/* KPIs with animated counters */}
      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-val" style={{ color: '#00c8ff' }}>
            {totalMW.toLocaleString()}
          </div>
          <div className="kpi-label">MW Total</div>
        </div>
        <div className="kpi">
          <div className="kpi-val" style={{ color: '#22d3a0' }}>
            {renewablePct}%
          </div>
          <div className="kpi-label">Renewable</div>
        </div>
        <div className="kpi">
          <div className="kpi-val" style={{ color: '#f59e0b' }}>
            {gridEff}%
          </div>
          <div className="kpi-label">Efficiency</div>
        </div>
      </div>
    </div>
  )
}
