import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api'
import Loader from '../components/Loader'
import ProductCard from '../components/ProductCard'

export default function Catalog() {
  const [navData, setNavData]           = useState([])
  const [loading, setLoading]           = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery]               = useState('')

  // Pre-select category from URL ?cat= param
  const initialCat = searchParams.get('cat') || 'all'
  const [activeSlug, setActiveSlug] = useState(initialCat)

  useEffect(() => {
    api.nav()
      .then(setNavData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Sync URL when category filter changes
  const selectCat = (slug) => {
    setActiveSlug(slug)
    slug === 'all'
      ? setSearchParams({})
      : setSearchParams({ cat: slug })
  }

  // Build filtered product list
  const filteredCategories = activeSlug === 'all'
    ? navData
    : navData.filter(c => c.slug === activeSlug)

  const filtered = filteredCategories.flatMap(cat =>
    (cat.products || [])
      .filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()))
      .map(p => ({ ...p, categoryName: cat.name, categorySlug: cat.slug }))
  )

  const totalCount = navData.flatMap(c => c.products || []).length

  return (
    <main className="page-wrapper" id="main-content">
      {/* Page hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-tag">Full Catalog</div>
          <h1 className="page-hero-title">Agricultural <span className="text-green">Machinery</span></h1>
          <p className="page-hero-subtitle">
            {totalCount} machines across {navData.length} categories — find the right tool for your field.
          </p>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          {/* Search bar */}
          <div style={{ marginBottom: 'var(--space-xl)', maxWidth: 480 }}>
            <input
              type="search"
              id="catalog-search"
              className="form-input"
              placeholder="Search machines..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search products"
            />
          </div>

          {/* Category pills */}
          {loading ? <Loader /> : (
            <>
              <div className="category-pills" role="tablist" aria-label="Filter by category">
                <button
                  role="tab"
                  aria-selected={activeSlug === 'all'}
                  className={`category-pill ${activeSlug === 'all' ? 'active' : ''}`}
                  onClick={() => selectCat('all')}
                  id="cat-filter-all"
                >
                  All ({totalCount})
                </button>
                {navData.map(cat => (
                  <button
                    key={cat.slug}
                    role="tab"
                    aria-selected={activeSlug === cat.slug}
                    className={`category-pill ${activeSlug === cat.slug ? 'active' : ''}`}
                    onClick={() => selectCat(cat.slug)}
                    id={`cat-filter-${cat.slug}`}
                  >
                    {cat.name} ({(cat.products || []).length})
                  </button>
                ))}
              </div>

              {/* Results */}
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">&#128269;</div>
                  <h3>No machines found</h3>
                  <p>Try a different category or search term.</p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
                    Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                  </p>
                  <div className="grid-4 stagger-grid">
                    {filtered.map(p => (
                      <ProductCard
                        key={`${p.categorySlug}-${p.slug}`}
                        product={p}
                        categorySlug={p.categorySlug}
                        categoryName={p.categoryName}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
