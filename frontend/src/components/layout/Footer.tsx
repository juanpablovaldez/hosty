export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-4">
      <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Hosty. Todos los derechos reservados.
      </div>
    </footer>
  );
}
