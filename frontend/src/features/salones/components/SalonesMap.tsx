import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Link } from '@tanstack/react-router'
import { Star, Users } from 'lucide-react'
import type { Salon } from '../types'
import { salonPriceDisplay } from '../lib/pricing'

const TUCUMAN_CENTER: [number, number] = [-26.8285, -65.2226]

type GeolocatedSalon = Salon & { latitude: number; longitude: number }

function hasCoords(salon: Salon): salon is GeolocatedSalon {
  return salon.latitude != null && salon.longitude != null
}

function priceMarkerIcon(label: string) {
  const pin = `<svg width="22" height="29" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0 auto;filter:drop-shadow(0 2px 3px rgba(0,0,0,.3))"><path d="M12 0C5.37 0 0 5.37 0 12c0 8.5 12 20 12 20s12-11.5 12-20C24 5.37 18.63 0 12 0z" fill="hsl(var(--primary))"/><circle cx="12" cy="12" r="4.5" fill="hsl(var(--card))"/></svg>`
  const price = `<div style="position:absolute;top:31px;left:50%;transform:translateX(-50%);white-space:nowrap;background:hsl(var(--card));color:hsl(var(--card-foreground));border:1px solid hsl(var(--border));font-weight:700;font-size:10px;line-height:1;padding:3px 7px;border-radius:9999px;box-shadow:0 1px 4px rgba(0,0,0,.2)">${label}</div>`
  return L.divIcon({
    className: 'salon-price-marker',
    html: `<div style="position:relative;transform:translate(-50%,-100%)">${pin}${price}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

function FitToMarkers({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView(points[0], 14)
      return
    }
    map.fitBounds(points, { padding: [48, 48] })
  }, [map, points])
  return null
}

interface SalonesMapProps {
  salones: Salon[]
}

export function SalonesMap({ salones }: SalonesMapProps) {
  const geolocated = useMemo(() => salones.filter(hasCoords), [salones])
  const points = useMemo<[number, number][]>(
    () => geolocated.map((s) => [s.latitude, s.longitude]),
    [geolocated],
  )

  if (geolocated.length === 0) {
    return (
      <div className="h-[600px] rounded-xl border border-border bg-muted flex items-center justify-center text-center px-6">
        <div>
          <p className="text-[16px] font-semibold text-foreground mb-1">Sin salones para mostrar en el mapa</p>
          <p className="text-[14px] text-muted-foreground">
            Los salones que coinciden con tu búsqueda todavía no tienen ubicación geográfica.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative z-0 h-[600px] rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={TUCUMAN_CENTER}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToMarkers points={points} />
        {geolocated.map((salon) => {
          const price = salonPriceDisplay(salon)
          return (
            <Marker
              key={salon.id}
              position={[salon.latitude, salon.longitude]}
              icon={priceMarkerIcon(price.main)}
            >
              <Popup>
                <Link
                  to="/salones/$id"
                  params={{ id: salon.id }}
                  className="block w-[220px] no-underline text-foreground"
                >
                  {salon.images[0] && (
                    <img
                      src={salon.images[0]}
                      alt={salon.name}
                      loading="lazy"
                      className="w-full h-[110px] object-cover rounded-lg mb-2"
                    />
                  )}
                  <p className="font-bold text-[15px] leading-tight mb-1">{salon.name}</p>
                  <p className="text-[13px] text-muted-foreground mb-1">{salon.location}</p>
                  <div className="flex items-center gap-3 text-[12px] text-muted-foreground mb-2">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                      {salon.capacity}
                    </span>
                    {salon.rating != null && (
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" strokeWidth={1.5} />
                        {salon.rating.value.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <span className="text-[14px] font-bold text-primary">
                    {price.main}
                    {price.suffix && <span className="text-[12px] font-medium"> {price.suffix}</span>}
                  </span>
                </Link>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
