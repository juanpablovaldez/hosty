import { useState, useRef } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { toast } from 'sonner'
import { supabase } from '@/shared/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ChevronLeft, ChevronRight, Check, Info,
  Settings, ImagePlus, Eye, X, Upload,
  MapPin, Users, Clock, DollarSign,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'

/* ─── Constantes ─────────────────────────────────────────── */
const EVENT_TYPES = ['Cumpleaños', 'Casamientos', 'Corporativo', 'Egresos', 'Infantiles', 'Baby Shower', 'Quince años']
const AMENITIES = ['Catering', 'Estacionamiento', 'Climatización', 'Sonido', 'Wi-Fi', 'Iluminación']
const ZONAS = ['Centro', 'Yerba Buena', 'Tafí Viejo', 'Banda del Río Salí']

const STEPS = [
  { label: 'Info básica', icon: Info },
  { label: 'Detalles', icon: Settings },
  { label: 'Fotos', icon: ImagePlus },
  { label: 'Preview', icon: Eye },
] as const

/* ─── Schemas ────────────────────────────────────────────── */
const step1Schema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().min(20, 'Contá un poco más sobre el salón (mínimo 20 caracteres)'),
  location: z.string().min(1, 'Seleccioná una zona'),
  address: z.string().min(5, 'Ingresá la dirección completa'),
})

const step2Schema = z.object({
  capacity: z.number().min(1, 'Capacidad mínima 1 persona'),
  pricePerHour: z.number().min(1, 'Ingresá un precio'),
  rentTimeHours: z.number().min(1, 'Mínimo 1 hora'),
  eventTypes: z.array(z.string()).min(1, 'Seleccioná al menos un tipo de evento'),
  amenities: z.array(z.string()),
})

type Step1 = z.infer<typeof step1Schema>
type Step2 = z.infer<typeof step2Schema>

/* ─── Tipos ──────────────────────────────────────────────── */
interface FormState {
  step1: Step1
  step2: Step2
  images: File[]
  imageUrls: string[]
}

const EMPTY: FormState = {
  step1: { name: '', description: '', location: '', address: '' },
  step2: { capacity: 50, pricePerHour: 0, rentTimeHours: 2, eventTypes: [], amenities: [] },
  images: [],
  imageUrls: [],
}

/* ─── Helper: campo de texto ─────────────────────────────── */
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

/* ─── Step 1: Info básica ────────────────────────────────── */
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

      <div className="flex justify-end">
        <Button type="submit" className="gap-2">
          Siguiente <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </div>
    </form>
  )
}

/* ─── Step 2: Detalles ───────────────────────────────────── */
function Step2Form({ data, onBack, onNext }: { data: Step2; onBack: () => void; onNext: (v: Step2) => void }) {
  const [form, setForm] = useState(data)
  const [errors, setErrors] = useState<Partial<Record<keyof Step2, string>>>({})

  function toggleItem(key: 'eventTypes' | 'amenities', value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }))
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
    onNext(result.data)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold text-foreground">Detalles del salón</h2>

      <div className="grid grid-cols-3 gap-4">
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
        <Field label="Precio por hora ($)" error={errors.pricePerHour}>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <Input
              type="number" min={0} className="pl-9"
              value={form.pricePerHour || ''}
              onChange={(e) => setForm({ ...form, pricePerHour: Number(e.target.value) })}
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

/* ─── Step 3: Fotos ──────────────────────────────────────── */
function Step3Images({
  files, onBack, onNext,
}: { files: File[]; onBack: () => void; onNext: (files: File[]) => void }) {
  const [images, setImages] = useState<File[]>(files)
  const [previews, setPreviews] = useState<string[]>(files.map((f) => URL.createObjectURL(f)))
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(incoming: FileList | null) {
    if (!incoming) return
    const valid = Array.from(incoming).filter((f) => f.type.startsWith('image/'))
    const newPreviews = valid.map((f) => URL.createObjectURL(f))
    setImages((prev) => [...prev, ...valid])
    setPreviews((prev) => [...prev, ...newPreviews])
  }

  function remove(idx: number) {
    URL.revokeObjectURL(previews[idx])
    setImages((prev) => prev.filter((_, i) => i !== idx))
    setPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

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

      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Portada
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
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
            if (images.length === 0) { toast.error('Agregá al menos una foto'); return }
            onNext(images)
          }}
          className="gap-2"
        >
          Siguiente <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  )
}

/* ─── Step 4: Preview + publicar ────────────────────────── */
function Step4Preview({
  state, onBack, onPublish, publishing,
}: { state: FormState; onBack: () => void; onPublish: () => void; publishing: boolean }) {
  const { step1, step2, imageUrls } = state

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-foreground">Vista previa</h2>

      {imageUrls[0] && (
        <img src={imageUrls[0]} alt="Portada" className="w-full h-52 object-cover rounded-2xl" />
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
          { label: 'Precio', value: `${step2.pricePerHour.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}/h` },
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

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2" disabled={publishing}>
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} /> Atrás
        </Button>
        <Button onClick={onPublish} disabled={publishing} className="gap-2">
          {publishing ? 'Publicando...' : (
            <><Check className="w-4 h-4" strokeWidth={1.5} /> Publicar salón</>
          )}
        </Button>
      </div>
    </div>
  )
}

/* ─── Wizard principal ───────────────────────────────────── */
export function CreateSalonPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [publishing, setPublishing] = useState(false)

  async function handlePublish() {
    setPublishing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { toast.error('Necesitás estar logueado'); setPublishing(false); return }

      // Upload images to Supabase Storage
      const uploadedUrls: string[] = []
      for (const file of form.images) {
        const ext = file.name.split('.').pop()
        const path = `salones/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error } = await supabase.storage.from('salon-images').upload(path, file)
        if (error) throw error
        const { data } = supabase.storage.from('salon-images').getPublicUrl(path)
        uploadedUrls.push(data.publicUrl)
      }

      // Insert salon
      const { error } = await supabase.from('salones').insert({
        name: form.step1.name,
        description: form.step1.description,
        location: form.step1.location,
        address: form.step1.address,
        capacity: form.step2.capacity,
        price_per_hour: form.step2.pricePerHour,
        rent_time_hours: form.step2.rentTimeHours,
        event_types: form.step2.eventTypes,
        amenities: form.step2.amenities,
        images: uploadedUrls,
        host_id: user.id,
        availability_status: 'disponible',
      })
      if (error) throw error

      toast.success('¡Salón publicado exitosamente!')
      navigate({ to: '/host/dashboard' })
    } catch (err) {
      toast.error('Ocurrió un error al publicar. Intentá de nuevo.')
      console.error(err)
    } finally {
      setPublishing(false)
    }
  }

  function handleStep3Next(files: File[]) {
    const imageUrls = files.map((f) => URL.createObjectURL(f))
    setForm((prev) => ({ ...prev, images: files, imageUrls }))
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
        Publicar mi salón<span className="text-primary">.</span>
      </h1>

      {/* Stepper */}
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
            onBack={() => setStep(0)}
            onNext={(v) => { setForm((p) => ({ ...p, step2: v })); setStep(2) }}
          />
        )}
        {step === 2 && (
          <Step3Images
            files={form.images}
            onBack={() => setStep(1)}
            onNext={handleStep3Next}
          />
        )}
        {step === 3 && (
          <Step4Preview
            state={form}
            onBack={() => setStep(2)}
            onPublish={handlePublish}
            publishing={publishing}
          />
        )}
      </div>
    </div>
  )
}
