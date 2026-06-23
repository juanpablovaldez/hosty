import { Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useThemeStore } from '@/shared/store/theme.store'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { signOut } from '@/features/auth/lib/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Moon, Sun, Menu, LogOut, User, Heart, LayoutDashboard, ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { HostyLogo } from './HostyLogo'

const ROUTER_LINKS = [
  { to: '/' as const, label: 'Inicio' },
  { to: '/salones' as const, label: 'Salones' },
  { to: '/mis-reservas' as const, label: 'Mis Reservas' },
]

const navLinkBase = [
  'relative pb-0.5 text-[14px] font-semibold transition-colors duration-[180ms]',
  'after:absolute after:bottom-[-2px] after:left-0 after:right-0',
  'after:h-[1.5px] after:bg-primary',
  'after:transition-transform after:duration-[220ms] after:origin-left',
].join(' ')

export function Header() {
  const { theme, toggleTheme } = useThemeStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  async function handleSignOut() {
    await signOut()
    navigate({ to: '/' })
  }

  return (
    <header className="sticky top-0 z-[100] border-b border-border bg-background/94 backdrop-blur-lg relative">
      {/* Línea coral 2.5px — tope del header (handoff §2a) */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-primary" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <HostyLogo size="md" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-[34px] md:flex">
          {ROUTER_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                navLinkBase,
                pathname === to
                  ? 'text-foreground after:scale-x-100'
                  : 'text-muted-foreground after:scale-x-0 hover:text-foreground hover:after:scale-x-100',
              )}
            >
              {label}
            </Link>
          ))}
          <a
            href="/#como-funciona"
            onClick={(e) => {
              const el = document.getElementById('como-funciona')
              if (el) {
                e.preventDefault()
                el.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className={cn(
              navLinkBase,
              'text-muted-foreground after:scale-x-0 hover:text-foreground hover:after:scale-x-100',
            )}
          >
            Cómo funciona
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
          >
            {theme === 'light'
              ? <Moon className="h-5 w-5" strokeWidth={1.5} />
              : <Sun className="h-5 w-5" strokeWidth={1.5} />}
          </Button>

          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex items-center gap-1.5 text-[14px] font-semibold max-w-[180px] focus-visible:ring-0"
                  >
                    <User className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    <span className="truncate">{user.email}</span>
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 p-2">
                  <DropdownMenuItem asChild>
                    <Link to="/mi-perfil" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" strokeWidth={1.5} />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/mis-favoritos" className="flex items-center gap-2 cursor-pointer">
                      <Heart className="h-4 w-4" strokeWidth={1.5} />
                      Mis Favoritos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/host/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} />
                      Mi Panel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => void handleSignOut()}
                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.5} />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button asChild size="sm" className="hidden md:flex font-semibold" style={{ boxShadow: '0 2px 10px rgba(232,69,42,.28)' }}>
                <Link to="/host/create">Publicar salón</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden md:flex text-[14px] font-semibold">
                <Link to="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild size="sm" className="hidden md:flex font-semibold" style={{ boxShadow: '0 2px 10px rgba(232,69,42,.28)' }}>
                <Link to="/login">Publicar salón</Link>
              </Button>
            </>
          )}

          {/* Mobile burger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left">
                  <HostyLogo size="md" />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1">
                {ROUTER_LINKS.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted',
                      pathname === to ? 'bg-primary/10 text-primary' : 'text-foreground',
                    )}
                  >
                    {label}
                  </Link>
                ))}
                {user && (
                  <Link
                    to="/host/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted',
                      pathname.startsWith('/host') ? 'bg-primary/10 text-primary' : 'text-foreground',
                    )}
                  >
                    Panel
                  </Link>
                )}
                <a
                  href="/#como-funciona"
                  onClick={(e) => {
                    setMobileOpen(false)
                    const el = document.getElementById('como-funciona')
                    if (el) {
                      e.preventDefault()
                      el.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Cómo funciona
                </a>
                <div className="mt-4 flex flex-col gap-2">
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5">
                        <User className="h-4 w-4 flex-shrink-0 text-muted-foreground" strokeWidth={1.5} />
                        <span className="truncate text-sm text-foreground">{user.email}</span>
                      </div>
                      <Link
                        to="/mi-perfil"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                      >
                        <User className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        Mi Perfil
                      </Link>
                      <Link
                        to="/mis-favoritos"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                      >
                        <Heart className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        Mis Favoritos
                      </Link>
                      <Link
                        to="/host/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                      >
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                        Mi Panel de Host
                      </Link>
                      <Button asChild variant="outline" className="w-full font-semibold" onClick={() => setMobileOpen(false)}>
                        <Link to="/host/create">Publicar mi salón</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => { setMobileOpen(false); void handleSignOut() }}
                      >
                        <LogOut className="h-4 w-4" strokeWidth={1.5} />
                        Cerrar sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full font-semibold" onClick={() => setMobileOpen(false)}>
                        <Link to="/login">Iniciar sesión</Link>
                      </Button>
                      <Button asChild className="w-full font-semibold" onClick={() => setMobileOpen(false)}>
                        <Link to="/login">Publicar mi salón</Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
