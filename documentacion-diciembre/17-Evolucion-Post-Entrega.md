---
title: "17 — Evolución post-entrega"
seccion: "17"
orden: 18
tipo: seccion
tags: [hosty, informe-final, evolucion, post-entrega]
estado: en-progreso
tablas: [T71]
updated: 2026-08-12
---

# 17. Evolución post-entrega

Esta sección documenta las funcionalidades incorporadas al producto **después** de la entrega y
exposición del informe original (`documentacion-final/`, cerrado el 2026-08-07). Cada una responde
a una de dos categorías: una línea de evolución que el propio informe dejó registrada como diferida
(sección 15, Figura 27), o un defecto detectado sobre el código entregado y no documentado hasta
ahora.

| # | Funcionalidad | Origen | Estado |
|---|---|---|---|
| 1 | Prevención de doble reserva | Defecto detectado post-entrega | Implementada |
| 2 | Reseñas y ratings | Issue #33 diferido (`post-mvp`) | Implementada |
| 3 | Notificaciones (in-app + email) | Funcionalidad nueva | Pendiente |
| 4 | Pagos con Mercado Pago (sandbox) | Issue #45 diferido | Pendiente |

*Tabla 71 — Funcionalidades incorporadas después de la entrega original.*

## 17.1 Prevención de doble reserva

### El defecto

El producto entregado permitía que dos reservas **confirmadas** se superpusieran sobre el mismo
salón. La inserción en `bookings` (`frontend/src/features/bookings/api/bookings.mutations.ts`) no
verificaba superposición alguna, y la tabla `bookings` no tenía ninguna restricción que lo
impidiera: el único mecanismo de disponibilidad existente eran los bloqueos manuales que el
anfitrión carga en `salon_availability_blocks`, que operan **por día completo** y sólo si el
anfitrión se acuerda de cargarlos.

En consecuencia, dos personas podían solicitar el mismo salón, el mismo día, en el mismo horario, y
el anfitrión podía confirmar ambas sin que el sistema se lo impidiera ni se lo advirtiera.

> [!info] Fuente — `git show f38e64f:frontend/src/features/bookings/api/bookings.mutations.ts`
> (inserción sin verificación de solapamiento) y
> `supabase/migrations/20240101000000_init_hosty.sql` líneas 45–59 (definición de `bookings` sin
> restricción de exclusión). Defecto verificado sobre el código entregado, no simulado.

### La regla de negocio adoptada

La restricción se aplica **únicamente sobre las reservas confirmadas**. Varias solicitudes en
estado `pending` pueden competir por el mismo horario —es deseable que así sea: el anfitrión elige
cuál acepta— pero en el momento en que una se confirma, ninguna otra confirmación puede pisarla.
El horario de fin se trata como **exclusivo**: una reserva de 10:00 a 14:00 no entra en conflicto
con otra que arranca exactamente a las 14:00.

### La solución, en tres capas

**Capa 1 — La garantía, en la base de datos.** Una restricción de exclusión de PostgreSQL sobre
`bookings`, que combina la igualdad de `salon_id` con el operador de solapamiento de rangos
temporales (`&&`) en un mismo índice GiST:

```sql
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
```

La elección de resolverlo en la base de datos y no en el cliente es deliberada: una verificación
hecha en el frontend antes de insertar es vulnerable a una condición de carrera —dos confirmaciones
simultáneas pueden leer el mismo estado libre y escribir ambas—, mientras que la restricción de
exclusión es evaluada por el motor de manera atómica sobre el índice. Es la única capa que
constituye una **garantía**; las otras dos son experiencia de usuario. La restricción requiere la
extensión `btree_gist`, que habilita combinar un operador de igualdad B-tree (`salon_id`) con uno
de solapamiento GiST dentro del mismo índice.

**Capa 2 — La consulta de disponibilidad, sin exponer datos personales.** Las políticas RLS de
`bookings` permiten a cada usuario ver sólo sus propias reservas, y al anfitrión las de sus
salones. Quien está por reservar, entonces, no puede leer las reservas ajenas —y no debe poder:
contienen nombre de contacto, teléfono y notas. Para exponer la disponibilidad sin filtrar datos
personales se agregó una función `security definer` que devuelve exclusivamente fecha, hora de
inicio y hora de fin de las reservas confirmadas futuras de un salón:

```sql
create or replace function public.salon_busy_slots(p_salon_id uuid)
returns table (event_date date, start_time time, end_time time)
language sql stable security definer set search_path = public
as $$
  select b.event_date, b.start_time, b.end_time
  from public.bookings b
  where b.salon_id = p_salon_id
    and b.status = 'confirmed'
    and b.event_date >= current_date
  order by b.event_date, b.start_time
$$;
```

**Capa 3 — La experiencia de usuario.** En el flujo de reserva, al elegir una fecha se listan los
horarios ya tomados de ese día, y el intento de avanzar con un horario superpuesto se detiene en el
paso 1 con un mensaje que indica cuál es el rango ocupado. Del lado del anfitrión, si la base de
datos rechaza una confirmación por solapamiento, el error de PostgreSQL se traduce a castellano en
`mensajeDeError` y llega como *toast* legible en vez del mensaje crudo del motor.

### Archivos que intervienen

| Archivo | Rol |
|---|---|
| `supabase/migrations/20260812000001_prevent_double_booking.sql` | Restricción de exclusión + función `salon_busy_slots` |
| `frontend/src/features/bookings/lib/booking-availability.ts` | Lógica pura de solapamiento (sin dependencias de React ni de Supabase) |
| `frontend/src/features/bookings/api/bookings.queries.ts` | `useSalonBusySlots` — consulta de horarios ocupados |
| `frontend/src/features/bookings/components/BookingFlow.tsx` | Listado de horarios tomados y validación en el paso 1 |
| `frontend/src/shared/lib/errors.ts` | Traducción del error de exclusión de PostgreSQL |
| `frontend/src/features/host/components/BookingDrawer.tsx` | Mensaje real al confirmar una reserva en conflicto |
| `frontend/src/features/host/components/BookingDetailPage.tsx` | Ídem, en la vista de detalle |

### Verificación

La lógica de solapamiento se probó de manera aislada por ser una función pura: solapamiento parcial
por delante y por detrás, rango contenido, rango contenedor, bordes exactos (fin de una = inicio de
la otra, que **no** es conflicto), rangos disjuntos y formulario incompleto. Sobre el componente se
agregaron dos casos de prueba: CP-02 verifica que el flujo se detiene ante un horario superpuesto y
muestra el rango ocupado; CP-03 verifica el caso borde —arrancar exactamente cuando termina la
reserva confirmada— que **sí** debe poder avanzar.

> [!info] Fuente — `frontend/src/features/bookings/lib/booking-availability.test.ts` y
> `frontend/src/features/bookings/components/BookingFlow.test.tsx`. Suite completa tras el cambio:
> **111 pruebas en 18 archivos**, todas en verde (`npm --prefix frontend run test`, ejecutado el
> 2026-08-12). El informe original registraba 75 pruebas.

> [!todo] P-18 — Adjuntar la captura de pantalla del mensaje de conflicto en el flujo de reserva y
> del *toast* de error del anfitrión, una vez aplicada la migración sobre el proyecto de Supabase.

## 17.2 Reseñas y ratings

### El punto de partida

El informe original registra las reseñas como issue diferido #33, etiquetado `post-mvp` (sección 15,
Figura 27). Mientras tanto, las columnas `salones.rating_value` y `salones.rating_count` existían y
se mostraban en la interfaz —en la tarjeta de cada salón, en el detalle y como criterio de
ordenamiento del catálogo— pero **su contenido era dato de seed**: números plausibles sin ninguna
reseña detrás, cargados en `20240101000000_init_hosty.sql`.

Es decir que el producto exhibía una reputación que no existía. Esta funcionalidad convierte esas
dos columnas en el resultado calculado de reseñas reales.

### Reglas de negocio

1. **Sólo reseña quien tuvo una reserva confirmada cuya fecha ya pasó.** La regla se valida en RLS,
   no en la interfaz: esconder el botón no es una defensa, porque cualquiera puede llamar a la API
   con el token de su sesión.
2. **Una reseña por reserva**, no por usuario ni por salón: quien alquiló tres veces el mismo salón
   puede dejar tres reseñas. Se garantiza con `unique (booking_id)`.
3. **El anfitrión puede responder públicamente cada reseña.**

### Decisiones de diseño

**RLS no alcanza para separar columnas.** Las políticas de *row level security* deciden qué **filas**
puede tocar cada rol, pero no qué **columnas**. Con sólo las políticas, la de `update` del anfitrión
—que existe para que pueda escribir su respuesta— le permitiría además reescribir el puntaje y el
comentario de la reseña que le dejaron, y la del autor le permitiría falsificar la respuesta del
anfitrión. Se resuelve con un trigger `before update` que revierte al valor anterior cualquier
columna fuera del alcance de cada rol, en vez de rechazar la operación completa.

**El promedio lo mantiene la base, no la aplicación.** Un trigger `after insert or delete or update
of rating` recalcula `rating_value` y `rating_count` del salón afectado. La alternativa —calcular el
promedio al vuelo en cada consulta— habría obligado a modificar todas las consultas del catálogo y a
pagar una agregación en cada listado. Con el trigger, ninguna consulta existente cambia. La función
lleva `security definer` porque quien reseña no es el dueño del salón y la política de `update` de
`salones` exige `host_id = auth.uid()`.

**El nombre del autor sale de una función, no de una columna duplicada.** Los nombres viven en
`auth.users.raw_user_meta_data`, que el cliente no puede leer. Se repite el patrón de
`salon_busy_slots`: una función `security definer` (`salon_reviews_list`) que expone únicamente el
nombre público de quien reseñó, nunca su email ni el resto de sus metadatos. La alternativa habría
sido copiar el nombre dentro de cada reseña al momento de crearla, lo que deja el dato desactualizado
si la persona luego lo cambia.

**El huso horario importa.** La habilitación de la reseña compara la fecha del evento contra "hoy".
`toISOString()` devuelve la fecha en UTC y Argentina está en UTC−3: a partir de las 21:00 informaría
el día siguiente, y una reserva de hoy pasaría por vencida, habilitando la reseña antes de tiempo.
La función `localToday` construye la fecha a partir de los componentes locales.

### Archivos que intervienen

| Archivo | Rol |
|---|---|
| `supabase/migrations/20260812000002_salon_reviews.sql` | Tabla, RLS, triggers y funciones |
| `frontend/src/features/reviews/lib/reviews.ts` | Lógica pura: elegibilidad, promedio, distribución, fecha local |
| `frontend/src/features/reviews/api/reviews.queries.ts` | Listado de reseñas y reservas ya reseñadas |
| `frontend/src/features/reviews/api/reviews.mutations.ts` | Alta, edición, borrado y respuesta del anfitrión |
| `frontend/src/features/reviews/components/StarRating.tsx` | Estrellas de lectura y de carga |
| `frontend/src/features/reviews/components/ReviewFormDialog.tsx` | Formulario de alta y edición |
| `frontend/src/features/reviews/components/SalonReviews.tsx` | Listado, resumen con distribución y respuesta |
| `frontend/src/features/salones/components/SalonDetailPage.tsx` | Sección de reseñas en el detalle |
| `frontend/src/features/bookings/components/MyBookingsPage.tsx` | Acceso a reseñar desde la reserva |

### Verificación

> [!info] Fuente — `frontend/src/features/reviews/lib/reviews.test.ts`. Suite completa tras el
> cambio: **124 pruebas en 19 archivos**, todas en verde (`npm --prefix frontend run test`,
> ejecutado el 2026-08-12). El informe original registraba 75 pruebas.

Los casos cubren la réplica de la regla de elegibilidad —incluido que el **mismo día** del evento
todavía no habilita la reseña, y que ningún estado distinto de `confirmed` la habilita aunque la
fecha haya pasado—, el promedio, la distribución por puntaje y el cálculo de la fecha local.

> [!note] Dato simulado — SIM-37
> Las reseñas visibles en el ambiente desplegado se sembraron con
> `supabase/seed-resenas-demo.sql`: son reservas y reseñas creadas por script, no interacciones
> reales de usuarios. Lo que **no** es simulado es el mecanismo: el promedio y la cantidad que
> muestra cada salón los calcula el trigger `trg_salon_reviews_sync_rating` a partir de esas
> reseñas, no están escritos a mano. Los valores de `rating_value` anteriores a este cambio —esos
> sí inventados y sin nada detrás— fueron reemplazados al ejecutar `refresh_salon_rating` sobre
> todos los salones. El script `seed-resenas-demo-limpiar.sql` revierte la siembra por completo.

---
[[Indice|Índice]] · [[15-Conclusiones]] · [[12-Testing-y-Calidad]] · [[Anexo-I-Modelo-de-Datos]]
