-- ============================================================
-- Prevención de doble reserva
--
-- Hasta esta migración, dos reservas confirmadas podían solaparse
-- sobre el mismo salón: la app insertaba en `bookings` sin verificar
-- superposición y la tabla no tenía ninguna restricción al respecto.
--
-- Regla de negocio: varias solicitudes PENDIENTES pueden competir por
-- el mismo horario (el anfitrión elige cuál acepta), pero no puede
-- haber dos reservas CONFIRMADAS que se pisen en el mismo salón.
-- ============================================================

-- `btree_gist` permite combinar la igualdad de un uuid (salon_id) con
-- el operador de solapamiento de rangos (&&) en un mismo índice GiST.
-- Supabase instala las extensiones en el esquema `extensions`, que hay que
-- tener en el search_path para que se resuelvan las clases de operadores.
create schema if not exists extensions;
create extension if not exists btree_gist with schema extensions;
set search_path = public, extensions;

-- Falla temprano y en castellano si los datos existentes ya violan la
-- regla: sin esto, `add constraint` aborta con un error de Postgres que
-- no dice cuáles son las reservas en conflicto.
do $$
declare
  conflictos int;
begin
  select count(*) into conflictos
  from public.bookings a
  join public.bookings b
    on a.salon_id = b.salon_id
   and a.id < b.id
   and a.status = 'confirmed'
   and b.status = 'confirmed'
   and a.event_date = b.event_date
   and a.start_time < b.end_time
   and b.start_time < a.end_time;

  if conflictos > 0 then
    raise exception
      'No se puede aplicar la restricción: existen % pares de reservas confirmadas que se superponen. Resolvelos (cancelar o rechazar una de cada par) y volvé a aplicar la migración.',
      conflictos;
  end if;
end $$;

alter table public.bookings
  drop constraint if exists bookings_no_overlap;

alter table public.bookings
  add constraint bookings_no_overlap
  exclude using gist (
    salon_id with =,
    tsrange(
      (event_date + start_time)::timestamp,
      (event_date + end_time)::timestamp,
      '[)'
    ) with &&
  )
  where (status = 'confirmed');

-- ============================================================
-- Consulta de disponibilidad sin exponer datos personales
--
-- Las políticas RLS de `bookings` sólo permiten a cada persona ver sus
-- propias reservas y al anfitrión las de sus salones. Para que quien
-- está reservando pueda ver qué horarios ya están tomados hace falta
-- una función `security definer` que devuelva únicamente fecha y horas
-- —nunca el usuario, el contacto ni las notas— de las reservas
-- confirmadas de un salón.
-- ============================================================
create or replace function public.salon_busy_slots(p_salon_id uuid)
returns table (event_date date, start_time time, end_time time)
language sql
stable
security definer
set search_path = public
as $$
  select b.event_date, b.start_time, b.end_time
  from public.bookings b
  where b.salon_id = p_salon_id
    and b.status = 'confirmed'
    and b.event_date >= current_date
  order by b.event_date, b.start_time
$$;

grant execute on function public.salon_busy_slots(uuid) to anon, authenticated;
