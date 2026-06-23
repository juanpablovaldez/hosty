import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { geocodeAddress } from '@/features/salones/lib/geocoding'

const TUCUMAN_CENTER: [number, number] = [-26.8285, -65.2226]
const SEARCH_ZOOM = 17

const pinIcon = L.divIcon({
  className: 'salon-location-pin',
  html: `<svg width="28" height="36" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))"><path d="M12 0C5.37 0 0 5.37 0 12c0 8.5 12 20 12 20s12-11.5 12-20C24 5.37 18.63 0 12 0z" fill="hsl(var(--primary))"/><circle cx="12" cy="12" r="4.5" fill="hsl(var(--card))"/></svg>`,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
})

type LatLng = { lat: number; lng: number }
type MapView = { center: [number, number]; zoom: number }

function ApplyView({ view }: { view: MapView }) {
  const map = useMap()
  useEffect(() => {
    map.setView(view.center, view.zoom)
  }, [map, view])
  return null
}

function DraggableMarker({ value, onChange }: { value: LatLng; onChange: (v: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return (
    <Marker
      position={[value.lat, value.lng]}
      icon={pinIcon}
      draggable
      eventHandlers={{
        dragend(e) {
          const { lat, lng } = (e.target as L.Marker).getLatLng()
          onChange({ lat, lng })
        },
      }}
    />
  )
}

interface LocationPickerProps {
  address: string
  zona: string
  value: { latitude: number | null; longitude: number | null }
  onChange: (coords: { latitude: number; longitude: number }) => void
}

export function LocationPicker({ address, zona, value, onChange }: LocationPickerProps) {
  const [searching, setSearching] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const hasCoords = value.latitude != null && value.longitude != null
  const current: LatLng = hasCoords
    ? { lat: value.latitude as number, lng: value.longitude as number }
    : { lat: TUCUMAN_CENTER[0], lng: TUCUMAN_CENTER[1] }

  // El view se actualiza solo al buscar (no al arrastrar), para no reiniciar el zoom mientras el host ajusta el pin.
  const [view, setView] = useState<MapView>(
    hasCoords ? { center: [current.lat, current.lng], zoom: SEARCH_ZOOM } : { center: TUCUMAN_CENTER, zoom: 12 },
  )

  async function handleSearch() {
    const query = [address, zona, 'Tucumán', 'Argentina'].filter(Boolean).join(', ')
    setSearching(true)
    setNotFound(false)
    try {
      const result = await geocodeAddress(query)
      if (result) {
        onChange({ latitude: result.lat, longitude: result.lon })
        setView({ center: [result.lat, result.lon], zoom: SEARCH_ZOOM })
      } else {
        setNotFound(true)
      }
    } catch {
      setNotFound(true)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Buscá la dirección y <strong className="font-medium text-foreground">arrastrá el pin hasta la altura exacta</strong>. El
          buscador deja el pin sobre la calle; el número final lo ajustás vos.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSearch}
          disabled={searching || address.trim().length < 5}
          className="gap-1.5 shrink-0"
        >
          {searching ? (
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
          ) : (
            <Search className="w-4 h-4" strokeWidth={1.5} />
          )}
          Buscar en el mapa
        </Button>
      </div>

      <div className="relative z-0 h-64 rounded-xl overflow-hidden border border-border">
        <MapContainer
          center={view.center}
          zoom={view.zoom}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ApplyView view={view} />
          <DraggableMarker
            value={current}
            onChange={(v) => onChange({ latitude: v.lat, longitude: v.lng })}
          />
        </MapContainer>
      </div>

      {notFound ? (
        <p className="text-xs text-amber-600">
          No encontramos esa dirección automáticamente. Arrastrá el pin a la ubicación correcta.
        </p>
      ) : !hasCoords ? (
        <p className="text-xs text-muted-foreground">
          Todavía sin ubicación. Tocá “Buscar en el mapa” o arrastrá el pin para ubicar el salón.
        </p>
      ) : null}
    </div>
  )
}
