import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { api } from '../api'

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [navData, setNavData]       = useState([])
  const [openDropdown, setOpenDropdown] = useState(null) // category slug (mobile)
  const [productsOpen, setProductsOpen] = useState(false)
  const [productQuery, setProductQuery] = useState('')
  const location = useLocation()

  const closeMenu = () => {
    setMenuOpen(false)
    setOpenDropdown(null)
    setProductsOpen(false)
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

  const handleDropdownToggle = (slug) => {
    setOpenDropdown(prev => prev === slug ? null : slug)
  }

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

        {/* Mobile scrim */}
        {menuOpen && (
          <button
            className="nav-scrim"
            aria-label="Close menu"
            onClick={closeMenu}
          />
        )}

        {/* Links (desktop = inline, mobile = drawer) */}
        <div className={`nav-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
          <div className="nav-drawer-header">
            <Link to="/" className="nav-logo" aria-label="Depel home" onClick={closeMenu}>
              <div className="nav-logo-mark">D</div>
              <span className="nav-logo-text">De<span>pel</span></span>
            </Link>
            <button className="nav-close" aria-label="Close menu" onClick={closeMenu} type="button">
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="nav-mobile" aria-label="Mobile navigation">
            <ul id="nav-links" className="nav-mobile-primary" role="menubar">
              <li role="none">
                <NavLink
                  to="/"
                  end
                  role="menuitem"
                  className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Home
                </NavLink>
              </li>

              <li role="none">
                <button
                  className={`nav-mobile-link nav-mobile-accordion ${productsOpen ? 'open' : ''}`}
                  type="button"
                  aria-expanded={productsOpen}
                  onClick={() => setProductsOpen(v => !v)}
                >
                  <span>Products</span>
                  <span className="nav-chevron" aria-hidden="true">▾</span>
                </button>

                {productsOpen && (
                  <div className="nav-mobile-panel">
                    <div className="nav-mobile-search">
                      <input
                        className="nav-mobile-search-input"
                        type="search"
                        placeholder="Search products..."
                        value={productQuery}
                        onChange={(e) => setProductQuery(e.target.value)}
                        aria-label="Search products"
                      />
                    </div>

                    <div className="nav-mobile-cats">
                      {navData.map(cat => (
                        <div key={cat.slug} className="nav-mobile-cat">
                          <button
                            className={`nav-mobile-cat-btn ${openDropdown === cat.slug ? 'open' : ''}`}
                            type="button"
                            onClick={() => handleDropdownToggle(cat.slug)}
                            aria-expanded={openDropdown === cat.slug}
                          >
                            <span>{cat.name}</span>
                            <span className="nav-chevron" aria-hidden="true">▾</span>
                          </button>

                          {openDropdown === cat.slug && (
                            <div className="nav-mobile-cat-items">
                              {(cat.products || []).length === 0 ? (
                                <div className="nav-mobile-item muted">No products</div>
                              ) : (
                                (cat.products || [])
                                  .filter(p => !productQuery || p.name?.toLowerCase().includes(productQuery.toLowerCase()))
                                  .slice(0, 10)
                                  .map(p => (
                                    <NavLink
                                      key={`${cat.slug}-${p.slug}`}
                                      to={`/products/${cat.slug}/${p.slug}`}
                                      className="nav-mobile-item"
                                      onClick={closeMenu}
                                    >
                                      {p.name}
                                    </NavLink>
                                  ))
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {filteredProducts.length > 0 && (
                      <div className="nav-mobile-hint">
                        Showing {filteredProducts.length} match{filteredProducts.length !== 1 ? 'es' : ''}. Use Catalog for full browsing.
                      </div>
                    )}
                  </div>
                )}
              </li>

              <li role="none">
                <NavLink to="/catalog" role="menuitem" className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                  Catalog
                </NavLink>
              </li>
              <li role="none">
                <NavLink to="/people" role="menuitem" className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                  People
                </NavLink>
              </li>
              <li role="none">
                <NavLink to="/rnd" role="menuitem" className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                  R&D
                </NavLink>
              </li>
              <li role="none">
                <NavLink to="/contact" role="menuitem" className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                  Contact
                </NavLink>
              </li>
            </ul>

            <div className="nav-mobile-footer">
              <Link to="/contact" className="btn btn-accent" onClick={closeMenu} style={{ width: '100%', justifyContent: 'center' }}>
                Get a Quote / Enquiry
              </Link>
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
