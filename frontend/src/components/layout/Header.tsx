import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import isotipoSrc from '@/logos/isotipo-coral.svg';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between gap-6">

        {/* Logo: isotipo + wordmark */}
        <a href="/" className="flex items-center gap-2 font-extrabold text-[22px] tracking-tight">
          <img src={isotipoSrc} alt="Hosty isotipo" className="w-7 h-7" />
          <span className="text-foreground">hosty</span>
        </a>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium text-muted-foreground">
          <a href="/salones"       className="hover:text-primary transition">Explorar salones</a>
          <a href="/como-funciona" className="hover:text-primary transition">Cómo funciona</a>
          <a href="/para-hosts"    className="hover:text-primary transition">Para Hosts</a>
          <a href="/ayuda"         className="hover:text-primary transition">Ayuda</a>
        </nav>

        {/* Acciones desktop */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/salones"
            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition"
            aria-label="Buscar salones"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </a>
          <a href="/login" className="inline-flex items-center text-[14px] font-semibold text-foreground hover:text-primary border border-border rounded-xl px-4 py-2 transition hover:bg-muted">
            Ingresar
          </a>
          <a href="/registro" className="inline-flex items-center text-[14px] font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl px-4 py-2 transition">
            Publicá tu salón
          </a>
        </div>

        {/* Botón mobile */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menú mobile */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-5 py-4 md:hidden flex flex-col gap-4">
          <a href="/salones"       className="text-sm font-medium text-muted-foreground hover:text-primary">Explorar salones</a>
          <a href="/como-funciona" className="text-sm font-medium text-muted-foreground hover:text-primary">Cómo funciona</a>
          <a href="/para-hosts"    className="text-sm font-medium text-muted-foreground hover:text-primary">Para Hosts</a>
          <a href="/ayuda"         className="text-sm font-medium text-muted-foreground hover:text-primary">Ayuda</a>
          <hr className="border-border" />
          <a href="/login"    className="text-center text-sm font-semibold border border-border rounded-xl px-4 py-2.5 text-foreground hover:bg-muted transition">Ingresar</a>
          <a href="/registro" className="text-center text-sm font-semibold bg-primary text-primary-foreground rounded-xl px-4 py-2.5 hover:bg-primary/90 transition">Publicá tu salón</a>
        </div>
      )}
    </header>
  );
}
