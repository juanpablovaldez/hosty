-- ============================================================
-- Host booking management: allow hosts to read/manage bookings
-- for their own salones, support 'declined' status + rejection
-- reason, and capture client contact on the booking.
-- ============================================================

-- 'declined' was used by the app but missing from the DB check.
alter table public.bookings drop constraint if exists bookings_status_check;
alter table public.bookings
  add constraint bookings_status_check
  check (status in ('pending', 'confirmed', 'declined', 'cancelled'));

alter table public.bookings add column if not exists rejection_reason text;
alter table public.bookings add column if not exists contact_name text;
alter table public.bookings add column if not exists contact_phone text;

-- Hosts can see bookings made on salones they own.
create policy "Hosts can view bookings for their salones"
  on public.bookings for select
  using (
    salon_id in (select id from public.salones where host_id = auth.uid())
  );

-- Hosts can confirm/decline bookings on salones they own.
create policy "Hosts can update bookings for their salones"
  on public.bookings for update
  using (
    salon_id in (select id from public.salones where host_id = auth.uid())
  )
  with check (
    salon_id in (select id from public.salones where host_id = auth.uid())
  );
