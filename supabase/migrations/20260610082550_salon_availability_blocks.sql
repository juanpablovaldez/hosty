-- ============================================================
-- Per-salon blocked dates: the host can mark specific days as
-- unavailable. Publicly readable so the booking flow can prevent
-- requests on those dates.
-- ============================================================

create table if not exists public.salon_availability_blocks (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  salon_id   uuid not null references public.salones(id) on delete cascade,
  date       date not null,
  reason     text,
  unique (salon_id, date)
);

alter table public.salon_availability_blocks enable row level security;

create policy "Availability blocks are publicly readable"
  on public.salon_availability_blocks for select
  using (true);

create policy "Host manages availability of their salones"
  on public.salon_availability_blocks for all
  using (
    exists (select 1 from public.salones s where s.id = salon_id and s.host_id = auth.uid())
  )
  with check (
    exists (select 1 from public.salones s where s.id = salon_id and s.host_id = auth.uid())
  );

create index if not exists salon_availability_blocks_salon_id_idx
  on public.salon_availability_blocks (salon_id);
