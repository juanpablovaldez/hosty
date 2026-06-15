import { Sparkles, Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { toast } from 'sonner'
import { useCancelSubscription } from '../api/host.mutations'
import type { Subscription } from '../types'

interface PlanCardProps {
  subscription: Subscription | null
  userId: string
  hasSalones: boolean
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function PlanCard({ subscription, userId, hasSalones }: PlanCardProps) {
  const cancel = useCancelSubscription()

  async function handleCancel() {
    if (!subscription) return
    try {
      await cancel.mutateAsync({ subscriptionId: subscription.id, userId })
      toast.success('Suscripción cancelada. Tu plan Destacado seguirá activo hasta el vencimiento.')
    } catch {
      toast.error('No se pudo cancelar la suscripción')
    }
  }

  function handleSubscribe() {
    toast.info('La integración con Mercado Pago estará disponible próximamente.', {
      description: 'Te notificaremos cuando puedas activar el plan Destacado.',
    })
  }

  const isActive = subscription?.status === 'active'
  const isCancelled = subscription?.status === 'cancelled'

  return (
    <div
      className={cn(
        'rounded-[20px] border bg-card p-6 shadow-[0_1px_3px_rgba(28,43,58,0.06)]',
        isActive && 'border-primary/40 bg-primary/[0.02]',
        isCancelled && 'border-amber/40',
        !isActive && !isCancelled && 'border-border',
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
              isActive ? 'bg-primary/10' : 'bg-muted',
            )}
          >
            <Sparkles
              className={cn('w-5 h-5', isActive ? 'text-primary' : 'text-muted-foreground')}
              strokeWidth={1.5}
            />
          </div>
          <div>
            <h2 className="font-bold text-[17px] text-foreground leading-tight">
              Plan Destacado
            </h2>
            <p className="text-[13px] text-muted-foreground">
              Visibilidad prioritaria en búsquedas
            </p>
          </div>
        </div>

        {isActive && (
          <span className="rounded-full bg-primary/10 text-primary text-[11px] font-semibold px-2.5 py-1 shrink-0">
            Activo
          </span>
        )}
        {isCancelled && (
          <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-[11px] font-semibold px-2.5 py-1 shrink-0">
            Cancelado
          </span>
        )}
        {!isActive && !isCancelled && (
          <span className="rounded-full bg-muted text-muted-foreground text-[11px] font-semibold px-2.5 py-1 shrink-0">
            Gratuito
          </span>
        )}
      </div>

      {isActive && (
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <Star className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
            Tus salones aparecen primero en los resultados
          </div>
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <Star className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
            Badge "Destacado" visible en cada tarjeta
          </div>
          {subscription?.currentPeriodEnd && (
            <p className="text-[12px] text-muted-foreground pt-1">
              Renueva el {formatDate(subscription.currentPeriodEnd)}
            </p>
          )}
        </div>
      )}

      {isCancelled && subscription?.currentPeriodEnd && (
        <p className="text-[13px] text-muted-foreground mb-5">
          Tu plan Destacado permanece activo hasta el{' '}
          <span className="font-semibold text-foreground">
            {formatDate(subscription.currentPeriodEnd)}
          </span>
          .
        </p>
      )}

      {!isActive && !isCancelled && (
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <Star className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            Aparecé primero en búsquedas
          </div>
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <Star className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            Badge "Destacado" en tus tarjetas
          </div>
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <Star className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            $4.999 / mes · cancelá cuando quieras
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {!isActive && !isCancelled && (
          <Button
            className="gap-2 cursor-pointer"
            onClick={handleSubscribe}
            disabled={!hasSalones}
            title={!hasSalones ? 'Publicá un salón primero para activar el plan' : undefined}
          >
            <Sparkles className="w-4 h-4" strokeWidth={1.5} />
            Destacar mis salones
          </Button>
        )}

        {isActive && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-muted-foreground cursor-pointer"
            disabled={cancel.isPending}
            onClick={handleCancel}
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
            Cancelar suscripción
          </Button>
        )}
      </div>
    </div>
  )
}
