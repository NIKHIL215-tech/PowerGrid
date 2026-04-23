import { useState } from 'react'
import { GLOSSARY } from '../data/gridData'

export default function Glossary() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = GLOSSARY.filter((entry) =>
    entry.term.toLowerCase().includes(search.toLowerCase()) ||
    entry.def.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="glossary-nav">
      <button className={`btn glossary-toggle${open ? ' active' : ''}`} onClick={() => setOpen((value) => !value)}>
        Glossary
      </button>

      {open && (
        <aside className="glossary-panel">
          <div className="glossary-header">
            <h3>Grid Terms</h3>
            <button className="info-close" onClick={() => setOpen(false)}>
              X
            </button>
          </div>

          <input
            className="glossary-search"
            placeholder="Search a term..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="glossary-list">
            {filtered.length > 0 ? (
              filtered.map((entry) => (
                <article key={entry.term} className="glossary-item">
                  <div className="glossary-term">{entry.term}</div>
                  <div className="glossary-def">{entry.def}</div>
                </article>
              ))
            ) : (
              <article className="glossary-item">
                <div className="glossary-def">No matching terms found.</div>
              </article>
            )}
          </div>
        </aside>
      )}
    </div>
  )
}
