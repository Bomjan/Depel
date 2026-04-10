import { useState, useEffect } from 'react'
import { api } from '../api'
import Loader from '../components/Loader'
import PersonCard from '../components/PersonCard'

export default function People() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]       = useState('directors')

  useEffect(() => {
    api.people()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const tabs = [
    { id: 'directors',   label: 'Board of Directors' },
    { id: 'management',  label: 'Management Team' },
    { id: 'employees',   label: 'Employees' },
  ]

  const people = data
    ? tab === 'directors'
      ? data.board_of_directors
      : tab === 'management'
        ? data.management_team
        : data.employees
    : []

  return (
    <main className="page-wrapper" id="main-content">
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-tag">Our Team</div>
          <h1 className="page-hero-title">The <span className="text-green">People</span> Behind Depel</h1>
          <p className="page-hero-subtitle">
            A dedicated team of professionals committed to bringing the best agricultural machinery to Bhutan.
          </p>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          {/* Tab switcher */}
          <div role="tablist" aria-label="Team categories" style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                className={`category-pill ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
                {data && (
                  <span style={{ opacity: 0.7, fontSize: '0.75rem', marginLeft: 4 }}>
                    ({(tab === t.id ? people : (
                      t.id === 'directors' ? data.board_of_directors
                      : t.id === 'management' ? data.management_team
                      : data.employees
                    ))?.length || 0})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
            {loading ? (
              <Loader text="Loading team..." />
            ) : !people || people.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">&#128100;</div>
                <h3>No records found</h3>
              </div>
            ) : (
              <div className="grid-4 stagger-grid">
                {people.map(person => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
