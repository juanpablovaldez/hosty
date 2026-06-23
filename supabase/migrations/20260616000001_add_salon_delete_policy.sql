-- ============================================================
-- RLS: faltaba la policy de DELETE en salones. Con RLS activo y
-- sin policy de DELETE, el borrado desde el cliente afecta 0 filas
-- y no devuelve error (el salón nunca se elimina). Habilitamos que
-- el host pueda borrar sus propios salones.
-- bookings y salon_services ya tienen FK con on delete cascade.
-- ============================================================

create policy "Host can delete their own salon"
  on public.salones for delete
  using (auth.uid() = host_id);
