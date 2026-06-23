export interface GeocodeResult {
  lat: number
  lon: number
  displayName: string
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

export async function geocodeAddress(query: string): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    limit: '1',
    countrycodes: 'ar',
  })

  const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    headers: { 'Accept-Language': 'es' },
  })
  if (!res.ok) throw new Error('Geocoding request failed')

  const data = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>
  if (data.length === 0) return null

  const first = data[0]
  return { lat: Number(first.lat), lon: Number(first.lon), displayName: first.display_name }
}
