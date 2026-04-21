import { useEffect } from 'react';
import { Outlet } from '@tanstack/react-router';
import { useThemeStore } from '@/shared/store/theme.store';
import { Header } from './Header';
import { Footer } from './Footer';

export function RootLayout() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
