import { useState, useEffect } from 'react'
import { api } from '../api'
import Loader from '../components/Loader'

const FALLBACK = '/placeholder.svg'

function videoSrc(path) {
  if (!path) return null
  return path.startsWith('http') ? path : `/media/${path}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function RnD() {
  const [videos, setVideos]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.videos()
      .then(setVideos)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="page-wrapper" id="main-content">
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-tag">Research and Development</div>
          <h1 className="page-hero-title">R&amp;D <span className="text-green">Progress</span></h1>
          <p className="page-hero-subtitle">
            Watch our latest field tests, demonstrations, and machinery trials across Bhutan.
          </p>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          {loading ? (
            <Loader text="Loading videos..." />
          ) : videos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">&#127909;</div>
              <h3>No videos yet</h3>
              <p>Check back soon for R&D demonstrations and field trials.</p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
                {videos.length} video{videos.length !== 1 ? 's' : ''} available
              </p>
              <div className="grid-3 stagger-grid">
                {videos.map(v => (
                  <article key={v.id} className="video-card" id={`video-${v.id}`}>
                    <div className="video-wrap">
                      {videoSrc(v.video) ? (
                        <video
                          controls
                          preload="metadata"
                          aria-label={v.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        >
                          <source src={videoSrc(v.video)} />
                          Your browser does not support the video element.
                        </video>
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          color: 'var(--text-muted)',
                          fontSize: '2rem',
                        }}>
                          &#127909;
                        </div>
                      )}
                    </div>
                    <div className="video-body">
                      <div className="video-title">{v.title}</div>
                      {v.description && (
                        <p className="video-desc">{v.description}</p>
                      )}
                      <div style={{ marginTop: 'var(--space-sm)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {formatDate(v.uploaded_at)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
