import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import type { Booking } from '../types'
import type { Step1, Step2 } from '../lib/salon-wizard'
import type { SalonService } from '@/features/salones/lib/pricing'

function pricingColumns(step2: Step2) {
  return {
    price_type: step2.priceType,
    price_per_hour: step2.priceType === 'fixed' ? step2.pricePerHour : null,
    price_min: step2.priceType === 'estimated' ? step2.priceMin : null,
    price_max: step2.priceType === 'estimated' ? step2.priceMax : null,
  }
}

async function uploadSalonImages(userId: string, files: File[]): Promise<string[]> {
  const urls: string[] = []
  for (const file of files) {
    const ext = file.name.split('.').pop()
    const path = `salones/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('salon-images').upload(path, file)
    if (error) throw error
    const { data } = supabase.storage.from('salon-images').getPublicUrl(path)
    urls.push(data.publicUrl)
  }
  return urls
}

export function useCreateSalon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      step1,
      step2,
      services,
      images,
    }: {
      userId: string
      step1: Step1
      step2: Step2
      services: SalonService[]
      images: File[]
    }) => {
      const uploadedUrls = await uploadSalonImages(userId, images)
      const { data: salon, error } = await supabase
        .from('salones')
        .insert({
          name: step1.name,
          description: step1.description,
          location: step1.location,
          address: step1.address,
          capacity: step2.capacity,
          ...pricingColumns(step2),
          rent_time_hours: step2.rentTimeHours,
          event_types: step2.eventTypes,
          amenities: step2.amenities,
          images: uploadedUrls,
          host_id: userId,
          availability_status: 'disponible',
        })
        .select('id')
        .single()
      if (error) throw error
      if (services.length > 0) {
        const { error: svcError } = await supabase
          .from('salon_services')
          .insert(services.map((s) => ({ salon_id: salon.id, name: s.name, price: s.price })))
        if (svcError) throw svcError
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['host', 'salones', variables.userId] })
    },
  })
}

export function useUpdateSalon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      userId,
      step1,
      step2,
      services,
      newFiles,
      keptUrls,
    }: {
      id: string
      userId: string
      step1: Step1
      step2: Step2
      services: SalonService[]
      newFiles: File[]
      keptUrls: string[]
    }) => {
      const uploadedUrls = await uploadSalonImages(userId, newFiles)
      const images = [...keptUrls, ...uploadedUrls]
      const { error } = await supabase.from('salones').update({
        name: step1.name,
        description: step1.description,
        location: step1.location,
        address: step1.address,
        capacity: step2.capacity,
        ...pricingColumns(step2),
        rent_time_hours: step2.rentTimeHours,
        event_types: step2.eventTypes,
        amenities: step2.amenities,
        images,
      }).eq('id', id)
      if (error) throw error

      const { error: delError } = await supabase.from('salon_services').delete().eq('salon_id', id)
      if (delError) throw delError
      if (services.length > 0) {
        const { error: svcError } = await supabase
          .from('salon_services')
          .insert(services.map((s) => ({ salon_id: id, name: s.name, price: s.price })))
        if (svcError) throw svcError
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['host', 'salones', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['salon', variables.id] })
    },
  })
}

export function useDeleteSalon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string; userId: string }) => {
      const { error } = await supabase.from('salones').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['host', 'salones', variables.userId] })
    },
  })
}

export function useUpdateSalonAvailability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, availabilityStatus }: { id: string; userId: string; availabilityStatus: string }) => {
      const { error } = await supabase
        .from('salones')
        .update({ availability_status: availabilityStatus })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['host', 'salones', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['salon', variables.id] })
    },
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
      rejectionReason,
      quotedPrice,
    }: {
      id: string
      status: Booking['status']
      rejectionReason?: string
      quotedPrice?: number
    }) => {
      const patch: {
        status: Booking['status']
        rejection_reason: string | null
        quoted_price?: number
      } = {
        status,
        rejection_reason: status === 'declined' ? (rejectionReason ?? null) : null,
      }
      if (quotedPrice != null) patch.quoted_price = quotedPrice
      const { error } = await supabase.from('bookings').update(patch).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host', 'bookings'] })
    },
  })
}

export function useUpdateBookingQuote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, quotedPrice }: { id: string; quotedPrice: number }) => {
      const { error } = await supabase.from('bookings').update({ quoted_price: quotedPrice }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host', 'bookings'] })
    },
  })
}

export function useAddAvailabilityBlock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ salonId, date }: { salonId: string; date: string }) => {
      const { error } = await supabase.from('salon_availability_blocks').insert({ salon_id: salonId, date })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host', 'blocks'] })
      queryClient.invalidateQueries({ queryKey: ['salon'] })
    },
  })
}

export function useRemoveAvailabilityBlock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase.from('salon_availability_blocks').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host', 'blocks'] })
      queryClient.invalidateQueries({ queryKey: ['salon'] })
    },
  })
}
