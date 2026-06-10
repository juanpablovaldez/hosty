-- ============================================================
-- Flexible pricing (fixed / estimated range / on request) and
-- per-salon extra services catalog, plus booking-side support
-- for selected services and host quotes.
-- ============================================================

-- ── Salones: pricing modes ─────────────────────────────────
alter table public.salones
  add column if not exists price_type text not null default 'fixed'
    check (price_type in ('fixed', 'estimated', 'on_request'));
alter table public.salones add column if not exists price_min numeric(12, 2);
alter table public.salones add column if not exists price_max numeric(12, 2);
-- price_per_hour is only used by 'fixed'; estimated/on_request leave it null.
alter table public.salones alter column price_per_hour drop not null;

-- ── Catálogo de servicios extra por salón ──────────────────
-- price null = "a consultar".
create table if not exists public.salon_services (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  salon_id   uuid not null references public.salones(id) on delete cascade,
  name       text not null,
  price      numeric(12, 2)
);

alter table public.salon_services enable row level security;

create policy "Salon services are publicly readable"
  on public.salon_services for select
  using (true);

create policy "Host manages services of their salones"
  on public.salon_services for all
  using (
    exists (select 1 from public.salones s where s.id = salon_id and s.host_id = auth.uid())
  )
  with check (
    exists (select 1 from public.salones s where s.id = salon_id and s.host_id = auth.uid())
  );

create index if not exists salon_services_salon_id_idx on public.salon_services (salon_id);

-- ── Bookings: extras + cotización ──────────────────────────
-- total_price unknown when the salon/extras are "a consultar".
alter table public.bookings alter column total_price drop not null;
alter table public.bookings add column if not exists selected_services jsonb not null default '[]'::jsonb;
alter table public.bookings add column if not exists quoted_price numeric(12, 2);
