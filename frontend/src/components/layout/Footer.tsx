import { Link } from '@tanstack/react-router'
import { HostyLogo } from './HostyLogo'

const LINKS = {
  Plataforma: [
    { label: 'Buscar salones', to: '/salones' },
    { label: 'Publicar mi salón', to: '/' },
  ],
  Compañía: [
    { label: 'Sobre Hosty', to: '/' },
    { label: 'Contacto', to: '/' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <HostyLogo size="sm" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              El marketplace de salones para eventos en Tucumán. Reservá con confianza.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <ul className="flex flex-col gap-2">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Hosty. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
