import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Loader from '../components/Loader'
import ProductCard from '../components/ProductCard'

const FALLBACK = '/placeholder.svg'

function imgSrc(path) {
  if (!path) return FALLBACK
  return path.startsWith('http') ? path : `/media/${path}`
}

// Auto-advancing hero carousel
function HeroCarousel({ images }) {
  const [active, setActive] = useState(0)

  const next = useCallback(() => {
    setActive(i => (i + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (images.length < 2) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [images.length, next])

  if (!images.length) {
    return (
      <section className="hero" aria-label="Featured machinery">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-tag">Quality Agricultural Machinery</div>
          <h1 className="hero-title">
            Powering <span className="highlight">Bhutan's</span> Agriculture
          </h1>
          <p className="hero-subtitle">
            Precision-engineered machinery for every stage of farming — from planting to harvest.
          </p>
          <div className="hero-actions">
            <Link to="/catalog" className="btn btn-primary">Browse Catalog</Link>
            <Link to="/contact" className="btn btn-secondary">Get in Touch</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="hero" aria-label="Featured machinery slideshow">
      {images.map((img, i) => (
        <div key={img.id} className={`hero-slide ${i === active ? 'active' : ''}`} aria-hidden={i !== active}>
          <img src={imgSrc(img.image)} alt={`Carousel slide ${i + 1}`} className="hero-img" />
          <div className="hero-overlay" />
        </div>
      ))}

      <div className="hero-content">
        <div className="hero-tag">Quality Agricultural Machinery</div>
        <h1 className="hero-title">
          Powering <span className="highlight">Bhutan's</span> Agriculture
        </h1>
        <p className="hero-subtitle">
          Precision-engineered machinery for every stage of farming — from planting to harvest.
        </p>
        <div className="hero-actions">
          <Link to="/catalog" className="btn btn-primary">Browse Catalog</Link>
          <Link to="/contact" className="btn btn-secondary">Get in Touch</Link>
        </div>
      </div>

      {images.length > 1 && (
        <div className="hero-dots" role="tablist" aria-label="Carousel navigation">
          {images.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Slide ${i + 1}`}
              className={`hero-dot ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
              id={`hero-dot-${i}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default function Home() {
  const [carousel, setCarousel] = useState([])
  const [navData, setNavData]   = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([api.carousel(), api.nav()])
      .then(([c, n]) => { setCarousel(c); setNavData(n) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Flatten all products across categories for the featured section
  const allProducts = navData.flatMap(cat =>
    (cat.products || []).map(p => ({ ...p, categoryName: cat.name, categorySlug: cat.slug }))
  ).slice(0, 8)

  return (
    <main className="page-wrapper" id="main-content">
      <HeroCarousel images={carousel} />

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">8+</div>
              <div className="stat-label">Product Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Machine Models</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">20+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Bhutan Coverage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="section" aria-labelledby="featured-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Our Machinery</div>
            <h2 className="section-title" id="featured-heading">
              Featured <span>Products</span>
            </h2>
            <p className="section-subtitle">
              A selection of our most popular agricultural machines trusted by farmers across Bhutan.
            </p>
            <div className="divider" />
          </div>

          {loading ? (
            <Loader text="Loading products..." />
          ) : allProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">&#9881;</div>
              <h3>No products found</h3>
              <p>Make sure the backend is running on port 8000.</p>
            </div>
          ) : (
            <div className="grid-4 stagger-grid">
              {allProducts.map(p => (
                <ProductCard
                  key={`${p.categorySlug}-${p.slug}`}
                  product={p}
                  categorySlug={p.categorySlug}
                  categoryName={p.categoryName}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <Link to="/catalog" className="btn btn-primary" id="view-all-btn">
              View Full Catalog &rarr;
            </Link>
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      {/* Category Overview */}
      <section className="section" aria-labelledby="categories-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Browse by Type</div>
            <h2 className="section-title" id="categories-heading">
              Product <span>Categories</span>
            </h2>
            <div className="divider" />
          </div>

          <div className="grid-3 stagger-grid">
            {navData.map(cat => (
              <Link
                to={`/catalog?cat=${cat.slug}`}
                key={cat.slug}
                className="card"
                id={`cat-card-${cat.slug}`}
                style={{
                  padding: 'var(--space-xl)',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-sm)',
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  background: 'hsla(142,45%,38%,0.15)',
                  border: '1px solid var(--green-700)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  marginBottom: 'var(--space-sm)',
                }}>
                  &#9881;
                </div>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{cat.name}</h3>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>{cat.products.length} product{cat.products.length !== 1 ? 's' : ''}</p>
                <span className="product-card-arrow" style={{ marginTop: 'auto' }}>Explore &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: 'linear-gradient(135deg, var(--green-800), var(--green-900))',
        borderTop: '1px solid var(--green-700)',
        borderBottom: '1px solid var(--green-700)',
        padding: 'var(--space-3xl) 0',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--white)', marginBottom: 'var(--space-md)' }}>
            Ready to upgrade your farm?
          </h2>
          <p style={{ maxWidth: 520, margin: '0 auto var(--space-xl)' }}>
            Contact our team for product recommendations, pricing, and support across Bhutan.
          </p>
          <Link to="/contact" className="btn btn-accent" id="cta-contact-btn">
            Contact Us Today
          </Link>
        </div>
      </section>
    </main>
  )
}
