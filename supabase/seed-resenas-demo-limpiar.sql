-- ============================================================
-- Limpieza de los datos de demostración de reseñas
--
-- Borra exactamente lo que creó `seed-resenas-demo.sql` y nada más: se apoya en
-- la marca notes = 'seed-resenas-demo' que ese script deja en cada reserva.
-- Las reseñas se van solas por el `on delete cascade` de `booking_id`.
--
-- Al final vuelve a sincronizar los promedios, que quedan reflejando
-- únicamente las reseñas reales que hayan cargado personas de verdad.
-- ============================================================

-- Antes de borrar, conviene ver qué se va a borrar:
--   select id, salon_id, event_date from public.bookings
--   where notes = 'seed-resenas-demo';

delete from public.bookings
where notes = 'seed-resenas-demo';

select public.refresh_salon_rating(id) from public.salones;
