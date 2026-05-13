import { useNavigate, useSearch } from '@tanstack/react-router'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const EVENT_TYPES = ['Cumpleaños', 'Casamiento', 'Corporativo', 'Baby shower', 'Quince años', 'Graduación']
const AMENITIES_OPTIONS = ['Estacionamiento', 'Catering', 'Sonido', 'Climatización', 'Wi-Fi', 'Iluminación']

export function SalonFilters() {
  const navigate = useNavigate({ from: '/salones/' })
  const search = useSearch({ from: '/salones/' })

  const minPrice = search.minPrice ?? 0
  const maxPrice = search.maxPrice ?? 200000
  const eventTypes = search.eventTypes ?? []
  const amenities = search.amenities ?? []
  const availability = search.availability

  function setSearch(patch: Record<string, unknown>) {
    navigate({ search: (prev) => ({ ...prev, ...patch }) })
  }

  function toggleArray(key: 'eventTypes' | 'amenities', value: string, current: string[]) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    setSearch({ [key]: next.length ? next : undefined })
  }

  function clearAll() {
    navigate({ search: {} })
  }

  return (
    <aside className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Filtros</h2>
        <Button variant="ghost" size="sm" className="text-primary" onClick={clearAll}>
          Limpiar
        </Button>
      </div>

      {/* Availability */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">Disponibilidad</p>
        <div className="flex items-center gap-2">
          <Checkbox
            id="disponible"
            checked={availability === 'disponible'}
            onCheckedChange={(checked) =>
              setSearch({ availability: checked ? 'disponible' : undefined })
            }
          />
          <Label htmlFor="disponible" className="cursor-pointer text-sm">
            Solo disponibles
          </Label>
        </div>
      </div>

      <Separator />

      {/* Price range */}
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-foreground">Precio por hora</p>
        <Slider
          min={0}
          max={200000}
          step={5000}
          value={[minPrice, maxPrice]}
          onValueChange={([min, max]) => setSearch({ minPrice: min || undefined, maxPrice: max < 200000 ? max : undefined })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{minPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}</span>
          <span>{maxPrice >= 200000 ? 'Sin límite' : maxPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}</span>
        </div>
      </div>

      <Separator />

      {/* Event types */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">Tipo de evento</p>
        {EVENT_TYPES.map((tipo) => (
          <div key={tipo} className="flex items-center gap-2">
            <Checkbox
              id={`et-${tipo}`}
              checked={eventTypes.includes(tipo)}
              onCheckedChange={() => toggleArray('eventTypes', tipo, eventTypes)}
            />
            <Label htmlFor={`et-${tipo}`} className="cursor-pointer text-sm">
              {tipo}
            </Label>
          </div>
        ))}
      </div>

      <Separator />

      {/* Amenities */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">Servicios</p>
        {AMENITIES_OPTIONS.map((amenity) => (
          <div key={amenity} className="flex items-center gap-2">
            <Checkbox
              id={`am-${amenity}`}
              checked={amenities.includes(amenity)}
              onCheckedChange={() => toggleArray('amenities', amenity, amenities)}
            />
            <Label htmlFor={`am-${amenity}`} className="cursor-pointer text-sm">
              {amenity}
            </Label>
          </div>
        ))}
      </div>
    </aside>
  )
}
