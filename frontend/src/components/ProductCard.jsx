import { Link } from 'react-router-dom'

const FALLBACK = '/placeholder.svg'

function imgSrc(path) {
  if (!path) return FALLBACK
  // Django stores just the relative path like "products/foo.jpg"
  return path.startsWith('http') ? path : `/media/${path}`
}

export default function ProductCard({ product, categorySlug, categoryName }) {
  return (
    <Link
      to={`/products/${categorySlug}/${product.slug}`}
      className="product-card"
      aria-label={`View ${product.name}`}
      id={`product-card-${product.slug}`}
    >
      <div className="product-card-img-wrap">
        <img
          src={imgSrc(product.image)}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
          onError={e => { e.target.src = FALLBACK }}
        />
        {categoryName && (
          <span className="product-card-badge">{categoryName}</span>
        )}
      </div>
      <div className="product-card-body">
        {categoryName && (
          <div className="product-card-category">{categoryName}</div>
        )}
        <div className="product-card-name">{product.name}</div>
        <span className="product-card-arrow">View details &rarr;</span>
      </div>
    </Link>
  )
}
