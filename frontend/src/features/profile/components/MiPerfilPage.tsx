import { useState } from 'react'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/shared/lib/supabase'
import { toast } from 'sonner'
import { User, Lock, Mail } from 'lucide-react'

export function MiPerfilPage() {
  const { user } = useAuthStore()

  const [displayName, setDisplayName] = useState(
    (user?.user_metadata?.full_name as string | undefined) ?? '',
  )
  const [savingName, setSavingName] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) return
    setSavingName(true)
    const { error } = await supabase.auth.updateUser({
      data: { full_name: displayName.trim() },
    })
    setSavingName(false)
    if (error) {
      toast.error('No pudimos guardar el nombre. Intentá de nuevo.')
    } else {
      toast.success('Nombre actualizado correctamente.')
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.')
      return
    }
    if (newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSavingPassword(false)
    if (error) {
      toast.error('No pudimos cambiar la contraseña. Verificá que la contraseña actual sea correcta.')
    } else {
      toast.success('Contraseña actualizada correctamente.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="mb-8">
        <h1 className="text-[28px] font-extrabold text-foreground tracking-tight">Mi Perfil</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Administrá tu información personal y seguridad de la cuenta.
        </p>
      </div>

      {/* Cuenta */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-foreground">Información de la cuenta</h2>
            <p className="text-[13px] text-muted-foreground">Datos básicos de tu perfil</p>
          </div>
        </div>

        {/* Email (read-only) */}
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-muted-foreground mb-1.5">
            Email
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2.5">
            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
            <span className="text-[14px] text-muted-foreground">{user?.email}</span>
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">
            El email no se puede cambiar por el momento.
          </p>
        </div>

        <form onSubmit={handleSaveName} className="flex flex-col gap-4">
          <div>
            <label htmlFor="display-name" className="block text-[13px] font-semibold text-muted-foreground mb-1.5">
              Nombre completo
            </label>
            <Input
              id="display-name"
              type="text"
              placeholder="Tu nombre completo"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <Button
            type="submit"
            disabled={savingName || !displayName.trim()}
            className="self-start rounded-xl font-semibold"
          >
            {savingName ? 'Guardando...' : 'Guardar nombre'}
          </Button>
        </form>
      </div>

      {/* Seguridad */}
      <div className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-foreground">Seguridad</h2>
            <p className="text-[13px] text-muted-foreground">Cambiá tu contraseña</p>
          </div>
        </div>

        <Separator className="mb-5" />

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div>
            <label htmlFor="current-password" className="block text-[13px] font-semibold text-muted-foreground mb-1.5">
              Contraseña actual
            </label>
            <Input
              id="current-password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="rounded-xl"
              autoComplete="current-password"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-[13px] font-semibold text-muted-foreground mb-1.5">
              Nueva contraseña
            </label>
            <Input
              id="new-password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-xl"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-[13px] font-semibold text-muted-foreground mb-1.5">
              Confirmar contraseña
            </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-xl"
              autoComplete="new-password"
            />
          </div>
          <Button
            type="submit"
            disabled={savingPassword || !newPassword || !confirmPassword}
            className="self-start rounded-xl font-semibold"
          >
            {savingPassword ? 'Actualizando...' : 'Cambiar contraseña'}
          </Button>
        </form>
      </div>
    </div>
  )
}
