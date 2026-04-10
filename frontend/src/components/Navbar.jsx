import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { api } from '../api'

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [navData, setNavData]       = useState([])
  const [productQuery, setProductQuery] = useState('')
  const location = useLocation()

  const closeMenu = () => {
    setMenuOpen(false)
    setProductQuery('')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    api.nav().then(setNavData).catch(() => {})
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    closeMenu()
  }, [location.pathname])

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen)
    return () => document.body.classList.remove('no-scroll')
  }, [menuOpen])

  // Close on Escape for a nicer mobile/keyboard experience
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const allProducts = navData.flatMap(cat =>
    (cat.products || []).map(p => ({
      ...p,
      categoryName: cat.name,
      categorySlug: cat.slug,
    }))
  )

  const filteredProducts = !productQuery
    ? allProducts
    : allProducts.filter(p => p.name?.toLowerCase().includes(productQuery.toLowerCase()))

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="container nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo" aria-label="Depel home">
          <div className="nav-logo-mark">D</div>
          <span className="nav-logo-text">De<span>pel</span></span>
        </Link>

        {/* Desktop navigation */}
        <ul className="nav-links" role="menubar" aria-label="Primary">
          <li role="none">
            <NavLink
              to="/"
              end
              role="menuitem"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Home
            </NavLink>
          </li>

          <li role="none" className="nav-dropdown">
            <button
              type="button"
              role="menuitem"
              aria-haspopup="true"
              className="nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Products ▾
            </button>
            <div className="nav-dropdown-menu" role="menu">
              <div className="nav-dropdown-header">Browse categories</div>
              {navData.length === 0 ? (
                <span className="nav-dropdown-item" style={{ color: 'var(--text-muted)' }}>
                  Loading…
                </span>
              ) : (
                navData.map(cat => (
                  <NavLink
                    key={cat.slug}
                    to={`/catalog?cat=${cat.slug}`}
                    role="menuitem"
                    className="nav-dropdown-item"
                  >
                    {cat.name}
                  </NavLink>
                ))
              )}
            </div>
          </li>

          <li role="none">
            <NavLink
              to="/catalog"
              role="menuitem"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Catalog
            </NavLink>
          </li>
          <li role="none">
            <NavLink
              to="/people"
              role="menuitem"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              People
            </NavLink>
          </li>
          <li role="none">
            <NavLink
              to="/rnd"
              role="menuitem"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              R&amp;D
            </NavLink>
          </li>
          <li role="none">
            <NavLink
              to="/contact"
              role="menuitem"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Mobile scrim */}
        {menuOpen && (
          <button
            className="nav-scrim"
            aria-label="Close menu"
            onClick={closeMenu}
          />
        )}

        {/* Mobile menu (simple, readable, iOS-glass modal) */}
        <div className={`nav-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
          <div className="nav-mobile" aria-label="Mobile navigation">
            <div className="nav-mobile-top">
              <div className="nav-mobile-title">Menu</div>
              <button className="nav-close" aria-label="Close menu" onClick={closeMenu} type="button">
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="nav-mobile-search">
              <input
                className="nav-mobile-search-input"
                type="search"
                placeholder="Search products…"
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                aria-label="Search products"
              />
            </div>

            <div className="nav-mobile-section">
              <div className="nav-mobile-section-title">Quick links</div>
              <div className="nav-mobile-grid">
                <NavLink to="/catalog" className="nav-mobile-chip" onClick={closeMenu}>Catalog</NavLink>
                <NavLink to="/people" className="nav-mobile-chip" onClick={closeMenu}>People</NavLink>
                <NavLink to="/rnd" className="nav-mobile-chip" onClick={closeMenu}>R&amp;D</NavLink>
                <NavLink to="/contact" className="nav-mobile-chip" onClick={closeMenu}>Contact</NavLink>
              </div>
            </div>

            <div className="nav-mobile-section">
              <div className="nav-mobile-section-title">Products</div>
              <div className="nav-mobile-list" role="list">
                {(filteredProducts.length ? filteredProducts : allProducts).slice(0, 18).map(p => (
                  <NavLink
                    key={`${p.categorySlug}-${p.slug}`}
                    to={`/products/${p.categorySlug}/${p.slug}`}
                    className="nav-mobile-row"
                    onClick={closeMenu}
                  >
                    <span className="nav-mobile-row-title">{p.name}</span>
                    <span className="nav-mobile-row-meta">{p.categoryName}</span>
                  </NavLink>
                ))}
                {allProducts.length === 0 && (
                  <div className="nav-mobile-row muted">Loading products…</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen(o => !o)}
          id="nav-toggle-btn"
          type="button"
        >
          <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0)' : 'none' }} />
          <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>
    </nav>
  )
}
