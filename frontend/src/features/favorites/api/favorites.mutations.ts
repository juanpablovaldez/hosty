import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'

export function useToggleFavorite(userId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ salonId, isFavorite }: { salonId: string; isFavorite: boolean }) => {
      if (!userId) throw new Error('Not authenticated')
      if (isFavorite) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('salon_id', salonId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: userId, salon_id: salonId })
        if (error) throw error
      }
    },
    onMutate: async ({ salonId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ['favorites', 'ids', userId] })
      const prev = queryClient.getQueryData<Set<string>>(['favorites', 'ids', userId])
      queryClient.setQueryData<Set<string>>(['favorites', 'ids', userId], (old) => {
        const next = new Set(old ?? [])
        if (isFavorite) next.delete(salonId)
        else next.add(salonId)
        return next
      })
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev !== undefined) {
        queryClient.setQueryData(['favorites', 'ids', userId], ctx.prev)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', 'ids', userId] })
      queryClient.invalidateQueries({ queryKey: ['favorites', 'salones', userId] })
    },
  })
}
