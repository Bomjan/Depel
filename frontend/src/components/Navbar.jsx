import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [navData, setNavData]       = useState([])
  const [openDropdown, setOpenDropdown] = useState(null)
  const navigate = useNavigate()

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
    setMenuOpen(false)
    setOpenDropdown(null)
  }, [navigate])

  const handleDropdownToggle = (slug) => {
    setOpenDropdown(prev => prev === slug ? null : slug)
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="container nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo" aria-label="Depel home">
          <div className="nav-logo-mark">D</div>
          <span className="nav-logo-text">De<span>pel</span></span>
        </Link>

        {/* Desktop links */}
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`} role="menubar">
          <li role="none">
            <NavLink
              to="/"
              end
              role="menuitem"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
          </li>

          {/* Products mega-dropdown per category */}
          {navData.map(cat => (
            <li
              key={cat.slug}
              role="none"
              className={`nav-dropdown ${openDropdown === cat.slug ? 'open' : ''}`}
            >
              <button
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={openDropdown === cat.slug}
                className="nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => handleDropdownToggle(cat.slug)}
                id={`nav-cat-${cat.slug}`}
              >
                {cat.name} ▾
              </button>
              <div className="nav-dropdown-menu" role="menu" aria-labelledby={`nav-cat-${cat.slug}`}>
                <div className="nav-dropdown-header">{cat.name}</div>
                {cat.products.length === 0 && (
                  <span className="nav-dropdown-item" style={{ color: 'var(--text-muted)' }}>No products</span>
                )}
                {cat.products.map(p => (
                  <NavLink
                    key={p.slug}
                    to={`/products/${cat.slug}/${p.slug}`}
                    role="menuitem"
                    className="nav-dropdown-item"
                    onClick={() => { setMenuOpen(false); setOpenDropdown(null) }}
                  >
                    {p.name}
                  </NavLink>
                ))}
              </div>
            </li>
          ))}

          <li role="none">
            <NavLink to="/catalog" role="menuitem" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              Catalog
            </NavLink>
          </li>
          <li role="none">
            <NavLink to="/people" role="menuitem" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              People
            </NavLink>
          </li>
          <li role="none">
            <NavLink to="/rnd" role="menuitem" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              R&D
            </NavLink>
          </li>
          <li role="none">
            <NavLink to="/contact" role="menuitem" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen(o => !o)}
          id="nav-toggle-btn"
        >
          <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0)' : 'none' }} />
          <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>
    </nav>
  )
}
