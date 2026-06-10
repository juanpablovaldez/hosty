/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { UserCircle, Eye, EyeOff } from 'lucide-react'
import { useState, useId } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { formError } from '@/shared/lib/utils'
import { requireAuth } from '@/features/auth/lib/auth'

export const Route = createFileRoute('/mi-perfil')({
  beforeLoad: ({ location }) => requireAuth(location),
  component: MiPerfilPage,
})

const schema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .or(z.literal('')), // campo opcional: vacío = no cambiar
})

function MiPerfilPage() {
  const { user } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const passwordId = useId()

  const form = useForm({
    defaultValues: {
      nombre: (user?.user_metadata?.full_name as string | undefined) ?? '',
      password: '',
    },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      // TODO: conectar con Supabase updateUser cuando esté disponible
      console.log('Guardando perfil:', { nombre: value.nombre })
      toast.success('Perfil actualizado correctamente')
    },
  })

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Mi perfil</h1>

      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-1">
            <UserCircle className="h-6 w-6 text-primary" strokeWidth={1.5} />
          </div>
          <CardTitle className="text-xl">Datos de la cuenta</CardTitle>
          <CardDescription>
            {user?.email ?? 'Actualizá tu nombre y contraseña'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void form.handleSubmit()
            }}
            className="flex flex-col gap-5"
          >
            {/* Campo: Nombre */}
            <form.Field name="nombre">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    type="text"
                    autoComplete="name"
                    placeholder="Tu nombre completo"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {formError(field.state.meta.errors[0]) && (
                    <p className="text-xs text-destructive">
                      {formError(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Campo: Contraseña */}
            <form.Field name="password">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={passwordId}>Nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id={passwordId}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Dejá vacío para no cambiarla"
                      className="pr-10"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword
                        ? <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                        : <Eye className="h-4 w-4" strokeWidth={1.5} />}
                    </button>
                  </div>
                  {formError(field.state.meta.errors[0]) && (
                    <p className="text-xs text-destructive">
                      {formError(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Submit */}
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  type="submit"
                  className="w-full font-semibold"
                  disabled={isSubmitting}
                  style={{ boxShadow: '0 2px 10px rgba(232,69,42,.28)' }}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
