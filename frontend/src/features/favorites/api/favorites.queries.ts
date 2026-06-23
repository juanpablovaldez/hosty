import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import { rowToSalon } from '@/features/salones/api/salones.queries'
import type { Salon } from '@/features/salones/types'

export function useUserFavoriteIds(userId: string | null) {
  return useQuery({
    queryKey: ['favorites', 'ids', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('salon_id')
        .eq('user_id', userId!)
      if (error) throw error
      return new Set((data ?? []).map((r) => r.salon_id))
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUserFavorites(userId: string | null) {
  return useQuery({
    queryKey: ['favorites', 'salones', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('salon_id, salones(*, salon_services(id, name, price))')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? [])
        .map((r) => r.salones)
        .filter(Boolean)
        .map((row) => {
          const salon: Salon = { ...rowToSalon(row as Parameters<typeof rowToSalon>[0]), isFavorite: true }
          return salon
        })
    },
    enabled: !!userId,
  })
}
