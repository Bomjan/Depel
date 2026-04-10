import { BrowserRouter, Routes, Route, ScrollRestoration } from 'react-router-dom'
import Navbar    from './components/Navbar'
import Footer    from './components/Footer'
import MobileDock from './components/MobileDock'
import Home      from './pages/Home'
import Catalog   from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import People    from './pages/People'
import Info      from './pages/Info'
import RnD       from './pages/RnD'
import ContactUs from './pages/ContactUs'
import Portal    from './pages/Portal'

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - var(--nav-height))' }}>
        {children}
      </div>
      <MobileDock />
      <Footer />
    </>
  )
}

// 404 page kept inline since it's trivial
function NotFound() {
  return (
    <main className="page-wrapper">
      <div className="container section empty-state">
        <div className="empty-state-icon" style={{ fontSize: '4rem', opacity: 0.3 }}>404</div>
        <h2 style={{ marginBottom: 'var(--space-sm)' }}>Page not found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/" className="btn btn-primary" style={{ marginTop: 'var(--space-xl)' }}>Go Home</a>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"                                   element={<Home />} />
          <Route path="/catalog"                            element={<Catalog />} />
          <Route path="/products/:category_slug/:product_slug" element={<ProductDetail />} />
          <Route path="/people"                             element={<People />} />
          <Route path="/info"                               element={<Info />} />
          <Route path="/rnd"                                element={<RnD />} />
          <Route path="/contact"                            element={<ContactUs />} />
          <Route path="/portal"                             element={<Portal />} />
          <Route path="*"                                   element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
