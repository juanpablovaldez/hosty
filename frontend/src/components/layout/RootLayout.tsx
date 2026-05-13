import { Outlet } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import { Header } from './Header'
import { Footer } from './Footer'

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  )
}
