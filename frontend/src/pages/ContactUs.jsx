import { useState } from 'react'

function validate(fields) {
  const errors = {}
  if (!fields.name.trim())    errors.name    = 'Full name is required.'
  if (!fields.email.trim())   errors.email   = 'Email address is required.'
  else if (!/\S+@\S+\.\S+/.test(fields.email)) errors.email = 'Enter a valid email address.'
  if (!fields.subject.trim()) errors.subject = 'Subject is required.'
  if (!fields.message.trim()) errors.message = 'Message cannot be empty.'
  return errors
}

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' }

export default function ContactUs() {
  const [fields, setFields]   = useState(EMPTY)
  const [errors, setErrors]   = useState({})
  const [success, setSuccess] = useState(false)
  const [sending, setSending] = useState(false)

  const handle = (e) => {
    const { name, value } = e.target
    setFields(f => ({ ...f, [name]: value }))
    // Clear error as user types
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  const submit = (e) => {
    e.preventDefault()
    const errs = validate(fields)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSending(true)
    // Simulate a small delay — real email sending can be wired here
    setTimeout(() => {
      setSending(false)
      setSuccess(true)
      setFields(EMPTY)
    }, 1200)
  }

  return (
    <main className="page-wrapper" id="main-content">
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-tag">Get in Touch</div>
          <h1 className="page-hero-title">Contact <span className="text-green">Us</span></h1>
          <p className="page-hero-subtitle">
            Have a question about a product, need a quote, or want support? We're here to help.
          </p>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          <div className="contact-wrap">
            {/* Info column */}
            <div className="contact-info">
              <h2>Let's talk <span className="text-green">machinery</span></h2>
              <p>
                Whether you're looking to purchase your first tiller or scale up your harvesting operation,
                our team provides honest advice and reliable after-sales support.
              </p>

              <div className="contact-detail">
                <div className="contact-detail-icon">&#128205;</div>
                <div className="contact-detail-text">
                  <strong>Address</strong>
                  <span>Thimphu, Bhutan</span>
                </div>
              </div>

              <div className="contact-detail">
                <div className="contact-detail-icon">&#128222;</div>
                <div className="contact-detail-text">
                  <strong>Phone</strong>
                  <span>+975 17 123 456</span>
                </div>
              </div>

              <div className="contact-detail">
                <div className="contact-detail-icon">&#9993;</div>
                <div className="contact-detail-text">
                  <strong>Email</strong>
                  <span>info@depel.bt</span>
                </div>
              </div>

              <div className="contact-detail">
                <div className="contact-detail-icon">&#128336;</div>
                <div className="contact-detail-text">
                  <strong>Office Hours</strong>
                  <span>Mon – Fri, 9 AM – 5 PM</span>
                </div>
              </div>
            </div>

            {/* Form card */}
            <div className="form-card">
              <h3 style={{ marginBottom: 'var(--space-xl)' }}>Send us a message</h3>

              {success && (
                <div className="form-success" role="alert" id="form-success-msg">
                  Thank you! Your message has been received. We'll be in touch shortly.
                </div>
              )}

              <form onSubmit={submit} noValidate aria-label="Contact form" id="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name" className="form-label">Full Name *</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      value={fields.name}
                      onChange={handle}
                      placeholder="Tenzin Wangchuk"
                      autoComplete="name"
                    />
                    {errors.name && <div className="form-error-msg" role="alert">{errors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-email" className="form-label">Email Address *</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      value={fields.email}
                      onChange={handle}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    {errors.email && <div className="form-error-msg" role="alert">{errors.email}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-phone" className="form-label">Phone (optional)</label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      className="form-input"
                      value={fields.phone}
                      onChange={handle}
                      placeholder="+975 17 ..."
                      autoComplete="tel"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-subject" className="form-label">Subject *</label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      className={`form-input ${errors.subject ? 'error' : ''}`}
                      value={fields.subject}
                      onChange={handle}
                      placeholder="Product enquiry..."
                    />
                    {errors.subject && <div className="form-error-msg" role="alert">{errors.subject}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label">Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className={`form-textarea ${errors.message ? 'error' : ''}`}
                    value={fields.message}
                    onChange={handle}
                    placeholder="Tell us what you're looking for..."
                    rows={6}
                  />
                  {errors.message && <div className="form-error-msg" role="alert">{errors.message}</div>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sending}
                  id="contact-submit-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
