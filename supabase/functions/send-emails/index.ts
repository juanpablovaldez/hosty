// Supabase Edge Function: send-emails
// Unified email notification handler for Hosty.
// Dispatches booking-related emails via AWS SES based on the `type` field in the request payload.
//
// Payload types:
//   - "confirmation"       → email to guest when booking is created (status=pending)
//   - "host_notification"  → email to host when a booking is created for their salon
//   - "status_update"      → email to guest when host confirms or declines
//   - "reminder"           → email to guest 24h before the event (invoked by pg_cron)

import { SESClient, SendEmailCommand } from 'npm:@aws-sdk/client-ses'
import { createClient } from 'npm:@supabase/supabase-js@2'
import {
  bookingConfirmationTemplate,
  bookingReminderTemplate,
  bookingStatusUpdateTemplate,
  hostNotificationTemplate,
  type BookingConfirmationData,
  type BookingReminderData,
  type BookingStatusUpdateData,
  type HostNotificationData,
} from '../_shared/templates.ts'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EmailType = 'confirmation' | 'host_notification' | 'status_update' | 'reminder'

interface BookingRecord {
  id: string
  salon_id: string
  user_id: string
  event_date: string
  start_time: string
  end_time: string
  attendees: number
  event_type: string
  notes: string | null
  total_price: number | null
  quoted_price: number | null
  status: string
  rejection_reason: string | null
  contact_name: string | null
  contact_phone: string | null
}

interface SalonRecord {
  name: string
  address: string
  host_id: string | null
}

interface RequestPayload {
  type: EmailType
  record: BookingRecord
  // For status_update: the old record so we can detect the previous status
  old_record?: Partial<BookingRecord>
}

// ---------------------------------------------------------------------------
// AWS SES client — credentials injected as Supabase Secrets
// ---------------------------------------------------------------------------

function buildSESClient(): SESClient {
  const region = Deno.env.get('AWS_SES_REGION') ?? 'us-east-1'
  const accessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID')
  const secretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY')

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('AWS SES credentials are not set. Configure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY as Supabase Secrets.')
  }

  return new SESClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  })
}

// ---------------------------------------------------------------------------
// Email dispatch
// ---------------------------------------------------------------------------

async function sendEmail(client: SESClient, to: string, subject: string, html: string): Promise<void> {
  const fromEmail = Deno.env.get('AWS_SES_FROM_EMAIL') ?? 'noreply@hosty.ar'

  const command = new SendEmailCommand({
    Source: `Hosty <${fromEmail}>`,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: {
        Html: { Data: html, Charset: 'UTF-8' },
      },
    },
  })

  await client.send(command)
}

// ---------------------------------------------------------------------------
// Supabase admin client to fetch data from protected tables
// ---------------------------------------------------------------------------

function buildSupabaseAdmin() {
  const url = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.')
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  })
}

// ---------------------------------------------------------------------------
// Data fetchers
// ---------------------------------------------------------------------------

async function getUserEmail(supabase: ReturnType<typeof buildSupabaseAdmin>, userId: string): Promise<string | null> {
  // Uses the SECURITY DEFINER function created by the migration
  const { data, error } = await supabase.rpc('get_user_email', { target_user_id: userId })
  if (error) {
    console.error('get_user_email RPC error:', error.message)
    return null
  }
  return data as string | null
}

async function getSalon(
  supabase: ReturnType<typeof buildSupabaseAdmin>,
  salonId: string,
): Promise<SalonRecord | null> {
  const { data, error } = await supabase
    .from('salones')
    .select('name, address, host_id')
    .eq('id', salonId)
    .single()
  if (error) {
    console.error('getSalon error:', error.message)
    return null
  }
  return data as SalonRecord
}

// ---------------------------------------------------------------------------
// Handlers per notification type
// ---------------------------------------------------------------------------

const APP_URL = Deno.env.get('APP_URL') ?? 'https://hosty.ar'

async function handleConfirmation(
  ses: SESClient,
  supabase: ReturnType<typeof buildSupabaseAdmin>,
  booking: BookingRecord,
): Promise<void> {
  const [guestEmail, salon] = await Promise.all([
    getUserEmail(supabase, booking.user_id),
    getSalon(supabase, booking.salon_id),
  ])

  if (!guestEmail || !salon) {
    console.warn('handleConfirmation: missing guest email or salon data, skipping.')
    return
  }

  const guestName = booking.contact_name ?? 'Cliente'
  const data: BookingConfirmationData = {
    guestName,
    salonName: salon.name,
    eventDate: booking.event_date,
    startTime: booking.start_time,
    endTime: booking.end_time,
    attendees: booking.attendees,
    eventType: booking.event_type,
    totalPrice: booking.total_price,
    bookingId: booking.id,
    appUrl: APP_URL,
  }

  const { subject, html } = bookingConfirmationTemplate(data)
  await sendEmail(ses, guestEmail, subject, html)
  console.log(`Confirmation email sent to ${guestEmail} for booking ${booking.id}`)
}

async function handleHostNotification(
  ses: SESClient,
  supabase: ReturnType<typeof buildSupabaseAdmin>,
  booking: BookingRecord,
): Promise<void> {
  const salon = await getSalon(supabase, booking.salon_id)
  if (!salon?.host_id) {
    console.warn('handleHostNotification: no host_id for salon, skipping.')
    return
  }

  const hostEmail = await getUserEmail(supabase, salon.host_id)
  if (!hostEmail) {
    console.warn('handleHostNotification: could not resolve host email, skipping.')
    return
  }

  const data: HostNotificationData = {
    hostName: 'Host',
    guestName: booking.contact_name ?? 'Cliente',
    guestPhone: booking.contact_phone,
    salonName: salon.name,
    eventDate: booking.event_date,
    startTime: booking.start_time,
    endTime: booking.end_time,
    attendees: booking.attendees,
    eventType: booking.event_type,
    notes: booking.notes,
    totalPrice: booking.total_price,
    bookingId: booking.id,
    appUrl: APP_URL,
  }

  const { subject, html } = hostNotificationTemplate(data)
  await sendEmail(ses, hostEmail, subject, html)
  console.log(`Host notification sent to ${hostEmail} for booking ${booking.id}`)
}

async function handleStatusUpdate(
  ses: SESClient,
  supabase: ReturnType<typeof buildSupabaseAdmin>,
  booking: BookingRecord,
): Promise<void> {
  if (booking.status !== 'confirmed' && booking.status !== 'declined') {
    console.log(`handleStatusUpdate: status "${booking.status}" does not require notification, skipping.`)
    return
  }

  const [guestEmail, salon] = await Promise.all([
    getUserEmail(supabase, booking.user_id),
    getSalon(supabase, booking.salon_id),
  ])

  if (!guestEmail || !salon) {
    console.warn('handleStatusUpdate: missing guest email or salon data, skipping.')
    return
  }

  const data: BookingStatusUpdateData = {
    guestName: booking.contact_name ?? 'Cliente',
    salonName: salon.name,
    eventDate: booking.event_date,
    startTime: booking.start_time,
    endTime: booking.end_time,
    newStatus: booking.status as 'confirmed' | 'declined',
    rejectionReason: booking.rejection_reason,
    quotedPrice: booking.quoted_price,
    bookingId: booking.id,
    appUrl: APP_URL,
  }

  const { subject, html } = bookingStatusUpdateTemplate(data)
  await sendEmail(ses, guestEmail, subject, html)
  console.log(`Status update email (${booking.status}) sent to ${guestEmail} for booking ${booking.id}`)
}

async function handleReminder(
  ses: SESClient,
  supabase: ReturnType<typeof buildSupabaseAdmin>,
  booking: BookingRecord,
): Promise<void> {
  const [guestEmail, salon] = await Promise.all([
    getUserEmail(supabase, booking.user_id),
    getSalon(supabase, booking.salon_id),
  ])

  if (!guestEmail || !salon) {
    console.warn('handleReminder: missing guest email or salon, skipping.')
    return
  }

  const data: BookingReminderData = {
    guestName: booking.contact_name ?? 'Cliente',
    salonName: salon.name,
    salonAddress: salon.address,
    eventDate: booking.event_date,
    startTime: booking.start_time,
    endTime: booking.end_time,
    attendees: booking.attendees,
    bookingId: booking.id,
    appUrl: APP_URL,
  }

  const { subject, html } = bookingReminderTemplate(data)
  await sendEmail(ses, guestEmail, subject, html)
  console.log(`Reminder email sent to ${guestEmail} for booking ${booking.id}`)
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  // Validate request method
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Validate webhook secret to prevent unauthorized calls
  const webhookSecret = Deno.env.get('SUPABASE_WEBHOOK_SECRET')
  if (webhookSecret) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${webhookSecret}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  let payload: RequestPayload
  try {
    payload = (await req.json()) as RequestPayload
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { type, record } = payload
  if (!type || !record) {
    return new Response(JSON.stringify({ error: 'Missing required fields: type, record' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  console.log(`send-emails invoked with type="${type}" for booking ${record.id}`)

  try {
    const ses = buildSESClient()
    const supabase = buildSupabaseAdmin()

    switch (type) {
      case 'confirmation':
        await handleConfirmation(ses, supabase, record)
        break
      case 'host_notification':
        await handleHostNotification(ses, supabase, record)
        break
      case 'status_update':
        await handleStatusUpdate(ses, supabase, record)
        break
      case 'reminder':
        await handleReminder(ses, supabase, record)
        break
      default:
        return new Response(
          JSON.stringify({ error: `Unknown notification type: ${type as string}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        )
    }

    return new Response(JSON.stringify({ success: true, type }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('send-emails error:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
