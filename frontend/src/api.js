// Central API utility — all fetch calls live here so base URL is one place.
const BASE = '/api'

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
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
}
