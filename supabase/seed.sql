-- =============================================================
-- Hosty — Seed data for manual QA
-- =============================================================
-- HOW TO USE
-- 1. Run this entire script in the Supabase SQL Editor.
-- 2. Register a test user via the app at /register.
-- 3. Copy the user UUID from Supabase > Auth > Users.
-- 4. Run the bookings section below replacing YOUR_USER_ID.
-- =============================================================

-- ─── Salones ─────────────────────────────────────────────────

INSERT INTO public.salones (
  id, name, description, location, address,
  capacity, price_per_hour, rent_time_hours,
  event_types, amenities, images,
  availability_status, is_verified,
  rating_value, rating_count
) VALUES
(
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Salón Aurora',
  'Amplio salón con jardín privado, ideal para eventos de hasta 150 personas. Decoración clásica con iluminación regulable.',
  'Yerba Buena',
  'Av. Aconquija 1450, Yerba Buena',
  150, 12000, 4,
  ARRAY['Cumpleaños','Casamiento','Baby shower','Quince años'],
  ARRAY['Catering','Estacionamiento','Climatización','Sonido','Iluminación'],
  ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
  'disponible', true, 4.7, 23
),
(
  'a1b2c3d4-0002-0002-0002-000000000002',
  'Espacio Jardín del Norte',
  'Terraza descubierta con vista panorámica, perfecta para eventos al aire libre y corporativos.',
  'Centro',
  'San Martín 850, San Miguel de Tucumán',
  80, 8500, 3,
  ARRAY['Corporativo','Cumpleaños','Graduación'],
  ARRAY['Estacionamiento','Wi-Fi','Sonido','Climatización'],
  ARRAY['https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800'],
  'disponible', true, 4.2, 11
),
(
  'a1b2c3d4-0003-0003-0003-000000000003',
  'Terraza Mirador',
  'Salón íntimo para eventos pequeños. Excelente ubicación en el centro, con acceso sin escaleras.',
  'Centro',
  'Córdoba 320, piso 5, San Miguel de Tucumán',
  40, 6000, 2,
  ARRAY['Corporativo','Cumpleaños','Quince años'],
  ARRAY['Climatización','Wi-Fi','Iluminación'],
  ARRAY['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800'],
  'disponible', false, 3.9, 5
),
(
  'a1b2c3d4-0004-0004-0004-000000000004',
  'Villa Eventos Tafí',
  'Finca amplia en las sierras con capacidad para 300 personas. Ideal para casamientos y eventos especiales.',
  'Tafí Viejo',
  'Ruta Provincial 338, Km 3, Tafí Viejo',
  300, 20000, 6,
  ARRAY['Casamiento','Cumpleaños','Baby shower','Quince años'],
  ARRAY['Catering','Estacionamiento','Climatización','Sonido','Wi-Fi','Iluminación'],
  ARRAY['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
        'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=800'],
  'disponible', true, 4.9, 42
),
(
  'a1b2c3d4-0005-0005-0005-000000000005',
  'Centro de Convenciones Río Salí',
  'Moderno centro de convenciones con equipamiento audiovisual completo. Perfecto para eventos corporativos.',
  'Banda del Río Salí',
  'Av. Independencia 2100, Banda del Río Salí',
  200, 15000, 4,
  ARRAY['Corporativo','Graduación'],
  ARRAY['Catering','Estacionamiento','Climatización','Sonido','Wi-Fi','Iluminación'],
  ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  'disponible', true, 4.5, 18
)
ON CONFLICT (id) DO NOTHING;


-- =============================================================
-- BOOKINGS — replace 'YOUR_USER_ID' with your real user UUID
-- after registering via /register in the app.
--
-- Example:
--   \set uid 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
--
-- Then run the INSERT below.
-- =============================================================

-- INSERT INTO public.bookings (
--   id, salon_id, user_id, event_date, start_time, end_time,
--   attendees, event_type, notes, total_price, status
-- ) VALUES
-- (
--   gen_random_uuid(),
--   'a1b2c3d4-0001-0001-0001-000000000001',
--   'YOUR_USER_ID',
--   CURRENT_DATE + INTERVAL '10 days',
--   '18:00', '23:00',
--   80, 'Casamiento',
--   'Decoración con flores blancas. Necesitamos proyector.',
--   60000, 'pending'
-- ),
-- (
--   gen_random_uuid(),
--   'a1b2c3d4-0002-0002-0002-000000000002',
--   'YOUR_USER_ID',
--   CURRENT_DATE + INTERVAL '25 days',
--   '20:00', '02:00',
--   120, 'Cumpleaños',
--   null, 25500, 'confirmed'
-- ),
-- (
--   gen_random_uuid(),
--   'a1b2c3d4-0003-0003-0003-000000000003',
--   'YOUR_USER_ID',
--   CURRENT_DATE - INTERVAL '15 days',
--   '15:00', '19:00',
--   30, 'Corporativo',
--   'Evento de lanzamiento de producto.',
--   24000, 'cancelled'
-- );
