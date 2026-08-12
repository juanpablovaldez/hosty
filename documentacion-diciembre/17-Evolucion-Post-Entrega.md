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
| 2 | Reseñas y ratings | Issue #33 diferido (`post-mvp`) | Pendiente |
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

---
[[Indice|Índice]] · [[15-Conclusiones]] · [[12-Testing-y-Calidad]] · [[Anexo-I-Modelo-de-Datos]]
