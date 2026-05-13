import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'

export function useSalonBookings(salonId: string) {
  return useQuery({
    queryKey: ['bookings', 'salon', salonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('event_date, start_time, end_time, status')
        .eq('salon_id', salonId)
        .neq('status', 'cancelled')
      
      if (error) throw error
      return data || []
    },
    enabled: !!salonId,
  })
}
