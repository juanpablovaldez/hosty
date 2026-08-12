-- ============================================================
-- DATOS DE DEMOSTRACIÓN — reseñas
--
-- ESTO NO ES UNA MIGRACIÓN. No se aplica automáticamente ni forma parte del
-- esquema: es un script de siembra que se corre a mano, una sola vez, para que
-- la aplicación tenga reseñas visibles durante la demostración.
--
-- El contenido que genera es SIMULADO y así debe declararse: son reservas y
-- reseñas creadas por script, no interacciones reales de usuarios. Lo que sí es
-- real es el mecanismo —el promedio de cada salón lo calcula el trigger a
-- partir de estas reseñas, no está escrito a mano.
--
-- Todo lo que crea queda marcado con notes = 'seed-resenas-demo', de modo que
-- `seed-resenas-demo-limpiar.sql` pueda borrar exactamente esto y nada más.
-- ============================================================

do $$
declare
  v_usuarios uuid[];
  v_cantidad_usuarios int;
  v_salon record;
  v_booking uuid;
  v_i int := 0;
  v_usuario uuid;
  v_puntajes int[] := array[5, 4, 5, 3, 4, 5];
  v_comentarios text[] := array[
    'El salón estaba impecable y la atención fue muy buena. La cocina y el sonido funcionaron perfecto toda la noche.',
    'Muy lindo el lugar y buena ubicación. El aire acondicionado tardó en enfriar, pero el resto salió todo bien.',
    'Superó lo que esperábamos. El anfitrión respondió rápido cada consulta y nos dejó entrar antes para decorar.',
    'Cumple con lo que promete. El espacio es amplio, aunque el estacionamiento se llena rápido si son muchos autos.',
    'Muy buena experiencia. Volveríamos a elegirlo para el próximo evento de la empresa.',
    'Excelente relación precio-calidad. El lugar estaba tal cual las fotos y la entrega fue puntual.'
  ];
begin
  select array_agg(id order by created_at) into v_usuarios from auth.users;
  v_cantidad_usuarios := coalesce(array_length(v_usuarios, 1), 0);

  if v_cantidad_usuarios = 0 then
    raise exception 'No hay usuarios registrados: creá al menos una cuenta antes de sembrar las reseñas.';
  end if;

  for v_salon in
    select id from public.salones order by created_at limit 6
  loop
    v_i := v_i + 1;
    -- Se reparten entre los usuarios que existan, para que las reseñas no
    -- aparezcan todas firmadas por la misma persona.
    v_usuario := v_usuarios[((v_i - 1) % v_cantidad_usuarios) + 1];

    insert into public.bookings (
      salon_id, user_id, event_date, start_time, end_time,
      attendees, event_type, total_price, status, notes,
      contact_name, contact_phone
    )
    values (
      v_salon.id, v_usuario, current_date - (v_i * 7), '19:00', '23:00',
      80, 'Cumpleaños', 180000, 'confirmed', 'seed-resenas-demo',
      'Datos de demostración', '3810000000'
    )
    returning id into v_booking;

    insert into public.salon_reviews (salon_id, booking_id, user_id, rating, comment)
    values (v_salon.id, v_booking, v_usuario, v_puntajes[v_i], v_comentarios[v_i])
    on conflict (booking_id) do nothing;
  end loop;
end $$;

-- Sincroniza el promedio y la cantidad de TODOS los salones a partir de las
-- reseñas reales. Los salones sin reseñas quedan sin puntaje, que es lo
-- correcto: hasta acá mostraban valores de seed sin nada detrás.
select public.refresh_salon_rating(id) from public.salones;
