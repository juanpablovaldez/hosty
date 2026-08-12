---
title: "Anexo II — Diagramas de Flujo Complementarios"
seccion: "A-II"
orden: 18
tipo: anexo
tags: [hosty, informe-final, diagramas-flujo]
estado: completo
figuras: [F30, F31, F32, F33, F34]
tablas: [T50]
updated: 2026-07-28
---

# Anexo II. Diagramas de Flujo Complementarios

Este anexo detalla los flujos de proceso que [[08-Diseno-y-Desarrollo]] referencia sin
diagramar, para mantener esa sección centrada en la interfaz. La lectura de estos flujos
complementa el modelo de datos de [[Anexo-I-Modelo-de-Datos]] y la arquitectura de
[[11-Arquitectura]].

## Búsqueda y filtrado

La búsqueda no requiere sesión iniciada: los filtros de la ruta `/salones/` se codifican
enteramente en la URL (`validateSearch` con Zod), por lo que un resultado de búsqueda es
enlazable y compartible. El ordenamiento y la paginación se resuelven del lado del servidor
(PostgREST), no en el cliente, para no descargar el catálogo completo en cada búsqueda.

```mermaid
flowchart TD
  Home["Home (/)"] --> Salones["/salones"]
  Salones --> Filtros["Filtros: zona, fecha, capacidad, precio, tipo de evento, servicios"]
  Filtros --> Vista{"Vista"}
  Vista -->|lista| Lista["Listado paginado (server-side)"]
  Vista -->|mapa| Mapa["Mapa con marcadores (Leaflet)"]
  Lista --> Detalle["/salones/:id"]
  Mapa --> Detalle
```

*Figura 30 — Flujo de búsqueda y filtrado: home → `/salones` → filtros/mapa → `/salones/:id`.*

> [!info] Fuente — la ruta `/salones/` valida 17 parámetros de búsqueda con Zod
> (`frontend/src/routes/salones/index.tsx`, `searchSchema`; verificado 2026-07-28).

## Flujo de reserva

El asistente exige sesión iniciada (`requireAuth`) recién al llegar a
`/salones/:id/reservar`; los dos primeros pasos se validan íntegramente en el cliente antes de
escribir nada en la base de datos, y sólo la confirmación del paso 3 dispara la mutación. Si el
salón cotiza "a consultar", el total se muestra como pendiente de cotización en lugar de un
monto, y la reserva igual se crea en estado `pending`.

```mermaid
flowchart TD
  S1["Paso 1 — Fecha y horario"] --> V1{"¿Horario válido y ≥ rentTimeHours,\nfecha no bloqueada?"}
  V1 -->|no| S1
  V1 -->|sí| S2["Paso 2 — Datos del evento y servicios extra"]
  S2 --> S3["Paso 3 — Confirmación"]
  S3 --> Create["INSERT bookings (status = pending)"]
```

*Figura 31 — Flujo de reserva (wizard de 3 pasos): fecha y horario → datos del evento → confirmación.*

> [!info] Fuente — M20: 3 pasos (`frontend/src/features/bookings/components/BookingFlow.tsx`).
> Valida horario mínimo (`salon.rentTimeHours`) y fechas de `salon_availability_blocks`.

## Publicación de un salón (anfitrión)

El mismo componente (`SalonWizard`) se reutiliza en modo creación y en modo edición: en edición,
el paso de imágenes conserva las URLs existentes y sólo sube a Storage los archivos nuevos, y el
paso final reemplaza el registro completo de `salones` en lugar de aplicar un parche parcial.

```mermaid
flowchart TD
  W1["Paso 1 — Datos básicos (nombre, zona, dirección, mapa)"] --> W2["Paso 2 — Capacidad, precio, tipos de evento, servicios"]
  W2 --> W3["Paso 3 — Imágenes (Storage)"]
  W3 --> W4["Paso 4 — Vista previa"]
  W4 --> Publish["INSERT/UPDATE salones + salon_services"]
```

*Figura 32 — Flujo de publicación de salón (wizard de 4 pasos): datos básicos → capacidad/precio/servicios → imágenes → vista previa.*

> [!info] Fuente — M21: 4 pasos (`frontend/src/features/host/components/SalonWizard.tsx`).

## Máquina de estados de una reserva

Toda transición la ejecuta el anfitrión desde su panel, salvo la cancelación, que también puede
iniciarla el huésped desde `/mis-reservas`. No existe una transición automática por vencimiento
de fecha: una reserva `confirmed` para un evento ya pasado permanece en ese estado indefinidamente
si nadie la actualiza manualmente.

```mermaid
stateDiagram-v2
  [*] --> pending: huésped crea la reserva
  pending --> confirmed: anfitrión confirma
  pending --> declined: anfitrión rechaza (con motivo)
  pending --> cancelled: huésped cancela
  confirmed --> cancelled: huésped cancela
  declined --> [*]
  cancelled --> [*]
  confirmed --> [*]
```

*Figura 33 — Máquina de estados de una reserva: `pending` → `confirmed` | `declined` | `cancelled`.*

> [!info] Fuente — M17. El cuarto estado (`declined`) fue admitido por la restricción `CHECK` de
> Postgres recién en la migración `20260609233130`; el hallazgo completo, con cita verbatim de
> ambas migraciones, se documenta en [[Anexo-I-Modelo-de-Datos]] (Tabla 43).

## Favoritos y plan destacado

El toggle de favorito actualiza el caché de TanStack Query antes de recibir respuesta del
servidor (`onMutate`), para que el ícono cambie sin demora perceptible; si la mutación falla, el
valor previo se restaura (`onError`) y la interfaz vuelve a su estado real. El plan destacado
sigue un ciclo independiente: al activarse la suscripción, un único salón por anfitrión pasa a
`is_featured = true` y gana prioridad de orden en los resultados de búsqueda por defecto; al
cancelarse, ambos cambios (suscripción y bandera) se revierten en la misma operación.

```mermaid
flowchart TD
  Click["Click en icono de favorito"] --> Optimistic["Actualización optimista del caché (onMutate)"]
  Optimistic --> Op{"¿Ya era favorito?"}
  Op -->|sí| Del["DELETE user_favorites"]
  Op -->|no| Ins["INSERT user_favorites"]
  Del --> Settle["onSettled: invalidateQueries"]
  Ins --> Settle
  Settle --> Err{"¿Error?"}
  Err -->|sí| Revert["Revertir caché (onError)"]
  Err -->|no| Done["Estado confirmado"]

  Sub["Anfitrión contrata Plan Destacado"] --> Active["salon_subscriptions.status = active"]
  Active --> Feat["salones.is_featured = true"]
  Feat --> Prior["Prioridad en useSearchSalones (order by is_featured)"]
```

*Figura 34 — Gestión de favoritos y plan destacado.*

## Índice de flujos

| Flujo | Actor | Precondición | Resultado |
|---|---|---|---|
| Búsqueda y filtrado | Visitante | Ninguna | Lista/mapa de salones filtrados |
| Reserva (3 pasos) | Usuario autenticado | Sesión iniciada; salón con disponibilidad en la fecha elegida | Reserva creada en estado `pending` |
| Publicación de salón (4 pasos) | Anfitrión | Sesión iniciada | Salón publicado o actualizado, con imágenes en Storage |
| Cambio de estado de reserva | Anfitrión | Reserva en estado `pending` | Reserva en `confirmed`, `declined` (con motivo) o cotizada |
| Gestión de favoritos | Usuario autenticado | Sesión iniciada | Salón agregado/quitado de favoritos, con reversión ante error |
| Plan destacado | Anfitrión | Sesión iniciada; suscripción `active` | Salón con `is_featured = true` y prioridad en resultados |

*Tabla 50 — Índice de flujos: actor, precondición y resultado.*

---
[[Indice|Índice]] · ← [[Anexo-I-Modelo-de-Datos]] · [[Anexo-III-Backlog-User-Stories]] →
