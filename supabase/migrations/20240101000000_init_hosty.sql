-- Extension not needed for gen_random_uuid()

-- ============================================================
-- SALONES
-- ============================================================
create table if not exists public.salones (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  name                text not null,
  description         text,
  location            text not null,
  address             text not null,
  price_per_hour      numeric(12, 2) not null,
  capacity            int not null,
  rating_value        numeric(3, 2),
  rating_count        int default 0,
  is_verified         boolean not null default false,
  availability_status text not null default 'disponible'
                        check (availability_status in ('disponible', 'reservado', 'no disponible')),
  event_types         text[] not null default '{}',
  amenities           text[] not null default '{}',
  images              text[] not null default '{}',
  host_id             uuid references auth.users(id) on delete set null,
  rent_time_hours     int not null default 1
);

-- Public read; only host or admin can write (handled via RLS policies below)
alter table public.salones enable row level security;

create policy "Salones are publicly readable"
  on public.salones for select
  using (true);

create policy "Host can insert their own salon"
  on public.salones for insert
  with check (auth.uid() = host_id);

create policy "Host can update their own salon"
  on public.salones for update
  using (auth.uid() = host_id);

-- ============================================================
-- BOOKINGS
-- ============================================================
create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  salon_id    uuid not null references public.salones(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  event_date  date not null,
  start_time  time not null,
  end_time    time not null,
  attendees   int not null,
  event_type  text not null,
  notes       text,
  total_price numeric(12, 2) not null,
  status      text not null default 'pending'
                check (status in ('pending', 'confirmed', 'cancelled'))
);

alter table public.bookings enable row level security;

create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can cancel their own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);

-- ============================================================
-- SEED — sample data (remove before production)
-- ============================================================
insert into public.salones (name, description, location, address, price_per_hour, capacity, rating_value, rating_count, is_verified, availability_status, event_types, amenities, images, rent_time_hours)
values
  (
    'Salón La Perla',
    'Espacio amplio y luminoso con jardín privado, ideal para celebraciones íntimas o corporativas.',
    'San Miguel de Tucumán',
    'Av. Mate de Luna 1234, Tucumán',
    15000,
    120,
    4.8,
    32,
    true,
    'disponible',
    ARRAY['Cumpleaños','Casamiento','Corporativo'],
    ARRAY['Estacionamiento','Catering','Climatización'],
    ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'],
    3
  ),
  (
    'Centro de Eventos del Norte',
    'Moderno salón con capacidad para grandes eventos, equipamiento de audio y video incluido.',
    'San Miguel de Tucumán',
    'Calle Maipú 456, Tucumán',
    22000,
    300,
    4.5,
    18,
    true,
    'disponible',
    ARRAY['Casamiento','Graduación','Corporativo'],
    ARRAY['Sonido','Iluminación','Wi-Fi','Climatización'],
    ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
    4
  ),
  (
    'Casa Quinta El Olivo',
    'Quinta privada rodeada de naturaleza, perfecta para eventos al aire libre.',
    'Yerba Buena',
    'Ruta 9 Km 12, Yerba Buena',
    18000,
    80,
    4.9,
    45,
    true,
    'disponible',
    ARRAY['Cumpleaños','Baby shower','Quince años'],
    ARRAY['Estacionamiento','Catering'],
    ARRAY['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'],
    2
  );
