import { useState, useId } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { signUp } from '../lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus, MailCheck, Eye, EyeOff } from 'lucide-react'
import { formError } from '@/shared/lib/utils'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirm: z.string().min(1, 'Confirmá tu contraseña'),
}).refine((d) => d.password === d.confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm'],
})

export function RegisterPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/register' })
  const [serverError, setServerError] = useState<string | null>(null)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const passwordId = useId()
  const confirmId = useId()

  const form = useForm({
    defaultValues: { email: '', password: '', confirm: '' },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      setServerError(null)
      const { data, error } = await signUp(value.email, value.password)
      if (error) {
        setServerError(error.message)
        return
      }
      if (data.session) {
        toast.success('¡Cuenta creada! Bienvenido.')
        const redirectTo = search.redirect ?? '/'
        navigate({ to: redirectTo as '/' })
      } else {
        setNeedsConfirmation(true)
      }
    },
  })

  if (needsConfirmation) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="h-6 w-6 text-primary" strokeWidth={1.5} />
            </div>
            <CardTitle className="text-xl">Revisá tu email</CardTitle>
            <CardDescription>
              Te enviamos un link de confirmación. Una vez que confirmes tu cuenta podés iniciar sesión.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/login">Ir a iniciar sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" strokeWidth={1.5} />
          </div>
          <CardTitle className="text-2xl">Creá tu cuenta</CardTitle>
          <CardDescription>Registrate gratis en Hosty</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); void form.handleSubmit() }}
            className="flex flex-col gap-4"
          >
            <form.Field name="email">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="vos@ejemplo.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {formError(field.state.meta.errors[0]) && (
                    <p className="text-xs text-destructive">{formError(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={passwordId}>Contraseña</Label>
                  <div className="relative">
                    <Input
                      id={passwordId}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
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
            </form.Field>

            <form.Field name="confirm">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={confirmId}>Confirmá la contraseña</Label>
                  <div className="relative">
                    <Input
                      id={confirmId}
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
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
            </form.Field>

            {serverError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{serverError}</p>
            )}

            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>
              )}
            </form.Subscribe>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
