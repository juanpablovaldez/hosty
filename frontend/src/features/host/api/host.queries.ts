import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import { rowToSalon } from '@/features/salones/api/salones.queries'
import type { Salon } from '@/features/salones/types'
import type { SalonService } from '@/features/salones/lib/pricing'
import type { Booking, Subscription } from '../types'
import type { Database } from '@/shared/lib/database.types'

type BookingRow = Database['public']['Tables']['bookings']['Row']

const SALON_SELECT = '*, salon_services(id, name, price)'

function rowToBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    salonId: row.salon_id,
    userId: row.user_id,
    eventDate: row.event_date,
    startTime: row.start_time,
    endTime: row.end_time,
    attendees: row.attendees,
    eventType: row.event_type,
    notes: row.notes,
    totalPrice: row.total_price,
    quotedPrice: row.quoted_price,
    selectedServices: (row.selected_services as unknown as SalonService[]) ?? [],
    status: row.status as Booking['status'],
    rejectionReason: row.rejection_reason,
    contactName: row.contact_name,
    contactPhone: row.contact_phone,
    createdAt: row.created_at,
  }
}

export function useHostSalones(userId: string | null) {
  return useQuery({
    queryKey: ['host', 'salones', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salones')
        .select(SALON_SELECT)
        .eq('host_id', userId!)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []).map(rowToSalon)
    },
    enabled: !!userId,
  })
}

export function useHostSalon(id: string | null) {
  return useQuery({
    queryKey: ['host', 'salon', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salones')
        .select(SALON_SELECT)
        .eq('id', id!)
        .single()
      if (error) throw error
      const salon = rowToSalon(data)
      const hostSalon: HostSalon = { ...salon, hostId: data.host_id ?? '' }
      return hostSalon
    },
    enabled: !!id,
  })
}

export function useHostBookings(salonIds: string[]) {
  return useQuery({
    queryKey: ['host', 'bookings', salonIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .in('salon_id', salonIds)
        .order('event_date', { ascending: true })
      if (error) throw error
      return (data ?? []).map(rowToBooking)
    },
    enabled: salonIds.length > 0,
  })
}

export interface AvailabilityBlock {
  id: string
  salonId: string
  date: string
}

export function useSalonBlocks(salonIds: string[]) {
  return useQuery({
    queryKey: ['host', 'blocks', salonIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salon_availability_blocks')
        .select('id, salon_id, date')
        .in('salon_id', salonIds)
      if (error) throw error
      return (data ?? []).map((b) => ({ id: b.id, salonId: b.salon_id, date: b.date }))
    },
    enabled: salonIds.length > 0,
  })
}

export interface HostSalon extends Salon {
  hostId: string
}

export interface BookingDetail extends Booking {
  salonName: string
  salonHostId: string
}

export function useHostSubscription(userId: string | null) {
  return useQuery({
    queryKey: ['host', 'subscription', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salon_subscriptions')
        .select('*')
        .eq('host_id', userId!)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      if (!data) return null
      const sub: Subscription = {
        id: data.id,
        hostId: data.host_id,
        status: data.status as Subscription['status'],
        planId: data.plan_id,
        amountMonthly: data.amount_monthly,
        mercadopagoSubscriptionId: data.mercadopago_subscription_id,
        startedAt: data.started_at,
        currentPeriodEnd: data.current_period_end,
        cancelledAt: data.cancelled_at,
        createdAt: data.created_at,
      }
      return sub
    },
    enabled: !!userId,
  })
}

export function useHostBooking(id: string | null) {
  return useQuery({
    queryKey: ['host', 'booking', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, salones(name, host_id)')
        .eq('id', id!)
        .single()
      if (error) throw error
      const salon = data.salones as { name: string; host_id: string } | null
      const booking = rowToBooking(data as BookingRow)
      const detail: BookingDetail = {
        ...booking,
        salonName: salon?.name ?? '',
        salonHostId: salon?.host_id ?? '',
      }
      return detail
    },
    enabled: !!id,
  })
}
