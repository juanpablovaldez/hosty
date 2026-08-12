-- ============================================================
-- Reseñas y ratings (issue #33, diferido como post-mvp)
--
-- Hasta acá, `salones.rating_value` y `salones.rating_count` eran datos de
-- seed: números plausibles sin ninguna reseña detrás. Esta migración crea el
-- sistema real de reseñas y hace que esas dos columnas pasen a mantenerse
-- solas a partir de las reseñas cargadas.
--
-- Reglas de negocio:
--   1. Sólo puede reseñar quien tuvo una reserva CONFIRMADA en ese salón y
--      cuya fecha de evento YA PASÓ. Se valida por RLS, no sólo en la
--      interfaz: no alcanza con esconder el botón.
--   2. Una reseña por reserva (no por usuario ni por salón): quien alquiló
--      tres veces el mismo salón puede dejar tres reseñas.
--   3. El anfitrión puede responder públicamente cada reseña, una sola vez.
-- ============================================================

create table if not exists public.salon_reviews (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz,
  salon_id        uuid not null references public.salones(id) on delete cascade,
  booking_id      uuid not null unique references public.bookings(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  rating          smallint not null check (rating between 1 and 5),
  comment         text check (char_length(comment) <= 1000),
  host_reply      text check (char_length(host_reply) <= 1000),
  host_replied_at timestamptz
);

create index if not exists idx_salon_reviews_salon_id on public.salon_reviews (salon_id);
create index if not exists idx_salon_reviews_user_id on public.salon_reviews (user_id);

-- ============================================================
-- Elegibilidad
--
-- No lleva `security definer` a propósito: consulta `bookings`, que tiene RLS,
-- y quien la invoca sólo puede ver sus propias reservas. Es exactamente el
-- alcance que necesita.
-- ============================================================
create or replace function public.can_review_booking(p_booking_id uuid, p_user_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.bookings b
    where b.id = p_booking_id
      and b.user_id = p_user_id
      and b.status = 'confirmed'
      and b.event_date < current_date
  )
$$;

grant execute on function public.can_review_booking(uuid, uuid) to authenticated;

-- ============================================================
-- RLS
-- ============================================================
alter table public.salon_reviews enable row level security;

create policy "Las reseñas son públicas"
  on public.salon_reviews for select
  using (true);

create policy "Sólo reseña quien tuvo una reserva confirmada y pasada"
  on public.salon_reviews for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and public.can_review_booking(booking_id, auth.uid())
    and salon_id = (select b.salon_id from public.bookings b where b.id = booking_id)
  );

create policy "El autor puede editar su reseña"
  on public.salon_reviews for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "El autor puede borrar su reseña"
  on public.salon_reviews for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "El anfitrión puede responder las reseñas de sus salones"
  on public.salon_reviews for update
  to authenticated
  using (salon_id in (select id from public.salones where host_id = auth.uid()))
  with check (salon_id in (select id from public.salones where host_id = auth.uid()));

-- ============================================================
-- Separación de columnas por rol
--
-- RLS decide qué FILAS puede tocar cada uno, pero no qué COLUMNAS. Sin esto,
-- la política de update del anfitrión le permitiría reescribir el puntaje y el
-- comentario de la reseña, y la del autor le permitiría escribir la respuesta
-- del anfitrión. El trigger revierte cualquier cambio fuera del alcance de
-- cada rol en vez de rechazar la operación entera.
-- ============================================================
create or replace function public.salon_reviews_guard_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  es_autor boolean := auth.uid() = old.user_id;
  es_anfitrion boolean := exists (
    select 1 from public.salones s where s.id = old.salon_id and s.host_id = auth.uid()
  );
begin
  new.id := old.id;
  new.salon_id := old.salon_id;
  new.booking_id := old.booking_id;
  new.user_id := old.user_id;
  new.created_at := old.created_at;

  if es_autor then
    new.host_reply := old.host_reply;
    new.host_replied_at := old.host_replied_at;
    if new.rating is distinct from old.rating or new.comment is distinct from old.comment then
      new.updated_at := now();
    end if;
  elsif es_anfitrion then
    new.rating := old.rating;
    new.comment := old.comment;
    new.updated_at := old.updated_at;
    if new.host_reply is distinct from old.host_reply then
      new.host_replied_at := case when new.host_reply is null then null else now() end;
    end if;
  end if;

  return new;
end;
$$;

create trigger trg_salon_reviews_guard_columns
  before update on public.salon_reviews
  for each row execute function public.salon_reviews_guard_columns();

-- ============================================================
-- Promedio y cantidad, mantenidos por la base
--
-- `security definer` es necesario: quien reseña no es el dueño del salón y la
-- política de update de `salones` exige `host_id = auth.uid()`.
-- ============================================================
create or replace function public.refresh_salon_rating(p_salon_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.salones s
  set rating_value = sub.promedio,
      rating_count = sub.cantidad
  from (
    select round(avg(rating)::numeric, 2) as promedio,
           count(*)::int as cantidad
    from public.salon_reviews
    where salon_id = p_salon_id
  ) sub
  where s.id = p_salon_id;
$$;

create or replace function public.salon_reviews_sync_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.refresh_salon_rating(old.salon_id);
    return old;
  end if;
  perform public.refresh_salon_rating(new.salon_id);
  return new;
end;
$$;

create trigger trg_salon_reviews_sync_rating
  after insert or delete or update of rating on public.salon_reviews
  for each row execute function public.salon_reviews_sync_rating();

-- ============================================================
-- Lectura con el nombre del autor
--
-- El nombre de cada persona vive en `auth.users.raw_user_meta_data`, que el
-- cliente no puede leer. Misma solución que en `salon_busy_slots`: una función
-- `security definer` que expone únicamente el nombre público, nunca el email
-- ni el resto de los metadatos.
-- ============================================================
create or replace function public.salon_reviews_list(p_salon_id uuid)
returns table (
  id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  rating smallint,
  comment text,
  host_reply text,
  host_replied_at timestamptz,
  user_id uuid,
  author_name text
)
language sql
stable
security definer
set search_path = public
as $$
  select r.id, r.created_at, r.updated_at, r.rating, r.comment,
         r.host_reply, r.host_replied_at, r.user_id,
         coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), 'Usuario') as author_name
  from public.salon_reviews r
  join auth.users u on u.id = r.user_id
  where r.salon_id = p_salon_id
  order by r.created_at desc
$$;

grant execute on function public.salon_reviews_list(uuid) to anon, authenticated;
