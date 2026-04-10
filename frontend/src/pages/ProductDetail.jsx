import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import Loader from '../components/Loader'
import { XCircleIcon } from '../components/Icons'

const FALLBACK = '/placeholder.svg'

function imgSrc(path) {
  if (!path) return FALLBACK
  return path.startsWith('http') ? path : `/media/${path}`
}

export default function ProductDetail() {
  const { category_slug, product_slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)
  const [activeImg, setActiveImg] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(false)
    api.product(category_slug, product_slug)
      .then(data => {
        setProduct(data)
        setActiveImg(data.image)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [category_slug, product_slug])

  if (loading) return <main className="page-wrapper"><Loader text="Loading product..." /></main>

  if (error || !product) {
    return (
      <main className="page-wrapper">
        <div className="container section empty-state">
          <div className="empty-state-icon" aria-hidden="true"><XCircleIcon size={56} /></div>
          <h2>Product not found</h2>
          <p>This product may have been removed or the URL is incorrect.</p>
          <Link to="/catalog" className="btn btn-primary" style={{ marginTop: 'var(--space-xl)' }}>
            Back to Catalog
          </Link>
        </div>
      </main>
    )
  }

  const partImages   = product.part_images || []
  const allImages    = [product.image, ...partImages].filter(Boolean)
  const attrs        = product.attributes || {}
  const attrEntries  = Object.entries(attrs)

  return (
    <main className="page-wrapper" id="main-content">
      {/* Breadcrumb */}
      <div className="detail-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to="/catalog">Catalog</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to={`/catalog?cat=${product.category?.slug}`}>{product.category?.name}</Link>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
          </nav>

          <div className="detail-grid">
            {/* Left: images */}
            <div>
              <div className="detail-img-wrap" id="product-main-image">
                <img
                  src={imgSrc(activeImg)}
                  alt={product.name}
                  className="detail-img"
                  onError={e => { e.target.src = FALLBACK }}
                />
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="detail-parts">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      className={`detail-part-thumb ${activeImg === img ? 'active' : ''}`}
                      onClick={() => setActiveImg(img)}
                      aria-label={`View image ${i + 1}`}
                      id={`thumb-${i}`}
                      style={{ background: 'none', border: '2px solid transparent', cursor: 'pointer', borderRadius: 'var(--radius-sm)', overflow: 'hidden', padding: 0 }}
                    >
                      <img
                        src={imgSrc(img)}
                        alt={`${product.name} angle ${i + 1}`}
                        style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                        onError={e => { e.target.src = FALLBACK }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: info */}
            <div className="detail-info">
              <div className="detail-category-tag">{product.category?.name}</div>
              <h1 className="detail-name">{product.name}</h1>

              {product.brand && (
                <span className="detail-brand">Brand: {product.brand}</span>
              )}

              {product.description && (
                <p style={{ marginBottom: 'var(--space-xl)', lineHeight: 1.75 }}>
                  {product.description}
                </p>
              )}

              {/* Specifications table */}
              {attrEntries.length > 0 && (
                <div className="attrs-table" id="product-specs">
                  <div className="attrs-table-header">Specifications</div>
                  {attrEntries.map(([label, value]) => (
                    <div className="attr-row" key={label}>
                      <span className="attr-label">{label}</span>
                      <span className="attr-value">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-primary" id="enquire-btn">
                  Enquire About This
                </Link>
                <Link to="/catalog" className="btn btn-secondary" id="back-catalog-btn">
                  &larr; Back to Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
