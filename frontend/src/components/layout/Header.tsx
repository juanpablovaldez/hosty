import { Link, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import { useThemeStore } from '@/shared/store/theme.store'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Moon, Sun, Menu } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/salones', label: 'Salones' },
] as const

export function Header() {
  const { theme, toggleTheme } = useThemeStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
          <span className="text-2xl font-extrabold tracking-tight text-primary">hosty</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === to ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Cambiar tema">
            {theme === 'light'
              ? <Moon className="h-5 w-5" strokeWidth={1.5} />
              : <Sun className="h-5 w-5" strokeWidth={1.5} />}
          </Button>

          <Button size="sm" className="hidden md:flex">
            Publicar salón
          </Button>

          {/* Mobile burger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menú">
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left text-2xl font-extrabold text-primary">hosty</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted',
                      pathname === to ? 'bg-primary/10 text-primary' : 'text-foreground',
                    )}
                  >
                    {label}
                  </Link>
                ))}
                <div className="mt-4">
                  <Button className="w-full">Publicar mi salón</Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
