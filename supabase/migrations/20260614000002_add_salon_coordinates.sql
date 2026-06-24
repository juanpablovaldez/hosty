-- ============================================================
-- Geolocation for salones: latitude/longitude so the /salones
-- map view can render markers. Nullable because legacy rows and
-- new salones may not be geocoded yet.
-- ============================================================

alter table public.salones
  add column if not exists latitude  double precision,
  add column if not exists longitude double precision;

-- Backfill the seed salones with approximate coordinates in Tucumán.
update public.salones set latitude = -26.8123, longitude = -65.3185
  where id = 'a1b2c3d4-0001-0001-0001-000000000001';
update public.salones set latitude = -26.8276, longitude = -65.2038
  where id = 'a1b2c3d4-0002-0002-0002-000000000002';
update public.salones set latitude = -26.8295, longitude = -65.2065
  where id = 'a1b2c3d4-0003-0003-0003-000000000003';
update public.salones set latitude = -26.7330, longitude = -65.2615
  where id = 'a1b2c3d4-0004-0004-0004-000000000004';
update public.salones set latitude = -26.8385, longitude = -65.1730
  where id = 'a1b2c3d4-0005-0005-0005-000000000005';
