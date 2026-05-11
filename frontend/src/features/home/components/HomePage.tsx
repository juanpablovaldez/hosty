import { useState } from 'react';

const CHIPS = ['Todos', '🎂 Cumpleaños', '💍 Casamientos', '🎓 Graduaciones', '🏢 Corporativo', '👶 Infantiles'];

export function HomePage() {
  const [chipActivo, setChipActivo] = useState('Todos');

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
              TUCUMÁN · ABRIL 2026
            </span>

            {/* Título */}
            <h1 className="mt-4 text-[44px] lg:text-[68px] leading-[0.95] font-extrabold text-foreground tracking-tight">
              Celebrá cerca<span className="text-primary">.</span>
            </h1>

            <p className="mt-5 text-[17px] lg:text-[18px] leading-relaxed text-muted-foreground max-w-xl">
              Encontrá el salón perfecto para tu próximo evento. Filtrá por zona, capacidad y
              presupuesto, y reservá en minutos — sin llamadas ni idas y vueltas.
            </p>

            {/* Buscador tipo card */}
            <div className="mt-8 bg-card rounded-2xl shadow-[0_1px_3px_rgba(28,43,58,0.06),0_8px_24px_-12px_rgba(28,43,58,0.12)] dark:shadow-none p-3 lg:p-4 grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_auto] gap-2 border border-border">

              {/* Dónde */}
              <div className="p-2 md:p-3 md:border-r md:border-border">
                <span className="block text-[13px] font-semibold text-muted-foreground mb-1 tracking-wide">¿Dónde?</span>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="text-[15px] font-medium text-foreground">San Miguel de Tucumán</span>
                </div>
              </div>

              {/* Fecha */}
              <div className="p-2 md:p-3 md:border-r md:border-border">
                <span className="block text-[13px] font-semibold text-muted-foreground mb-1 tracking-wide">Fecha</span>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span className="text-[15px] text-muted-foreground">Elegí una fecha</span>
                </div>
              </div>

              {/* Invitados */}
              <div className="p-2 md:p-3">
                <span className="block text-[13px] font-semibold text-muted-foreground mb-1 tracking-wide">Invitados</span>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  <span className="text-[15px] text-muted-foreground">50 personas</span>
                </div>
              </div>

              {/* Botón buscar */}
              <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-5 py-3 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Buscar
              </button>
            </div>

            {/* Chips de tipo de evento */}
            <div className="mt-6 flex flex-wrap gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setChipActivo(chip)}
                  aria-pressed={chipActivo === chip}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[14px] font-medium transition cursor-pointer
                    ${chipActivo === chip
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
                  <div className="w-14 h-14 rounded-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #FCEAC4 0%, #F5A623 100%)' }} />
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

      {/* ── SALONES DESTACADOS ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wider text-primary mb-2">Destacados</p>
            <h2 className="text-[32px] lg:text-[40px] font-bold tracking-tight text-foreground">Salones para cada ocasión</h2>
            <p className="text-muted-foreground mt-2">Elegidos por nuestra comunidad. Verificados uno por uno.</p>
          </div>
          <a href="/salones" className="hidden md:inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:text-primary/80 transition" aria-label="Ver todos los salones">
            Ver todos
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { nombre: 'Salón Los Jazmines',    zona: 'Yerba Buena', tipos: 'Casamientos · Cumpleaños', capacidad: 180, precio: 85000, rating: 4.9, reviews: 42 },
            { nombre: 'El Quincho del Norte',  zona: 'San Miguel',  tipos: 'Corporativo · Graduaciones', capacidad: 120, precio: 60000, rating: 4.7, reviews: 28 },
            { nombre: 'Villa Serrana',          zona: 'Tafí Viejo',  tipos: 'Infantiles · Cumpleaños', capacidad: 80, precio: 45000, rating: 4.8, reviews: 19 },
          ].map((salon) => (
            <article key={salon.nombre} className="group cursor-pointer">
              {/* Imagen placeholder */}
              <div
                className="rounded-[20px] aspect-[4/3] relative shadow-sm group-hover:shadow-md transition mb-4 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #FCE3DC 0%, #F1ECE4 100%)' }}
              >
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">Top</span>
                  <span className="bg-green-50 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verificado
                  </span>
                </div>
                <button type="button" aria-label={`Guardar ${salon.nombre} en favoritos`} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition">
                  <svg className="w-5 h-5 text-foreground/70" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[13px] text-muted-foreground mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {salon.zona}
                  </div>
                  <h3 className="font-bold text-[17px] text-foreground leading-tight truncate">{salon.nombre}</h3>
                  <p className="text-[13px] text-muted-foreground mt-0.5">{salon.tipos} · hasta {salon.capacidad} pers.</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-amber-400 text-[15px]">★</span>
                  <span className="font-bold text-[14px] text-foreground">{salon.rating}</span>
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <span className="text-[12px] text-muted-foreground">desde</span>
                  <span className="font-bold text-[18px] text-foreground ml-1">$ {salon.precio.toLocaleString('es-AR')}</span>
                  <span className="text-[12px] text-muted-foreground"> / evento</span>
                </div>
                <span className="text-[13px] text-primary font-semibold">Disponible</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
