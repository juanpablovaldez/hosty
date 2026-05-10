import { useThemeStore } from '@/shared/store/theme.store';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '20px',          /* separado de la barra de scroll */
        zIndex: 9999,
        width: '52px',
        height: '52px',
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        backgroundColor: isDark ? '#FAF8F5' : '#1C2B3A',
        color:           isDark ? '#1C2B3A' : '#FAF8F5',
        boxShadow: '-4px 4px 20px rgba(0,0,0,0.22)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(-6px) scale(1.08)';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '-6px 6px 24px rgba(0,0,0,0.28)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = '';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '-4px 4px 20px rgba(0,0,0,0.22)';
      }}
    >
      {isDark ? (
        /* Sol — estás en oscuro, click → claro */
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        /* Luna — estás en claro, click → oscuro */
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      )}
    </button>
  );
}
