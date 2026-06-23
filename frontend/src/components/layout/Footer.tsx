import { Link } from '@tanstack/react-router'
import { HostyLogo } from './HostyLogo'
import { useAuthStore } from '@/features/auth/store/auth.store'

export function Footer() {
  const { user } = useAuthStore()

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

          {/* Plataforma */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground">Plataforma</p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  to="/salones"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Buscar salones
                </Link>
              </li>
              <li>
                <Link
                  to={user ? '/host/create' : '/login'}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Publicar mi salón
                </Link>
              </li>
            </ul>
          </div>

          {/* Compañía */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground">Compañía</p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="/#como-funciona"
                  onClick={(e) => {
                    const el = document.getElementById('como-funciona')
                    if (el) {
                      e.preventDefault()
                      el.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Sobre Hosty
                </a>
              </li>
              <li>
                <a
                  href="mailto:hola@hosty.com.ar"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Hosty. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
