import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Loader from '../components/Loader'
import PersonCard from '../components/PersonCard'
import ProductCard from '../components/ProductCard'

export default function Info() {
  const [data, setData]       = useState(null)
  const [navData, setNavData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.people(), api.nav()])
      .then(([p, n]) => { setData(p); setNavData(n) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const featuredProducts = navData
    .flatMap(cat => (cat.products || []).map(p => ({ ...p, categorySlug: cat.slug, categoryName: cat.name })))
    .slice(0, 4)

  return (
    <main className="page-wrapper" id="main-content">
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-tag">About Us</div>
          <h1 className="page-hero-title">About <span className="text-green">Depel</span></h1>
          <p className="page-hero-subtitle">
            Learn about our mission, our people, and the machinery we bring to Bhutan's farming communities.
          </p>
        </div>
      </div>

      {/* Mission section */}
      <section className="section-sm">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 'var(--space-3xl)' }}>
            <div>
              <div className="section-tag">Our Mission</div>
              <h2 style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                Empowering Farmers with <span className="text-green">Modern Machinery</span>
              </h2>
              <p style={{ marginBottom: 'var(--space-md)' }}>
                Depel is Bhutan's trusted agricultural machinery supplier. We source, import, and support
                precision-engineered equipment to help Bhutanese farmers work more efficiently
                and productively — from high-altitude terraces to the valley floors.
              </p>
              <p style={{ marginBottom: 'var(--space-xl)' }}>
                Our team combines deep field knowledge with a genuine commitment to sustainable,
                productive agriculture for every community across the country.
              </p>
              <Link to="/catalog" className="btn btn-primary" id="info-catalog-btn">Browse Our Catalog</Link>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, var(--green-900), var(--gray-800))',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--green-700)',
              padding: 'var(--space-2xl)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-md)',
            }}>
              {[
                { n: '8+',   l: 'Product Categories' },
                { n: '50+',  l: 'Machine Models' },
                { n: '20+',  l: 'Years Experience' },
                { n: '100%', l: 'Bhutan Coverage' },
              ].map(s => (
                <div key={s.l} style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-lg)',
                  textAlign: 'center',
                }}>
                  <div className="stat-number" style={{ fontSize: '2rem' }}>{s.n}</div>
                  <div className="stat-label">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* Leadership preview */}
      <section className="section-sm">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Leadership</div>
            <h2 className="section-title">Meet Our <span>Directors</span></h2>
            <div className="divider" />
          </div>

          {loading ? <Loader text="Loading..." /> : (
            <>
              <div className="grid-4 stagger-grid">
                {(data?.board_of_directors || []).slice(0, 4).map(p => (
                  <PersonCard key={p.id} person={p} />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
                <Link to="/people" className="btn btn-secondary" id="info-people-btn">View All Team Members</Link>
              </div>
            </>
          )}
        </div>
      </section>

      <div className="gradient-line" />

      {/* Featured products preview */}
      <section className="section-sm">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Featured</div>
            <h2 className="section-title">Our <span>Machinery</span></h2>
            <div className="divider" />
          </div>
          {loading ? <Loader /> : (
            <div className="grid-4 stagger-grid">
              {featuredProducts.map(p => (
                <ProductCard key={`${p.categorySlug}-${p.slug}`} product={p} categorySlug={p.categorySlug} categoryName={p.categoryName} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
