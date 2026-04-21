import { useThemeStore } from '@/shared/store/theme.store';
import { Button } from '@/components/ui/button';

export function Header() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="border-b border-border bg-background px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <span className="text-xl font-bold text-primary">hosty</span>
        <Button variant="outline" size="sm" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
        </Button>
      </div>
    </header>
  );
}
