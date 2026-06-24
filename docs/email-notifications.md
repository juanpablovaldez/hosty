# Email Notifications — Documentación

## Arquitectura

Las notificaciones de email se implementan como una **Supabase Edge Function** unificada (`send-emails`) invocada por triggers de PostgreSQL y un cron job. El envío se realiza vía **AWS SES** usando el SDK oficial.

```
Usuario crea reserva
        │
        ▼
  INSERT en bookings
        │
        ├─► trigger trg_booking_insert_notify
        │       │
        │       ├─► POST /functions/v1/send-emails { type: "confirmation" }
        │       │       └─► AWS SES → Email al usuario ✅
        │       │
        │       └─► POST /functions/v1/send-emails { type: "host_notification" }
        │               └─► AWS SES → Email al host ✅
        │
Host confirma/declina
        │
        ▼
  UPDATE bookings.status
        │
        └─► trigger trg_booking_status_notify
                │
                └─► POST /functions/v1/send-emails { type: "status_update" }
                        └─► AWS SES → Email al usuario ✅

pg_cron (10:00 UTC cada día)
        │
        └─► SELECT bookings WHERE event_date = tomorrow AND status = confirmed
                │
                └─► POST /functions/v1/send-emails { type: "reminder" }
                        └─► AWS SES → Email al usuario ✅
```

---

## Archivos creados

| Archivo | Descripción |
|---------|-------------|
| `supabase/functions/send-emails/index.ts` | Edge Function principal (Deno) |
| `supabase/functions/_shared/templates.ts` | Templates HTML de los 4 tipos de email |
| `supabase/migrations/20260624000001_email_notifications.sql` | Migración SQL completa |

---

## Configuración de variables de entorno

### Supabase Secrets (producción)

```bash
# Desde la raíz del proyecto
supabase secrets set AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
supabase secrets set AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
supabase secrets set AWS_SES_REGION=us-east-1
supabase secrets set AWS_SES_FROM_EMAIL=noreply@hosty.ar
supabase secrets set APP_URL=https://hosty.ar

# Secret para validar que el webhook viene de la DB (opcional pero recomendado)
supabase secrets set SUPABASE_WEBHOOK_SECRET=tu-secret-aleatorio-aqui
```

### Variables locales (desarrollo)

Crear `supabase/functions/.env` (no commitear):

```env
AWS_ACCESS_KEY_ID=test-key
AWS_SECRET_ACCESS_KEY=test-secret
AWS_SES_REGION=us-east-1
AWS_SES_FROM_EMAIL=test@example.com
APP_URL=http://localhost:5173
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=<service_role_key_del_supabase_start>
```

> La `SUPABASE_SERVICE_ROLE_KEY` aparece al ejecutar `supabase start`.

---

## Comandos de deploy

### Inicializar la función (primera vez)

```bash
# El directorio ya está creado, pero si necesitás scaffolding:
supabase functions new send-emails
```

### Aplicar la migración

```bash
# Entorno local
supabase db push

# Producción (linked project)
supabase db push --linked
```

### Deploy de la Edge Function

```bash
# Producción
supabase functions deploy send-emails

# Verificar que está activa
supabase functions list
```

---

## Testing en desarrollo local

### 1. Levantar Supabase

```bash
supabase start
```

### 2. Servir la función localmente

```bash
supabase functions serve send-emails --env-file supabase/functions/.env
```

### 3. Test con curl

```bash
# Test: booking confirmation
curl -X POST http://localhost:54321/functions/v1/send-emails \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <anon_key>" \
  -d '{
    "type": "confirmation",
    "record": {
      "id": "00000000-0000-0000-0000-000000000001",
      "salon_id": "<salon_id_real>",
      "user_id": "<user_id_real>",
      "event_date": "2026-07-15",
      "start_time": "18:00:00",
      "end_time": "23:00:00",
      "attendees": 80,
      "event_type": "Cumpleaños",
      "notes": "Mesa de dulces incluida",
      "total_price": 45000,
      "quoted_price": null,
      "status": "pending",
      "rejection_reason": null,
      "contact_name": "Juan Pérez",
      "contact_phone": "+54 381 555-1234"
    }
  }'
```

### 4. Ver emails en Inbucket

En desarrollo, Inbucket intercepta todos los emails. Abrí:

```
http://localhost:54324
```

Los emails aparecen ahí independientemente de si AWS SES está configurado (siempre que uses variables de test).

---

## Tipos de notificación

### `confirmation`
- **Cuándo**: Al insertar una nueva reserva (trigger `trg_booking_insert_notify`)
- **Destinatario**: Usuario que hizo la reserva
- **Asunto**: `✅ Reserva #XXXXXXXX recibida — Nombre del Salón`

### `host_notification`
- **Cuándo**: Al insertar una nueva reserva (mismo trigger)
- **Destinatario**: Host del salón reservado
- **Asunto**: `🔔 Nueva reserva #XXXXXXXX en Nombre del Salón`

### `status_update`
- **Cuándo**: Al cambiar `status` a `confirmed` o `declined` (trigger `trg_booking_status_notify`)
- **Destinatario**: Usuario que hizo la reserva
- **Asunto**: `🎊 Reserva confirmada` o `❌ Reserva no disponible`

### `reminder`
- **Cuándo**: Todos los días a las 10:00 UTC vía `pg_cron`
- **Destinatario**: Usuarios con reservas confirmadas para el día siguiente
- **Asunto**: `⏰ Recordatorio — Tu evento en Nombre del Salón es mañana`

---

## Agregar un nuevo tipo de email

1. Agregar el tipo al union `EmailType` en `index.ts`
2. Crear el template en `_shared/templates.ts`
3. Agregar el `case` en el `switch` de `index.ts`
4. Crear el trigger/cron en una nueva migración SQL

---

## Troubleshooting

### `AWS SES credentials are not set`
Configurar los secrets con `supabase secrets set` o crear el `.env` local.

### `invoke_send_emails failed`
El trigger loguea el error como `WARNING` sin romper la transacción. Revisar los logs con:
```bash
supabase functions logs send-emails
```

### `get_user_email` retorna `null`
El usuario no existe en `auth.users` o el `user_id` es incorrecto. Verificar que el `user_id` del booking corresponde a un usuario registrado.

### SES rechaza el email (sandbox)
AWS SES en modo sandbox solo permite enviar a emails verificados. Verificar el email destino en la consola de AWS SES o solicitar salida del sandbox para producción.
