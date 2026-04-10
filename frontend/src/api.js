// Central API utility — all fetch calls live here so base URL is one place.
const BASE = '/api'

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

async function send(path, { method = 'POST', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['X-Admin-Token'] = token
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body == null ? undefined : JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

async function upload(path, { token, formData } = {}) {
  const headers = {}
  if (token) headers['X-Admin-Token'] = token
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  nav:           ()                               => get('/nav'),
  carousel:      ()                               => get('/carousel'),
  people:        ()                               => get('/people'),
  videos:        ()                               => get('/videos'),
  product:       (categorySlug, productSlug)      => get(`/products/${categorySlug}/${productSlug}`),
  health:        ()                               => get('/health'),

  admin: {
    categories:   (token)                          => send('/admin/categories', { method: 'GET', token }),
    products:     ({ token, categoryId } = {})     => {
      const qs = categoryId ? `?category_id=${encodeURIComponent(categoryId)}` : ''
      return send(`/admin/products${qs}`, { method: 'GET', token })
    },
    createProduct: ({ token, ...body })            => send('/admin/products', { method: 'POST', token, body }),
    updateProduct: ({ token, id, ...body })        => send(`/admin/products/${id}`, { method: 'PUT', token, body }),
    deleteProduct: ({ token, id })                 => send(`/admin/products/${id}`, { method: 'DELETE', token }),

    uploadMedia: ({ token, categoryId, file })     => {
      const formData = new FormData()
      formData.append('category_id', String(categoryId))
      formData.append('file', file)
      return upload('/admin/upload', { token, formData })
    },

    uploadPersonMedia: ({ token, group, file })    => {
      const formData = new FormData()
      formData.append('group', String(group))
      formData.append('file', file)
      return upload('/admin/upload-person', { token, formData })
    },

    migrateUnifiedProducts: ({ token })            => send('/admin/migrate/unified-products', { method: 'POST', token, body: {} }),

    listPeople:   ({ token, group })               => send(`/admin/people/${group}`, { method: 'GET', token }),
    createPerson: ({ token, group, ...body })      => send(`/admin/people/${group}`, { method: 'POST', token, body }),
    updatePerson: ({ token, group, id, ...body })  => send(`/admin/people/${group}/${id}`, { method: 'PUT', token, body }),
    deletePerson: ({ token, group, id })           => send(`/admin/people/${group}/${id}`, { method: 'DELETE', token }),
  },
}
