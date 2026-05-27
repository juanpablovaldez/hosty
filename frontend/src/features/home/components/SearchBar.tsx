import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, MapPin, CalendarDays, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function SearchBar() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [capacity, setCapacity] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    navigate({
      to: '/salones',
      search: {
        location: location || undefined,
        date: date || undefined,
        capacity: capacity ? Number(capacity) : undefined,
      },
    })
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full flex-col gap-2 rounded-2xl bg-card p-2 shadow-[0_4px_24px_rgba(28,43,58,0.10)] ring-1 ring-border transition-shadow focus-within:shadow-[0_6px_32px_rgba(28,43,58,0.14)] focus-within:ring-primary/30 sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-muted/70 focus-within:bg-muted/50">
        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
        <Input
          placeholder="¿En qué zona?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="hidden h-8 w-px bg-border sm:block" />

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
