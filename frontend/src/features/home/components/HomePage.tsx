import { SearchBar } from './SearchBar'
import { ValueProps } from './ValueProps'
import { FeaturedSalones } from './FeaturedSalones'
import { HostCTA } from './HostCTA'

export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[540px] flex-col items-center justify-center overflow-hidden bg-foreground px-6 py-20 text-center md:min-h-[600px]">
        {/* Subtle texture overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)]" />

        <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
          <div className="rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary">
            🎉 Tucumán tiene su marketplace de salones
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Encontrá el salón perfecto{' '}
            <span className="text-primary">para tu evento</span>
          </h1>

          <p className="max-w-xl text-lg text-primary-foreground/70 md:text-xl">
            Cientos de espacios verificados en Tucumán. Reservá en minutos, sin llamadas ni sorpresas.
          </p>

          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>

          <p className="text-sm text-primary-foreground/50">
            Más de 50 salones listos para tu próxima celebración
          </p>
        </div>
      </section>

      <ValueProps />
      <FeaturedSalones />
      <HostCTA />
    </div>
  )
}
