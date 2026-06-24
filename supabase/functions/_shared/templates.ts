// Shared email templates for Hosty notifications
// Deno-compatible module (no Node.js APIs)

const BASE_STYLES = `
  body { margin: 0; padding: 0; background-color: #0f0f13; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .card { background-color: #1a1a24; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.07); }
  .header { background: linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%); padding: 40px 32px; text-align: center; }
  .header-logo { font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin: 0 0 4px 0; }
  .header-tagline { font-size: 13px; color: rgba(255,255,255,0.7); margin: 0; }
  .body { padding: 32px; }
  .title { font-size: 22px; font-weight: 700; color: #f0f0f5; margin: 0 0 8px 0; }
  .subtitle { font-size: 15px; color: rgba(255,255,255,0.55); margin: 0 0 28px 0; line-height: 1.5; }
  .detail-box { background-color: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px 24px; margin-bottom: 24px; }
  .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .detail-row:last-child { border-bottom: none; padding-bottom: 0; }
  .detail-label { font-size: 13px; color: rgba(255,255,255,0.45); }
  .detail-value { font-size: 13px; font-weight: 600; color: #e8e8f0; text-align: right; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: 0.3px; }
  .badge-pending { background-color: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); }
  .badge-confirmed { background-color: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
  .badge-declined { background-color: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
  .cta-button { display: block; text-align: center; background: linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; margin: 24px 0; }
  .alert-box { background-color: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 14px 18px; margin-top: 20px; }
  .alert-box p { margin: 0; font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.5; }
  .alert-box strong { color: #ef4444; }
  .footer { padding: 24px 32px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; }
  .footer p { margin: 0; font-size: 12px; color: rgba(255,255,255,0.3); line-height: 1.6; }
  .footer a { color: rgba(109,40,217,0.9); text-decoration: none; }
  .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 20px 0; }
`

function htmlWrapper(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hosty</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <span style="display:none;max-height:0;overflow:hidden;">${previewText}</span>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <p class="header-logo">🏛️ Hosty</p>
        <p class="header-tagline">Tu plataforma de salones en Tucumán</p>
      </div>
      ${content}
      <div class="footer">
        <p>© ${new Date().getFullYear()} Hosty · Tucumán, Argentina</p>
        <p>Si tenés alguna duda, respondé este email o visitá <a href="https://hosty.ar">hosty.ar</a></p>
      </div>
    </div>
  </div>
</body>
</html>`
}

export interface BookingConfirmationData {
  guestName: string
  salonName: string
  eventDate: string
  startTime: string
  endTime: string
  attendees: number
  eventType: string
  totalPrice: number | null
  bookingId: string
  appUrl: string
}

export function bookingConfirmationTemplate(data: BookingConfirmationData): {
  subject: string
  html: string
} {
  const shortId = data.bookingId.slice(0, 8).toUpperCase()
  const formattedDate = new Date(data.eventDate + 'T00:00:00').toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedPrice = data.totalPrice
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(data.totalPrice)
    : 'A cotizar'

  const html = htmlWrapper(
    `<div class="body">
      <p class="title">¡Reserva recibida! 🎉</p>
      <p class="subtitle">Hola ${data.guestName}, tu solicitud de reserva fue enviada exitosamente. El organizador del salón la revisará en breve.</p>

      <div class="detail-box">
        <div class="detail-row">
          <span class="detail-label">Número de reserva</span>
          <span class="detail-value">#${shortId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Estado</span>
          <span class="detail-value"><span class="badge badge-pending">Pendiente</span></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Salón</span>
          <span class="detail-value">${data.salonName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Fecha</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Horario</span>
          <span class="detail-value">${data.startTime} – ${data.endTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Asistentes</span>
          <span class="detail-value">${data.attendees} personas</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tipo de evento</span>
          <span class="detail-value">${data.eventType}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Precio estimado</span>
          <span class="detail-value">${formattedPrice}</span>
        </div>
      </div>

      <a href="${data.appUrl}/mis-reservas" class="cta-button">Ver mis reservas</a>

      <div class="divider"></div>
      <p style="font-size:13px;color:rgba(255,255,255,0.45);margin:0;line-height:1.6;">
        Te avisaremos por email cuando el organizador confirme o responda tu solicitud.
        Podés cancelar la reserva desde la plataforma mientras esté en estado <strong style="color:#f59e0b;">Pendiente</strong>.
      </p>
    </div>`,
    `Tu reserva en ${data.salonName} está pendiente de confirmación.`,
  )

  return {
    subject: `✅ Reserva #${shortId} recibida — ${data.salonName}`,
    html,
  }
}

export interface HostNotificationData {
  hostName: string
  guestName: string
  guestPhone: string | null
  salonName: string
  eventDate: string
  startTime: string
  endTime: string
  attendees: number
  eventType: string
  notes: string | null
  totalPrice: number | null
  bookingId: string
  appUrl: string
}

export function hostNotificationTemplate(data: HostNotificationData): {
  subject: string
  html: string
} {
  const shortId = data.bookingId.slice(0, 8).toUpperCase()
  const formattedDate = new Date(data.eventDate + 'T00:00:00').toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedPrice = data.totalPrice
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(data.totalPrice)
    : 'A cotizar'

  const html = htmlWrapper(
    `<div class="body">
      <p class="title">Nueva solicitud de reserva 🔔</p>
      <p class="subtitle">Hola ${data.hostName}, recibiste una nueva solicitud de reserva para <strong style="color:#a78bfa;">${data.salonName}</strong>. Revisala y respondé a la brevedad.</p>

      <div class="detail-box">
        <div class="detail-row">
          <span class="detail-label">Reserva #</span>
          <span class="detail-value">#${shortId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Solicitante</span>
          <span class="detail-value">${data.guestName}</span>
        </div>
        ${data.guestPhone ? `<div class="detail-row">
          <span class="detail-label">Teléfono</span>
          <span class="detail-value">${data.guestPhone}</span>
        </div>` : ''}
        <div class="detail-row">
          <span class="detail-label">Fecha del evento</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Horario</span>
          <span class="detail-value">${data.startTime} – ${data.endTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Asistentes</span>
          <span class="detail-value">${data.attendees} personas</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tipo de evento</span>
          <span class="detail-value">${data.eventType}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Precio</span>
          <span class="detail-value">${formattedPrice}</span>
        </div>
        ${data.notes ? `<div class="detail-row">
          <span class="detail-label">Notas del cliente</span>
          <span class="detail-value" style="max-width:250px;word-break:break-word;">${data.notes}</span>
        </div>` : ''}
      </div>

      <a href="${data.appUrl}/panel-host" class="cta-button">Ir al panel de host →</a>
    </div>`,
    `Nueva solicitud de reserva para ${data.salonName} — revisala ahora.`,
  )

  return {
    subject: `🔔 Nueva reserva #${shortId} en ${data.salonName}`,
    html,
  }
}

export interface BookingStatusUpdateData {
  guestName: string
  salonName: string
  eventDate: string
  startTime: string
  endTime: string
  newStatus: 'confirmed' | 'declined'
  rejectionReason: string | null
  quotedPrice: number | null
  bookingId: string
  appUrl: string
}

export function bookingStatusUpdateTemplate(data: BookingStatusUpdateData): {
  subject: string
  html: string
} {
  const shortId = data.bookingId.slice(0, 8).toUpperCase()
  const isConfirmed = data.newStatus === 'confirmed'
  const formattedDate = new Date(data.eventDate + 'T00:00:00').toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedPrice = data.quotedPrice
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(data.quotedPrice)
    : null

  const html = htmlWrapper(
    `<div class="body">
      <p class="title">${isConfirmed ? '🎊 ¡Reserva confirmada!' : '❌ Reserva no disponible'}</p>
      <p class="subtitle">
        Hola ${data.guestName},
        ${isConfirmed
          ? `el organizador de <strong style="color:#a78bfa;">${data.salonName}</strong> confirmó tu reserva. ¡Todo listo para tu evento!`
          : `lamentablemente el organizador de <strong style="color:#a78bfa;">${data.salonName}</strong> no pudo aceptar tu solicitud.`
        }
      </p>

      <div class="detail-box">
        <div class="detail-row">
          <span class="detail-label">Reserva #</span>
          <span class="detail-value">#${shortId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Estado</span>
          <span class="detail-value">
            <span class="badge ${isConfirmed ? 'badge-confirmed' : 'badge-declined'}">
              ${isConfirmed ? 'Confirmada' : 'Declinada'}
            </span>
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Salón</span>
          <span class="detail-value">${data.salonName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Fecha</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Horario</span>
          <span class="detail-value">${data.startTime} – ${data.endTime}</span>
        </div>
        ${formattedPrice ? `<div class="detail-row">
          <span class="detail-label">Precio confirmado</span>
          <span class="detail-value" style="color:#10b981;font-weight:700;">${formattedPrice}</span>
        </div>` : ''}
      </div>

      ${!isConfirmed && data.rejectionReason ? `
      <div class="alert-box">
        <p><strong>Motivo:</strong> ${data.rejectionReason}</p>
      </div>` : ''}

      <a href="${data.appUrl}/mis-reservas" class="cta-button">
        ${isConfirmed ? 'Ver detalles de mi reserva' : 'Buscar otro salón'}
      </a>
    </div>`,
    isConfirmed
      ? `¡Tu reserva en ${data.salonName} fue confirmada!`
      : `Tu solicitud en ${data.salonName} no pudo ser aceptada.`,
  )

  return {
    subject: isConfirmed
      ? `🎊 Reserva confirmada — ${data.salonName}`
      : `❌ Reserva #${shortId} no disponible — ${data.salonName}`,
    html,
  }
}

export interface BookingReminderData {
  guestName: string
  salonName: string
  salonAddress: string
  eventDate: string
  startTime: string
  endTime: string
  attendees: number
  bookingId: string
  appUrl: string
}

export function bookingReminderTemplate(data: BookingReminderData): {
  subject: string
  html: string
} {
  const shortId = data.bookingId.slice(0, 8).toUpperCase()
  const formattedDate = new Date(data.eventDate + 'T00:00:00').toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const html = htmlWrapper(
    `<div class="body">
      <p class="title">⏰ Tu evento es mañana</p>
      <p class="subtitle">Hola ${data.guestName}, te recordamos que tu evento en <strong style="color:#a78bfa;">${data.salonName}</strong> es mañana. ¡Todo pronto!</p>

      <div class="detail-box">
        <div class="detail-row">
          <span class="detail-label">Reserva #</span>
          <span class="detail-value">#${shortId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Salón</span>
          <span class="detail-value">${data.salonName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Dirección</span>
          <span class="detail-value">${data.salonAddress}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Fecha</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Horario</span>
          <span class="detail-value">${data.startTime} – ${data.endTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Asistentes</span>
          <span class="detail-value">${data.attendees} personas</span>
        </div>
      </div>

      <a href="${data.appUrl}/mis-reservas" class="cta-button">Ver detalles del evento</a>
    </div>`,
    `Recordatorio: tu evento en ${data.salonName} es mañana.`,
  )

  return {
    subject: `⏰ Recordatorio — Tu evento en ${data.salonName} es mañana`,
    html,
  }
}
