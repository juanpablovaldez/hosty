-- Enable trigram extension for ilike '%...%' queries on location
create extension if not exists pg_trgm;

-- ============================================================
-- SALONES indexes
-- ============================================================

-- Composite index for the featured salones query (availability_status + is_verified + ORDER BY rating_value)
create index idx_salones_featured
  on public.salones (availability_status, is_verified, rating_value desc);

-- Trigram index for ilike '%location%' full-text partial match
create index idx_salones_location_trgm
  on public.salones using gin (location gin_trgm_ops);

-- Range filter indexes
create index idx_salones_capacity
  on public.salones (capacity);

create index idx_salones_price_per_hour
  on public.salones (price_per_hour);

-- Array overlap indexes (event_types and amenities filters)
create index idx_salones_event_types
  on public.salones using gin (event_types);

create index idx_salones_amenities
  on public.salones using gin (amenities);

-- ============================================================
-- BOOKINGS indexes
-- ============================================================

-- FK lookups (not covered by implicit indexes in Postgres)
create index idx_bookings_salon_id
  on public.bookings (salon_id);

create index idx_bookings_user_id
  on public.bookings (user_id);

-- Date filter for availability queries
create index idx_bookings_event_date
  on public.bookings (event_date);
