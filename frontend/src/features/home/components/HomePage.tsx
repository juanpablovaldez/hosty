import { useState } from 'react'
import { SearchBar } from './SearchBar'
import { FeaturedSalones } from './FeaturedSalones'
import { ValueProps } from './ValueProps'
import { HostCTA } from './HostCTA'

const CHIPS = ['Todos', '🎂 Cumpleaños', '💍 Casamientos', '🎓 Graduaciones', '🏢 Corporativo', '👶 Infantiles']

export function HomePage() {
  const [chipActivo, setChipActivo] = useState('Todos')

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-background">
        {/* Mancha coral decorativa — solo visible en modo claro */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full dark:opacity-0 transition-opacity"
          style={{ background: 'radial-gradient(circle, rgba(232,69,42,0.10) 0%, transparent 70%)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/3 w-[360px] h-[360px] rounded-full dark:opacity-0 transition-opacity"
          style={{ background: 'radial-gradient(circle, rgba(232,69,42,0.06) 0%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-10 lg:pt-16 pb-10 lg:pb-20 grid lg:grid-cols-[1.15fr_1fr] gap-10 items-center">

          {/* Columna izquierda */}
          <div>
            {/* Badge ámbar */}
            <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/50 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              TUCUMÁN · 2026
            </span>

            {/* Título */}
            <h1 className="mt-4 text-[32px] sm:text-[44px] lg:text-[68px] leading-[0.95] font-extrabold text-foreground tracking-tight">
              Celebrá cerca<span className="text-primary">.</span>
            </h1>

            <p className="mt-5 text-[17px] lg:text-[18px] leading-relaxed text-muted-foreground max-w-xl">
              Encontrá el salón perfecto para tu próximo evento. Filtrá por zona, capacidad y
              presupuesto, y reservá en minutos — sin llamadas ni idas y vueltas.
            </p>

            {/* SearchBar funcional — navega a /salones con parámetros reales */}
            <div className="mt-8">
              <SearchBar />
            </div>

            {/* Chips de tipo de evento */}
            <div className="mt-6 flex flex-wrap gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setChipActivo(chip)}
                  aria-pressed={chipActivo === chip}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[14px] font-medium transition cursor-pointer ${
                    chipActivo === chip
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-card text-foreground border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-[13px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong className="text-foreground">+120</strong> salones verificados</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Confirmación en <strong className="text-foreground">menos de 24h</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zM5 21h14a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
                <span>Precios claros, <strong className="text-foreground">sin sorpresas</strong></span>
              </div>
            </div>
          </div>

          {/* Columna derecha — visual hero */}
          <div className="relative hidden lg:block">
            <div
              className="rounded-[28px] aspect-[4/5] relative overflow-hidden shadow-[0_4px_12px_rgba(28,43,58,0.08),0_16px_40px_-16px_rgba(28,43,58,0.18)]"
              style={{ background: 'linear-gradient(135deg, #FCE3DC 0%, #F1ECE4 100%)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
              <div className="absolute top-5 left-5">
                <span className="bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  Nuevo en Hosty
                </span>
              </div>
              {/* Mini card inferior */}
              <div className="absolute bottom-5 left-5 right-5 bg-card border border-border rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div
                    className="w-14 h-14 rounded-xl flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #FCEAC4 0%, #F5A623 100%)' }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[15px] truncate text-foreground">Salón Los Jazmines</h3>
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-[12px] text-muted-foreground">Yerba Buena · hasta 180 personas</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-[12px]">
                        <span className="text-amber-400">★</span>
                        <span className="font-semibold text-foreground">4.9</span>
                        <span className="text-muted-foreground">(42)</span>
                      </div>
                      <span className="text-[13px] font-bold text-foreground">desde $ 85.000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating card "Reserva confirmada" */}
            <div className="absolute -left-6 top-10 bg-card rounded-2xl shadow-[0_4px_12px_rgba(28,43,58,0.08)] border border-border p-4 w-56 hidden xl:block">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="font-semibold text-[13px] text-foreground">Reserva confirmada</span>
              </div>
              <p className="text-[12px] text-muted-foreground">15 · Mayo · 2026 — 21:00 hs</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIONES DE DEV (datos reales de Supabase) ─── */}
      <ValueProps />
      <FeaturedSalones />
      <HostCTA />
    </>
  )
}
