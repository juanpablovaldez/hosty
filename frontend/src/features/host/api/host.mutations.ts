import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import type { Booking } from '../types'

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
      images,
    }: {
      userId: string
      step1: { name: string; description: string; location: string; address: string }
      step2: { capacity: number; pricePerHour: number; rentTimeHours: number; eventTypes: string[]; amenities: string[] }
      images: File[]
    }) => {
      const uploadedUrls = await uploadSalonImages(userId, images)
      const { error } = await supabase.from('salones').insert({
        name: step1.name,
        description: step1.description,
        location: step1.location,
        address: step1.address,
        capacity: step2.capacity,
        price_per_hour: step2.pricePerHour,
        rent_time_hours: step2.rentTimeHours,
        event_types: step2.eventTypes,
        amenities: step2.amenities,
        images: uploadedUrls,
        host_id: userId,
        availability_status: 'disponible',
      })
      if (error) throw error
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
      newFiles,
      keptUrls,
    }: {
      id: string
      userId: string
      step1: { name: string; description: string; location: string; address: string }
      step2: { capacity: number; pricePerHour: number; rentTimeHours: number; eventTypes: string[]; amenities: string[] }
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
        price_per_hour: step2.pricePerHour,
        rent_time_hours: step2.rentTimeHours,
        event_types: step2.eventTypes,
        amenities: step2.amenities,
        images,
      }).eq('id', id)
      if (error) throw error
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
    mutationFn: async ({ id, status }: { id: string; status: Booking['status'] }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host', 'bookings'] })
    },
  })
}
