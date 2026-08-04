import { defineConfig, configDefaults } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [
    TanStackRouterVite({ routesDirectory: 'src/routes', generatedRouteTree: 'src/routeTree.gen.ts' }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/@tanstack')) {
            return 'vendor-router'
          }
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-ui'
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: [...configDefaults.exclude, 'src/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/e2e/**',
        'src/test/**',
        'src/routeTree.gen.ts',
        'src/shared/lib/database.types.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
      // Umbrales acotados a los módulos críticos que ya están bien probados: el cálculo del
      // precio de una reserva y el ciclo de vida de una reserva (crear, cancelar, listar). No se
      // fija un umbral sobre carpetas todavía sin cubrir (host.queries, la mayor parte de
      // host.mutations, los filtros de salones) porque un umbral ahí fallaría contra la realidad
      // en vez de proteger una regresión real — ver la Tabla 32b de 12-Testing-y-Calidad.md para
      // el desglose completo por carpeta.
      thresholds: {
        'src/features/bookings/lib/**': { statements: 90, branches: 80, functions: 90, lines: 90 },
        'src/features/bookings/api/**': { statements: 90, branches: 70, functions: 90, lines: 90 },
        'src/features/favorites/api/**': { statements: 90, branches: 80, functions: 90, lines: 90 },
        'src/features/auth/lib/**': { statements: 85, branches: 90, functions: 80, lines: 85 },
      },
    },
  },
})
