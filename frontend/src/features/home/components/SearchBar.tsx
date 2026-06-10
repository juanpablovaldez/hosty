import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, MapPin, CalendarDays, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ZONAS_TUCUMAN } from '@/features/salones/constants'

export function SearchBar() {
  const navigate = useNavigate()
  const [zona, setZona] = useState('')
  const [date, setDate] = useState('')
  const [capacity, setCapacity] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    navigate({
      to: '/salones',
      search: {
        zonas: zona ? [zona] : undefined,
        capacidadMin: capacity ? Number(capacity) : undefined,
      },
    })
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full flex-col gap-2 rounded-2xl bg-card p-2 shadow-[0_4px_24px_rgba(28,43,58,0.10)] ring-1 ring-border transition-shadow focus-within:shadow-[0_6px_32px_rgba(28,43,58,0.14)] focus-within:ring-primary/30 sm:flex-row sm:items-center"
    >
      {/* Zona — selector de localidades */}
      <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-muted/70 focus-within:bg-muted/50">
        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
        <select
          value={zona}
          onChange={(e) => setZona(e.target.value)}
          className="w-full border-0 bg-transparent p-0 text-sm text-foreground focus:outline-none focus:ring-0 appearance-none cursor-pointer"
        >
          <option value="">¿En qué zona?</option>
          {ZONAS_TUCUMAN.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>

      <div className="hidden h-8 w-px bg-border sm:block" />

      {/* Fecha */}
      <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-muted/70 focus-within:bg-muted/50">
        <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="hidden h-8 w-px bg-border sm:block" />

      {/* Capacidad */}
      <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-muted/70 focus-within:bg-muted/50">
        <Users className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
        <Input
          type="number"
          min={1}
          placeholder="¿Cuántos invitados?"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
        />
      </div>

      <Button type="submit" size="lg" className="w-full shrink-0 gap-2 rounded-xl font-semibold sm:w-auto">
        <Search className="h-4 w-4" strokeWidth={1.5} />
        Buscar
      </Button>
    </form>
  )
}
