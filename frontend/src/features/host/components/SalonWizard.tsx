import { useState, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ChevronLeft, ChevronRight, Check, Info,
  Settings, ImagePlus, Eye, X, Upload,
  MapPin, Users, Clock, DollarSign, Plus, Trash2,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import {
  EVENT_TYPES, AMENITIES, ZONAS,
  step1Schema, step2Schema,
} from '../lib/salon-wizard'
import type { FormState, Step1, Step2 } from '../lib/salon-wizard'
import { LocationPicker } from './LocationPicker'
import type { PriceType, SalonService } from '@/features/salones/lib/pricing'
import { salonPriceDisplay, formatARS } from '@/features/salones/lib/pricing'
export type { FormState, Step1, Step2 } from '../lib/salon-wizard'

const PRICE_MODES: { id: PriceType; label: string; hint: string }[] = [
  { id: 'fixed', label: 'Precio fijo', hint: 'Monto por hora' },
  { id: 'estimated', label: 'Estimado', hint: 'Un rango de referencia' },
  { id: 'on_request', label: 'A consultar', hint: 'El cliente solicita y vos cotizás' },
]

const STEPS = [
  { label: 'Info básica', icon: Info },
  { label: 'Detalles', icon: Settings },
  { label: 'Fotos', icon: ImagePlus },
  { label: 'Preview', icon: Eye },
] as const

/* ─── Helper ─────────────────────────────────────────────── */
function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

/* ─── Step 1 ─────────────────────────────────────────────── */
function Step1Form({ data, onNext }: { data: Step1; onNext: (v: Step1) => void }) {
  const [form, setForm] = useState(data)
  const [errors, setErrors] = useState<Partial<Record<keyof Step1, string>>>({})

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const result = step1Schema.safeParse(form)
    if (!result.success) {
      const errs: typeof errors = {}
      result.error.issues.forEach((i) => { errs[i.path[0] as keyof Step1] = i.message })
      setErrors(errs)
      return
    }
    if (form.latitude == null || form.longitude == null) {
      setErrors((prev) => ({ ...prev, latitude: 'Confirmá la ubicación en el mapa para que el salón aparezca en las búsquedas' }))
      return
    }
    onNext(result.data)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold text-foreground">Información básica</h2>

      <Field label="Nombre del salón" error={errors.name}>
        <Input
          placeholder="Ej: Salón Los Jazmines"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </Field>

      <Field label="Descripción" error={errors.description}>
        <textarea
          rows={4}
          placeholder="Contá qué hace especial a tu salón, el ambiente, el estilo..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </Field>

      <Field label="Zona" error={errors.location}>
        <div className="flex flex-wrap gap-2">
          {ZONAS.map((zona) => (
            <button
              key={zona}
              type="button"
              onClick={() => setForm({ ...form, location: zona })}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                form.location === zona
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary hover:text-primary',
              )}
            >
              {zona}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Dirección completa" error={errors.address}>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          <Input
            className="pl-9"
            placeholder="Ej: Av. Mate de Luna 1234"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
      </Field>

      <Field label="Ubicación en el mapa" error={errors.latitude}>
        <LocationPicker
          address={form.address}
          zona={form.location}
          value={{ latitude: form.latitude, longitude: form.longitude }}
          onChange={({ latitude, longitude }) => setForm({ ...form, latitude, longitude })}
        />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" className="gap-2">
          Siguiente <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </div>
    </form>
  )
}

/* ─── Step 2 ─────────────────────────────────────────────── */
function PriceInput({ value, onChange }: { value: number | null; onChange: (n: number | null) => void }) {
  return (
    <div className="relative">
      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
      <Input
        type="number" min={0} className="pl-9"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      />
    </div>
  )
}

function Step2Form({
  data, services: initialServices, onBack, onNext,
}: {
  data: Step2
  services: SalonService[]
  onBack: () => void
  onNext: (v: Step2, services: SalonService[]) => void
}) {
  const [form, setForm] = useState(data)
  const [services, setServices] = useState<SalonService[]>(initialServices)
  const [errors, setErrors] = useState<Partial<Record<keyof Step2, string>>>({})

  function toggleItem(key: 'eventTypes' | 'amenities', value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }))
  }

  function updateService(idx: number, patch: Partial<SalonService>) {
    setServices((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const result = step2Schema.safeParse(form)
    if (!result.success) {
      const errs: typeof errors = {}
      result.error.issues.forEach((i) => { errs[i.path[0] as keyof Step2] = i.message })
      setErrors(errs)
      return
    }
    const cleaned = services
      .map((s) => ({ ...s, name: s.name.trim() }))
      .filter((s) => s.name.length > 0)
    onNext(result.data, cleaned)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold text-foreground">Detalles del salón</h2>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Capacidad (personas)" error={errors.capacity}>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <Input
              type="number" min={1} className="pl-9"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            />
          </div>
        </Field>
        <Field label="Horas mínimas" error={errors.rentTimeHours}>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <Input
              type="number" min={1} className="pl-9"
              value={form.rentTimeHours}
              onChange={(e) => setForm({ ...form, rentTimeHours: Number(e.target.value) })}
            />
          </div>
        </Field>
      </div>

      <Field label="Modo de precio">
        <div className="grid grid-cols-3 gap-2">
          {PRICE_MODES.map((m) => (
            <button
              key={m.id} type="button"
              onClick={() => setForm({ ...form, priceType: m.id })}
              className={cn(
                'rounded-xl border p-3 text-left transition-colors',
                form.priceType === m.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary',
              )}
            >
              <span className="block text-sm font-semibold text-foreground">{m.label}</span>
              <span className="block text-xs text-muted-foreground mt-0.5">{m.hint}</span>
            </button>
          ))}
        </div>
      </Field>

      {form.priceType === 'fixed' && (
        <Field label="Precio por hora ($)" error={errors.pricePerHour}>
          <PriceInput value={form.pricePerHour} onChange={(n) => setForm({ ...form, pricePerHour: n })} />
        </Field>
      )}
      {form.priceType === 'estimated' && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Mínimo estimado ($)" error={errors.priceMin}>
            <PriceInput value={form.priceMin} onChange={(n) => setForm({ ...form, priceMin: n })} />
          </Field>
          <Field label="Máximo estimado ($)" error={errors.priceMax}>
            <PriceInput value={form.priceMax} onChange={(n) => setForm({ ...form, priceMax: n })} />
          </Field>
        </div>
      )}
      {form.priceType === 'on_request' && (
        <p className="-mt-1 text-sm text-muted-foreground">
          El salón se mostrará como “A consultar”. Recibirás solicitudes y vas a poder cotizar cada una desde el panel.
        </p>
      )}

      <Field label="Tipos de evento" error={errors.eventTypes}>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((tipo) => (
            <button
              key={tipo} type="button"
              onClick={() => toggleItem('eventTypes', tipo)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                form.eventTypes.includes(tipo)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary hover:text-primary',
              )}
            >
              {tipo}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Servicios incluidos">
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((amenity) => (
            <button
              key={amenity} type="button"
              onClick={() => toggleItem('amenities', amenity)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                form.amenities.includes(amenity)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary hover:text-primary',
              )}
            >
              {amenity}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Servicios extra (opcionales)">
        <p className="-mt-1 mb-1 text-xs text-muted-foreground">
          Catering, DJ, sillas, etc. El cliente los podrá elegir al reservar. Dejá el precio vacío para “a consultar”.
        </p>
        <div className="flex flex-col gap-2">
          {services.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                placeholder="Nombre (ej: Catering)"
                value={s.name}
                onChange={(e) => updateService(idx, { name: e.target.value })}
                className="flex-1"
              />
              <div className="w-36">
                <PriceInput value={s.price} onChange={(n) => updateService(idx, { price: n })} />
              </div>
              <Button
                type="button" variant="ghost" size="icon"
                onClick={() => setServices((prev) => prev.filter((_, i) => i !== idx))}
                aria-label="Quitar servicio"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </Button>
            </div>
          ))}
          <Button
            type="button" variant="outline" size="sm"
            onClick={() => setServices((prev) => [...prev, { name: '', price: 0 }])}
            className="gap-1.5 self-start"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} /> Agregar servicio
          </Button>
        </div>
      </Field>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2">
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} /> Atrás
        </Button>
        <Button type="submit" className="gap-2">
          Siguiente <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </div>
    </form>
  )
}

/* ─── Step 3 ─────────────────────────────────────────────── */
function Step3Images({
  existingUrls,
  files,
  onBack,
  onNext,
}: {
  existingUrls: string[]
  files: File[]
  onBack: () => void
  onNext: (keptUrls: string[], newFiles: File[]) => void
}) {
  const [keptUrls, setKeptUrls] = useState<string[]>(existingUrls)
  const [newFiles, setNewFiles] = useState<File[]>(files)
  const [newPreviews, setNewPreviews] = useState<string[]>(files.map((f) => URL.createObjectURL(f)))
  const inputRef = useRef<HTMLInputElement>(null)

  const totalCount = keptUrls.length + newFiles.length

  function handleFiles(incoming: FileList | null) {
    if (!incoming) return
    const valid = Array.from(incoming).filter((f) => f.type.startsWith('image/'))
    const previews = valid.map((f) => URL.createObjectURL(f))
    setNewFiles((prev) => [...prev, ...valid])
    setNewPreviews((prev) => [...prev, ...previews])
  }

  function removeExisting(idx: number) {
    setKeptUrls((prev) => prev.filter((_, i) => i !== idx))
  }

  function removeNew(idx: number) {
    URL.revokeObjectURL(newPreviews[idx])
    setNewFiles((prev) => prev.filter((_, i) => i !== idx))
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const allPreviews: Array<{ src: string; isExisting: boolean; idx: number }> = [
    ...keptUrls.map((src, idx) => ({ src, isExisting: true, idx })),
    ...newPreviews.map((src, idx) => ({ src, isExisting: false, idx })),
  ]

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold text-foreground">Fotos del salón</h2>
      <p className="text-sm text-muted-foreground -mt-2">
        Subí entre 1 y 10 fotos. La primera será la portada.
      </p>

      <div
        className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary transition"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
      >
        <Upload className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
        <p className="text-sm font-medium text-foreground">Arrastrá fotos o hacé click para seleccionar</p>
        <p className="text-xs text-muted-foreground">JPG, PNG, WebP — máx. 5 MB por foto</p>
        <input
          ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {allPreviews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {allPreviews.map(({ src, isExisting, idx }, i) => (
            <div key={`${isExisting ? 'e' : 'n'}-${idx}`} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Portada
                </span>
              )}
              <button
                type="button"
                onClick={() => isExisting ? removeExisting(idx) : removeNew(idx)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2">
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} /> Atrás
        </Button>
        <Button
          onClick={() => {
            if (totalCount === 0) { toast.error('Agregá al menos una foto'); return }
            onNext(keptUrls, newFiles)
          }}
          className="gap-2"
        >
          Siguiente <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  )
}

/* ─── Step 4 ─────────────────────────────────────────────── */
function Step4Preview({
  state, mode, onBack, onPublish, submitting,
}: {
  state: FormState
  mode: 'create' | 'edit'
  onBack: () => void
  onPublish: () => void
  submitting: boolean
}) {
  const { step1, step2, services, imageUrls, existingUrls } = state
  const coverSrc = existingUrls[0] ?? imageUrls[0] ?? null
  const price = salonPriceDisplay(step2)

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-foreground">Vista previa</h2>

      {coverSrc && (
        <img src={coverSrc} alt="Portada" className="w-full h-52 object-cover rounded-2xl" />
      )}

      <div>
        <h3 className="text-[22px] font-extrabold text-foreground">{step1.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{step1.address}, {step1.location}</p>
      </div>

      <p className="text-[15px] text-muted-foreground leading-relaxed">{step1.description}</p>

      <Separator />

      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { label: 'Capacidad', value: `${step2.capacity} personas` },
          { label: 'Precio', value: `${price.main}${price.suffix ? ` ${price.suffix}` : ''}` },
          { label: 'Mínimo', value: `${step2.rentTimeHours}h` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-muted/50 p-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="font-bold text-foreground mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {step2.eventTypes.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
        {step2.amenities.map((a) => <Badge key={a} variant="outline">{a}</Badge>)}
      </div>

      {services.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-foreground mb-2">Servicios extra</p>
          <div className="flex flex-col gap-1.5">
            {services.map((s, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{s.name}</span>
                <span className="font-medium text-foreground">{s.price != null ? formatARS(s.price) : 'A consultar'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2" disabled={submitting}>
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} /> Atrás
        </Button>
        <Button onClick={onPublish} disabled={submitting} className="gap-2">
          {submitting ? 'Guardando...' : (
            mode === 'create'
              ? <><Check className="w-4 h-4" strokeWidth={1.5} /> Publicar salón</>
              : <><Check className="w-4 h-4" strokeWidth={1.5} /> Guardar cambios</>
          )}
        </Button>
      </div>
    </div>
  )
}

/* ─── Wizard principal ───────────────────────────────────── */
export interface SalonWizardProps {
  mode: 'create' | 'edit'
  title: string
  initialState: FormState
  submitting: boolean
  onSubmit: (form: FormState) => void
}

export function SalonWizard({ mode, title, initialState, submitting, onSubmit }: SalonWizardProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(initialState)

  function handleStep3Next(keptUrls: string[], newFiles: File[]) {
    const imageUrls = newFiles.map((f) => URL.createObjectURL(f))
    setForm((prev) => ({ ...prev, existingUrls: keptUrls, images: newFiles, imageUrls }))
    setStep(3)
  }

  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-8 py-10">
      <Link
        to="/host/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition mb-8"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
        Volver al dashboard
      </Link>

      <h1 className="text-[28px] font-extrabold text-foreground tracking-tight mb-8">
        {title}<span className="text-primary">.</span>
      </h1>

      <div className="flex items-center gap-2 mb-10">
        {STEPS.map(({ label, icon: Icon }, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                i < step ? 'bg-primary text-primary-foreground'
                  : i === step ? 'border-2 border-primary bg-background text-primary'
                    : 'border-2 border-muted bg-background text-muted-foreground',
              )}>
                {i < step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" strokeWidth={1.5} />}
              </div>
              <span className={cn('hidden text-xs sm:block', i === step ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('mb-4 h-px flex-1', i < step ? 'bg-primary' : 'bg-muted')} />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        {step === 0 && (
          <Step1Form
            data={form.step1}
            onNext={(v) => { setForm((p) => ({ ...p, step1: v })); setStep(1) }}
          />
        )}
        {step === 1 && (
          <Step2Form
            data={form.step2}
            services={form.services}
            onBack={() => setStep(0)}
            onNext={(v, services) => { setForm((p) => ({ ...p, step2: v, services })); setStep(2) }}
          />
        )}
        {step === 2 && (
          <Step3Images
            existingUrls={form.existingUrls}
            files={form.images}
            onBack={() => setStep(1)}
            onNext={handleStep3Next}
          />
        )}
        {step === 3 && (
          <Step4Preview
            state={form}
            mode={mode}
            onBack={() => setStep(2)}
            onPublish={() => onSubmit(form)}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  )
}
