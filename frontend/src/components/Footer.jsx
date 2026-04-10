import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-brand">
            <Link to="/" className="nav-logo" style={{ marginBottom: 'var(--space-md)', display: 'inline-flex' }}>
              <div className="nav-logo-mark">D</div>
              <span className="nav-logo-text">De<span>pel</span></span>
            </Link>
            <p>
              Bhutan's trusted supplier of quality agricultural machinery — helping farmers
              work smarter across fields, hills, and valleys.
            </p>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h4>Navigate</h4>
            <Link to="/"        className="footer-link">Home</Link>
            <Link to="/catalog" className="footer-link">Catalog</Link>
            <Link to="/people"  className="footer-link">Our People</Link>
            <Link to="/rnd"     className="footer-link">R&D</Link>
            <Link to="/contact" className="footer-link">Contact Us</Link>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Categories</h4>
            <Link to="/catalog" className="footer-link">Mini Tillers</Link>
            <Link to="/catalog" className="footer-link">Milling Machines</Link>
            <Link to="/catalog" className="footer-link">Harvesting</Link>
            <Link to="/catalog" className="footer-link">Irrigation</Link>
            <Link to="/catalog" className="footer-link">Threshing</Link>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact</h4>
            <span className="footer-link">Thimphu, Bhutan</span>
            <a href="mailto:info@depel.bt" className="footer-link">info@depel.bt</a>
            <a href="tel:+97517123456"     className="footer-link">+975 17 123 456</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {year} Depel Agricultural Machinery. All rights reserved.</span>
          <span>Built with Go + React</span>
        </div>
      </div>
    </footer>
  )
}
