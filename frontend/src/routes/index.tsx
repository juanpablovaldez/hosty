import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Hosty</h1>
      <p className="text-muted-foreground">Find and book the perfect venue.</p>
    </main>
  )
}
