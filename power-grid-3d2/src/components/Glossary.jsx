import { useState } from 'react'
import { GLOSSARY } from '../data/gridData'

export default function Glossary() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = GLOSSARY.filter(g =>
    g.term.toLowerCase().includes(search.toLowerCase()) ||
    g.def.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <button className="glossary-toggle btn" onClick={() => setOpen(v => !v)}>
        📖 Glossary
      </button>
      {open && (
        <div className="glossary-panel">
          <div className="glossary-header">
            <h3>📖 Key Terms Explained</h3>
            <button className="info-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <input
            className="glossary-search"
            placeholder="Search terms…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="glossary-list">
            {filtered.map(g => (
              <div key={g.term} className="glossary-item">
                <div className="glossary-term">{g.term}</div>
                <div className="glossary-def">{g.def}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
