import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../api'
import Loader from '../components/Loader'

const emptyAttrRow = () => ({ key: '', value: '' })

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function Portal() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '')
  const [tab, setTab] = useState('products')

  const [categories, setCategories] = useState([])
  const [catId, setCatId] = useState('')

  const [loadingCats, setLoadingCats] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [products, setProducts] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const [prodName, setProdName] = useState('')
  const [prodBrand, setProdBrand] = useState('')
  const [prodSlug, setProdSlug] = useState('')
  const [prodImage, setProdImage] = useState('')
  const [prodDesc, setProdDesc] = useState('')
  const [prodAttrsRows, setProdAttrsRows] = useState([emptyAttrRow()])
  const [prodPartImages, setProdPartImages] = useState([])
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingPart, setUploadingPart] = useState(false)
  const mainFileRef = useRef(null)
  const partFileRef = useRef(null)
  const [dragMain, setDragMain] = useState(false)
  const [dragPart, setDragPart] = useState(false)

  const [peopleGroup, setPeopleGroup] = useState('directors')
  const [people, setPeople] = useState([])
  const [loadingPeople, setLoadingPeople] = useState(false)
  const [personId, setPersonId] = useState(null)
  const [personName, setPersonName] = useState('')
  const [personPosition, setPersonPosition] = useState('')
  const [personBio, setPersonBio] = useState('')
  const [personImage, setPersonImage] = useState('')
  const [uploadingPerson, setUploadingPerson] = useState(false)
  const personFileRef = useRef(null)
  const [dragPerson, setDragPerson] = useState(false)

  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    localStorage.setItem('admin_token', token)
  }, [token])

  useEffect(() => {
    setLoadingCats(true)
    api.admin.categories(token)
      .then((cats) => {
        const next = cats || []
        setCategories(next)
        setCatId((prev) => prev || String((next?.[0]?.id) || ''))
      })
      .catch(async () => {
        // Fallback: categories are public; use nav endpoint if admin call is blocked.
        try {
          const nav = await api.nav()
          const next = (nav || []).map(c => ({ id: c.id, name: c.name, slug: c.slug }))
          setCategories(next)
          setCatId((prev) => prev || String((next?.[0]?.id) || ''))
          setError('')
        } catch (e2) {
          setError(e2.message || 'Failed to load categories')
          setCategories([])
          setCatId('')
        }
      })
      .finally(() => setLoadingCats(false))
  }, [token])

  const catOptions = useMemo(
    () => categories.map(c => ({ id: String(c.id), label: `${c.name} (${c.slug})` })),
    [categories]
  )

  const loadProducts = () => {
    if (!catId) return
    setLoadingProducts(true)
    setError('')
    api.admin.products({ token, categoryId: catId })
      .then(setProducts)
      .catch((e) => setError(e.message || 'Failed to load products'))
      .finally(() => setLoadingProducts(false))
  }

  useEffect(() => {
    if (tab !== 'products') return
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, catId, token])

  const resetProductForm = () => {
    setSelectedId(null)
    setProdName('')
    setProdBrand('')
    setProdSlug('')
    setProdImage('')
    setProdDesc('')
    setProdAttrsRows([emptyAttrRow()])
    setProdPartImages([])
  }

  const fillProductForm = (p) => {
    setSelectedId(p.id)
    setProdName(p.name || '')
    setProdBrand(p.brand || '')
    setProdSlug(p.slug || '')
    setProdImage(p.image || '')
    setProdDesc(p.description || '')
    const attrs = p.attributes || {}
    const rows = Object.entries(attrs).map(([k, v]) => ({ key: String(k || ''), value: String(v ?? '') }))
    setProdAttrsRows(rows.length ? rows : [emptyAttrRow()])
    setProdPartImages(p.part_images || [])
  }

  // Auto-generate slug from name. If editing an existing product, keep the saved
  // slug stable unless the user clears it (backend can also regenerate).
  useEffect(() => {
    if (selectedId) return
    setProdSlug(slugify(prodName))
  }, [prodName, selectedId])

  const saveProduct = async () => {
    setNotice('')
    setError('')
    const attributes = {}
    for (const row of (prodAttrsRows || [])) {
      const k = String(row?.key || '').trim()
      const v = String(row?.value || '').trim()
      if (!k || !v) continue
      attributes[k] = v
    }

    const partImages = (prodPartImages || []).map(s => String(s || '').trim()).filter(Boolean)

    const body = {
      category_id: Number(catId),
      name: prodName,
      brand: prodBrand,
      slug: prodSlug,
      image: prodImage,
      description: prodDesc,
      attributes,
      part_images: partImages,
    }

    try {
      if (selectedId) {
        await api.admin.updateProduct({ token, id: selectedId, ...body })
        setNotice('Product updated.')
      } else {
        await api.admin.createProduct({ token, ...body })
        setNotice('Product created.')
      }
      resetProductForm()
      loadProducts()
    } catch (e) {
      setError(e.message || 'Failed to save product')
    }
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    setNotice('')
    setError('')
    try {
      await api.admin.deleteProduct({ token, id })
      setNotice('Product deleted.')
      if (selectedId === id) resetProductForm()
      loadProducts()
    } catch (e) {
      setError(e.message || 'Failed to delete product')
    }
  }

  const uploadMainImage = async (file) => {
    if (!file || !catId) return
    setUploadingMain(true)
    setNotice('')
    setError('')
    try {
      const res = await api.admin.uploadMedia({ token, categoryId: Number(catId), file })
      setProdImage(res.path || '')
      setNotice('Main image uploaded.')
    } catch (e) {
      setError(e.message || 'Failed to upload image')
    } finally {
      setUploadingMain(false)
    }
  }

  const ImgThumb = ({ src, alt, size = 72, ratio = 1 }) => {
    const [broken, setBroken] = useState(false)
    const w = size
    const h = Math.round(size / ratio)
    if (!src || broken) {
      return (
        <div
          aria-label="No image"
          style={{
            width: w,
            height: h,
            borderRadius: 14,
            border: '1px dashed rgba(255,255,255,0.16)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02))',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
          }}
        >
          No preview
        </div>
      )
    }
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setBroken(true)}
        style={{
          width: w,
          height: h,
          objectFit: 'cover',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
          background: 'rgba(255,255,255,0.02)',
        }}
      />
    )
  }

  const uploadPartImages = async (files) => {
    const list = Array.from(files || [])
    if (!list.length || !catId) return
    setUploadingPart(true)
    setNotice('')
    setError('')
    try {
      const uploaded = []
      for (const f of list) {
        const res = await api.admin.uploadMedia({ token, categoryId: Number(catId), file: f })
        if (res?.path) uploaded.push(res.path)
      }
      if (uploaded.length) {
        setProdPartImages((prev) => [...(prev || []), ...uploaded])
        setNotice(`Uploaded ${uploaded.length} part image${uploaded.length === 1 ? '' : 's'}.`)
      }
    } catch (e) {
      setError(e.message || 'Failed to upload part images')
    } finally {
      setUploadingPart(false)
    }
  }

  const uploadPersonImage = async (file) => {
    if (!file) return
    setUploadingPerson(true)
    setNotice('')
    setError('')
    try {
      const res = await api.admin.uploadPersonMedia({ token, group: peopleGroup, file })
      setPersonImage(res.path || '')
      setNotice('Person image uploaded.')
    } catch (e) {
      setError(e.message || 'Failed to upload image')
    } finally {
      setUploadingPerson(false)
    }
  }

  const loadPeople = () => {
    setLoadingPeople(true)
    setError('')
    api.admin.listPeople({ token, group: peopleGroup })
      .then((rows) => setPeople(rows || []))
      .catch((e) => setError(e.message || 'Failed to load people'))
      .finally(() => setLoadingPeople(false))
  }

  useEffect(() => {
    if (tab !== 'people') return
    loadPeople()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, peopleGroup, token])

  const resetPersonForm = () => {
    setPersonId(null)
    setPersonName('')
    setPersonPosition('')
    setPersonBio('')
    setPersonImage('')
  }

  const fillPersonForm = (p) => {
    setPersonId(p.id)
    setPersonName(p.name || '')
    setPersonPosition(p.position || '')
    setPersonBio(p.bio || '')
    setPersonImage(p.image || '')
  }

  const savePerson = async () => {
    setNotice('')
    setError('')
    const body = { name: personName, position: personPosition, bio: personBio, image: personImage }
    try {
      if (personId) {
        await api.admin.updatePerson({ token, group: peopleGroup, id: personId, ...body })
        setNotice('Person updated.')
      } else {
        await api.admin.createPerson({ token, group: peopleGroup, ...body })
        setNotice('Person created.')
      }
      resetPersonForm()
      loadPeople()
    } catch (e) {
      setError(e.message || 'Failed to save person')
    }
  }

  const deletePerson = async (id) => {
    if (!confirm('Delete this person?')) return
    setNotice('')
    setError('')
    try {
      await api.admin.deletePerson({ token, group: peopleGroup, id })
      setNotice('Person deleted.')
      if (personId === id) resetPersonForm()
      loadPeople()
    } catch (e) {
      setError(e.message || 'Failed to delete person')
    }
  }

  const runMigration = async () => {
    setNotice('')
    setError('')
    try {
      const res = await api.admin.migrateUnifiedProducts({ token })
      setNotice(`Migration complete. Created ${res.created}, skipped ${res.skipped}.`)
    } catch (e) {
      setError(e.message || 'Migration failed')
    }
  }

  return (
    <main className="page-wrapper" id="main-content">
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-tag">Admin</div>
          <h1 className="page-hero-title">Depel <span className="text-green">Portal</span></h1>
          <p className="page-hero-subtitle">
            Add and manage products + people.
          </p>
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          <div className="card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'grid', gap: 'var(--space-sm)', gridTemplateColumns: '1fr' }}>
              <label className="form-label" htmlFor="admin-token">Admin token (optional)</label>
              <input
                id="admin-token"
                className="form-input"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Set ADMIN_TOKEN in backend to require this"
              />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                If your backend has `ADMIN_TOKEN` set, you must paste the same value here.
              </div>
            </div>
          </div>

          <div role="tablist" aria-label="Portal sections" style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-lg)' }}>
            <button className={`category-pill ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')} role="tab" aria-selected={tab === 'products'}>
              Products
            </button>
            <button className={`category-pill ${tab === 'people' ? 'active' : ''}`} onClick={() => setTab('people')} role="tab" aria-selected={tab === 'people'}>
              People
            </button>
            <button className={`category-pill ${tab === 'migration' ? 'active' : ''}`} onClick={() => setTab('migration')} role="tab" aria-selected={tab === 'migration'}>
              Migration
            </button>
          </div>

          {(notice || error) && (
            <div className="card" style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', border: error ? '1px solid rgba(255, 0, 0, 0.25)' : '1px solid rgba(45, 106, 79, 0.25)' }}>
              {notice && <div style={{ color: 'var(--text)', fontWeight: 600 }}>{notice}</div>}
              {error && <div style={{ color: 'var(--text)', fontWeight: 600 }}>Error: {error}</div>}
            </div>
          )}

          {tab === 'products' && (
            <div className="grid-2" style={{ alignItems: 'start' }}>
              <div className="card" style={{ padding: 'var(--space-lg)' }}>
                <h3 style={{ marginBottom: 'var(--space-md)' }}>{selectedId ? `Edit product #${selectedId}` : 'Create product'}</h3>

                {loadingCats ? <Loader text="Loading categories..." /> : (
                  <>
                    <label className="form-label" htmlFor="prod-cat">Category</label>
                    <select
                      id="prod-cat"
                      className="form-input"
                      value={catId}
                      onChange={(e) => setCatId(e.target.value)}
                      disabled={catOptions.length === 0}
                    >
                      {catOptions.length === 0
                        ? <option value="">No categories available</option>
                        : catOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)
                      }
                    </select>
                    {catOptions.length === 0 && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>
                        If you set `ADMIN_TOKEN` on the backend, make sure you paste the same token above.
                      </div>
                    )}
                  </>
                )}

                <div style={{ height: 12 }} />
                <label className="form-label" htmlFor="prod-name">Name</label>
                <input id="prod-name" className="form-input" value={prodName} onChange={(e) => setProdName(e.target.value)} />

                <div style={{ height: 12 }} />
                <label className="form-label" htmlFor="prod-brand">Brand</label>
                <input id="prod-brand" className="form-input" value={prodBrand} onChange={(e) => setProdBrand(e.target.value)} />

                <div style={{ height: 12 }} />
                <label className="form-label" htmlFor="prod-slug">Slug (auto)</label>
                <input id="prod-slug" className="form-input" value={prodSlug} readOnly />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>
                  Generated from the name. If you change the name, this updates automatically for new products.
                </div>

                <div style={{ height: 12 }} />
                <label className="form-label" htmlFor="prod-image">Main image path/URL</label>
                <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: 'var(--space-md)',
                      alignItems: 'center',
                      padding: 'var(--space-md)',
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <ImgThumb src={prodImage} alt="Main product image preview" size={88} ratio={1} />
                    <div style={{ minWidth: 0 }}>
                      <input id="prod-image" className="form-input" value={prodImage} readOnly placeholder="Upload an image to generate this" />
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>
                        This is the image shown on cards/details.
                      </div>
                    </div>
                  </div>
                  <input
                    ref={mainFileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => uploadMainImage(e.target.files?.[0])}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => (uploadingMain || loadingCats) ? null : mainFileRef.current?.click()}
                    onKeyDown={(e) => {
                      if (uploadingMain || loadingCats) return
                      if (e.key === 'Enter' || e.key === ' ') mainFileRef.current?.click()
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!(uploadingMain || loadingCats)) setDragMain(true)
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!(uploadingMain || loadingCats)) setDragMain(true)
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDragMain(false)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDragMain(false)
                      if (uploadingMain || loadingCats) return
                      const f = e.dataTransfer?.files?.[0]
                      uploadMainImage(f)
                    }}
                    style={{
                      borderRadius: 18,
                      border: dragMain ? '1px solid rgba(74, 222, 128, 0.45)' : '1px solid rgba(255,255,255,0.10)',
                      background: dragMain
                        ? 'linear-gradient(180deg, rgba(74, 222, 128, 0.12), rgba(255,255,255,0.02))'
                        : 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                      padding: 'var(--space-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--space-md)',
                      cursor: (uploadingMain || loadingCats) ? 'not-allowed' : 'pointer',
                      opacity: (uploadingMain || loadingCats) ? 0.7 : 1,
                      userSelect: 'none',
                    }}
                    aria-disabled={uploadingMain || loadingCats}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700 }}>Upload main image</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Drag & drop, or click to browse.
                      </div>
                    </div>
                    <div
                      className="btn btn-primary"
                      style={{
                        pointerEvents: 'none',
                        padding: '10px 14px',
                        borderRadius: 999,
                      }}
                    >
                      {uploadingMain ? 'Uploading…' : 'Browse'}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {uploadingMain ? 'Uploading…' : 'Uploads into media/<category>/ and saves the /media/... path.'}
                  </div>
                </div>

                <div style={{ height: 12 }} />
                <label className="form-label" htmlFor="prod-desc">Description</label>
                <textarea id="prod-desc" className="form-input" rows={4} value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} />

                <div style={{ height: 12 }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-sm)' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Attributes</label>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => setProdAttrsRows((rows) => [...(rows || []), emptyAttrRow()])}
                  >
                    Add attribute
                  </button>
                </div>

                <div style={{ display: 'grid', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                  {(prodAttrsRows || []).map((row, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr auto',
                        gap: 'var(--space-sm)',
                        alignItems: 'center',
                      }}
                    >
                      <input
                        className="form-input"
                        value={row.key}
                        onChange={(e) => setProdAttrsRows((rows) => (rows || []).map((r, i) => (i === idx ? { ...r, key: e.target.value } : r)))}
                        placeholder="Label (e.g. Power)"
                        aria-label={`Attribute label ${idx + 1}`}
                      />
                      <input
                        className="form-input"
                        value={row.value}
                        onChange={(e) => setProdAttrsRows((rows) => (rows || []).map((r, i) => (i === idx ? { ...r, value: e.target.value } : r)))}
                        placeholder="Value (e.g. 8 HP)"
                        aria-label={`Attribute value ${idx + 1}`}
                      />
                      <button
                        className="btn"
                        type="button"
                        onClick={() => setProdAttrsRows((rows) => {
                          const next = (rows || []).filter((_, i) => i !== idx)
                          return next.length ? next : [emptyAttrRow()]
                        })}
                        aria-label={`Remove attribute ${idx + 1}`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ height: 12 }} />
                <label className="form-label">Part images (optional)</label>
                <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                  <input
                    ref={partFileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => uploadPartImages(e.target.files)}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => (uploadingPart || loadingCats) ? null : partFileRef.current?.click()}
                    onKeyDown={(e) => {
                      if (uploadingPart || loadingCats) return
                      if (e.key === 'Enter' || e.key === ' ') partFileRef.current?.click()
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!(uploadingPart || loadingCats)) setDragPart(true)
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!(uploadingPart || loadingCats)) setDragPart(true)
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDragPart(false)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDragPart(false)
                      if (uploadingPart || loadingCats) return
                      uploadPartImages(e.dataTransfer?.files)
                    }}
                    style={{
                      borderRadius: 18,
                      border: dragPart ? '1px solid rgba(74, 222, 128, 0.45)' : '1px solid rgba(255,255,255,0.10)',
                      background: dragPart
                        ? 'linear-gradient(180deg, rgba(74, 222, 128, 0.10), rgba(255,255,255,0.02))'
                        : 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                      padding: 'var(--space-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--space-md)',
                      cursor: (uploadingPart || loadingCats) ? 'not-allowed' : 'pointer',
                      opacity: (uploadingPart || loadingCats) ? 0.7 : 1,
                      userSelect: 'none',
                    }}
                    aria-disabled={uploadingPart || loadingCats}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700 }}>Upload part images</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Optional extra angles. Drag & drop multiple, or click to browse.
                      </div>
                    </div>
                    <div
                      className="btn"
                      style={{
                        pointerEvents: 'none',
                        padding: '10px 14px',
                        borderRadius: 999,
                      }}
                    >
                      {uploadingPart ? 'Uploading…' : 'Browse'}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {uploadingPart ? 'Uploading…' : 'Optional extra angles. You can upload multiple.'}
                  </div>

                  {(prodPartImages || []).length > 0 && (
                    <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                          gap: 'var(--space-md)',
                        }}
                      >
                        {(prodPartImages || []).map((p, idx) => (
                          <div
                            key={`${p}-${idx}`}
                            style={{
                              position: 'relative',
                              padding: 'var(--space-sm)',
                              borderRadius: 18,
                              border: '1px solid rgba(255,255,255,0.08)',
                              background: 'rgba(255,255,255,0.02)',
                              display: 'grid',
                              gap: 'var(--space-xs)',
                              justifyItems: 'center',
                            }}
                          >
                            <button
                              type="button"
                              className="btn"
                              onClick={() => setProdPartImages((prev) => (prev || []).filter((_, i) => i !== idx))}
                              aria-label={`Remove part image ${idx + 1}`}
                              style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                padding: '6px 10px',
                                borderRadius: 999,
                                lineHeight: 1,
                                background: 'rgba(0,0,0,0.35)',
                                border: '1px solid rgba(255,255,255,0.14)',
                              }}
                            >
                              ×
                            </button>
                            <ImgThumb src={p} alt={`Part image ${idx + 1} preview`} size={96} ratio={1} />
                            <div
                              title={p}
                              style={{
                                fontSize: '0.78rem',
                                color: 'var(--text-muted)',
                                width: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'center',
                                padding: '0 4px',
                              }}
                            >
                              {p}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="btn" type="button" onClick={() => setProdPartImages([])}>
                        Clear all part images
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" type="button" onClick={saveProduct}>
                    {selectedId ? 'Update product' : 'Create product'}
                  </button>
                  <button className="btn" type="button" onClick={resetProductForm}>
                    Clear
                  </button>
                  <button className="btn" type="button" onClick={loadProducts}>
                    Refresh list
                  </button>
                </div>
              </div>

              <div className="card" style={{ padding: 'var(--space-lg)' }}>
                <h3 style={{ marginBottom: 'var(--space-md)' }}>Products in selected category</h3>
                {loadingProducts ? <Loader text="Loading products..." /> : (
                  products?.length ? (
                    <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                      {products.map(p => (
                        <div key={p.id} className="card" style={{ padding: 'var(--space-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-sm)' }}>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.slug}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                              <button className="btn" type="button" onClick={() => fillProductForm(p)}>Edit</button>
                              <button className="btn" type="button" onClick={() => deleteProduct(p.id)}>Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <h3>No products yet</h3>
                      <p>Add the first one using the form.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {tab === 'people' && (
            <div className="grid-2" style={{ alignItems: 'start' }}>
              <div className="card" style={{ padding: 'var(--space-lg)' }}>
                <h3 style={{ marginBottom: 'var(--space-md)' }}>{personId ? `Edit person #${personId}` : 'Add person'}</h3>

                <label className="form-label" htmlFor="people-group">Group</label>
                <select id="people-group" className="form-input" value={peopleGroup} onChange={(e) => setPeopleGroup(e.target.value)}>
                  <option value="directors">Board of Directors</option>
                  <option value="management">Management Team</option>
                  <option value="employees">Employees</option>
                </select>

                <div style={{ height: 12 }} />
                <label className="form-label" htmlFor="person-name">Name</label>
                <input id="person-name" className="form-input" value={personName} onChange={(e) => setPersonName(e.target.value)} />

                <div style={{ height: 12 }} />
                <label className="form-label" htmlFor="person-position">Position</label>
                <input id="person-position" className="form-input" value={personPosition} onChange={(e) => setPersonPosition(e.target.value)} />

                <div style={{ height: 12 }} />
                <label className="form-label" htmlFor="person-image">Profile image</label>
                <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: 'var(--space-md)',
                      alignItems: 'center',
                      padding: 'var(--space-md)',
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <ImgThumb src={personImage} alt="Person image preview" size={88} ratio={1} />
                    <div style={{ minWidth: 0 }}>
                      <input id="person-image" className="form-input" value={personImage} readOnly placeholder="Upload an image to generate this" />
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>
                        Saved to media/people/{peopleGroup}/.
                      </div>
                    </div>
                  </div>

                  <input
                    ref={personFileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => uploadPersonImage(e.target.files?.[0])}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => uploadingPerson ? null : personFileRef.current?.click()}
                    onKeyDown={(e) => {
                      if (uploadingPerson) return
                      if (e.key === 'Enter' || e.key === ' ') personFileRef.current?.click()
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!uploadingPerson) setDragPerson(true)
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!uploadingPerson) setDragPerson(true)
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDragPerson(false)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDragPerson(false)
                      if (uploadingPerson) return
                      uploadPersonImage(e.dataTransfer?.files?.[0])
                    }}
                    style={{
                      borderRadius: 18,
                      border: dragPerson ? '1px solid rgba(74, 222, 128, 0.45)' : '1px solid rgba(255,255,255,0.10)',
                      background: dragPerson
                        ? 'linear-gradient(180deg, rgba(74, 222, 128, 0.10), rgba(255,255,255,0.02))'
                        : 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                      padding: 'var(--space-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--space-md)',
                      cursor: uploadingPerson ? 'not-allowed' : 'pointer',
                      opacity: uploadingPerson ? 0.7 : 1,
                      userSelect: 'none',
                    }}
                    aria-disabled={uploadingPerson}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700 }}>Upload profile image</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Drag & drop, or click to browse.
                      </div>
                    </div>
                    <div
                      className="btn"
                      style={{
                        pointerEvents: 'none',
                        padding: '10px 14px',
                        borderRadius: 999,
                      }}
                    >
                      {uploadingPerson ? 'Uploading…' : 'Browse'}
                    </div>
                  </div>
                </div>

                <div style={{ height: 12 }} />
                <label className="form-label" htmlFor="person-bio">Bio</label>
                <textarea id="person-bio" className="form-input" rows={6} value={personBio} onChange={(e) => setPersonBio(e.target.value)} />

                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" type="button" onClick={savePerson}>
                    {personId ? 'Update person' : 'Create person'}
                  </button>
                  <button className="btn" type="button" onClick={resetPersonForm}>Clear</button>
                  <button className="btn" type="button" onClick={loadPeople}>Refresh list</button>
                </div>
              </div>

              <div className="card" style={{ padding: 'var(--space-lg)' }}>
                <h3 style={{ marginBottom: 'var(--space-md)' }}>People</h3>
                {loadingPeople ? <Loader text="Loading people..." /> : (
                  people?.length ? (
                    <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                      {people.map(p => (
                        <div key={p.id} className="card" style={{ padding: 'var(--space-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-sm)' }}>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.position}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                              <button className="btn" type="button" onClick={() => fillPersonForm(p)}>Edit</button>
                              <button className="btn" type="button" onClick={() => deletePerson(p.id)}>Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <h3>No records yet</h3>
                      <p>Add the first one using the form.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {tab === 'migration' && (
            <div className="card" style={{ padding: 'var(--space-lg)' }}>
              <h3 style={{ marginBottom: 'var(--space-sm)' }}>Migrate legacy products → unified table</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
                This copies products from the existing per-category tables into the unified `products` table used by the portal.
                It won’t delete the old records.
              </p>
              <button className="btn btn-primary" type="button" onClick={runMigration}>
                Run migration
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

