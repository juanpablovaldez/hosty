/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, CalendarDays, ShieldCheck } from 'lucide-react'
import { useState, useId } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { formError } from '@/shared/lib/utils'
import { requireAuth } from '@/features/auth/lib/auth'
import { supabase } from '@/shared/lib/supabase'

export const Route = createFileRoute('/mi-perfil')({
  beforeLoad: ({ location }) => requireAuth(location),
  component: MiPerfilPage,
})

const infoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
})

const securitySchema = z
  .object({
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmar: z.string(),
  })
  .refine((v) => v.password === v.confirmar, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar'],
  })

function getInitials(name: string | undefined, email: string | undefined): string {
  if (name?.trim()) {
    return name.trim().split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  }
  return (email ?? '?')[0].toUpperCase()
}

function formatDate(iso: string | undefined): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })
}

function MiPerfilPage() {
  const { user } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const passwordId = useId()
  const confirmId = useId()

  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? ''
  const initials = getInitials(fullName, user?.email)
  const memberSince = formatDate(user?.created_at)

  const infoForm = useForm({
    defaultValues: { nombre: fullName },
    validators: { onSubmit: infoSchema },
    onSubmit: async ({ value }) => {
      const { error } = await supabase.auth.updateUser({ data: { full_name: value.nombre } })
      if (error) toast.error('No se pudo guardar. Intentá de nuevo.')
      else toast.success('Nombre actualizado')
    },
  })

  const securityForm = useForm({
    defaultValues: { password: '', confirmar: '' },
    validators: { onSubmit: securitySchema },
    onSubmit: async ({ value }) => {
      const { error } = await supabase.auth.updateUser({ password: value.password })
      if (error) toast.error('No se pudo cambiar la contraseña.')
      else {
        toast.success('Contraseña actualizada')
        securityForm.reset()
      }
    },
  })

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 lg:px-0">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Mi perfil</h1>

      {/* Avatar + info */}
      <div className="mb-8 flex items-center gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-foreground">
            {fullName || 'Sin nombre'}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
              {user?.email}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
              Miembro desde {memberSince}
            </span>
          </div>
        </div>
      </div>

      <Separator className="mb-8" />

      <div className="flex flex-col gap-6">
        {/* Información personal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información personal</CardTitle>
            <CardDescription>Actualizá tu nombre visible en la plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void infoForm.handleSubmit() }}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email-readonly">Correo electrónico</Label>
                <Input
                  id="email-readonly"
                  type="email"
                  value={user?.email ?? ''}
                  readOnly
                  className="bg-muted text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">El email no se puede cambiar.</p>
              </div>

              <infoForm.Field name="nombre">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="nombre">Nombre completo</Label>
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
                      <p className="text-xs text-destructive">{formError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </infoForm.Field>

              <infoForm.Subscribe selector={(s) => s.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    className="w-full font-semibold"
                    disabled={isSubmitting}
                    style={{ boxShadow: '0 2px 10px rgba(232,69,42,.28)' }}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar nombre'}
                  </Button>
                )}
              </infoForm.Subscribe>
            </form>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <CardTitle className="text-base">Seguridad</CardTitle>
            </div>
            <CardDescription>Cambiá tu contraseña de acceso.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void securityForm.handleSubmit() }}
              className="flex flex-col gap-5"
            >
              <securityForm.Field name="password">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={passwordId}>Nueva contraseña</Label>
                    <div className="relative">
                      <Input
                        id={passwordId}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Mínimo 8 caracteres"
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
                      <p className="text-xs text-destructive">{formError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </securityForm.Field>

              <securityForm.Field name="confirmar">
                {(field) => (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={confirmId}>Confirmar contraseña</Label>
                    <div className="relative">
                      <Input
                        id={confirmId}
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Repetí la contraseña"
                        className="pr-10"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showConfirm ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showConfirm
                          ? <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                          : <Eye className="h-4 w-4" strokeWidth={1.5} />}
                      </button>
                    </div>
                    {formError(field.state.meta.errors[0]) && (
                      <p className="text-xs text-destructive">{formError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </securityForm.Field>

              <securityForm.Subscribe selector={(s) => s.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Actualizando...' : 'Cambiar contraseña'}
                  </Button>
                )}
              </securityForm.Subscribe>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
