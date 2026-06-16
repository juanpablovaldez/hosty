import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/lib/supabase'
import type { Salon, SalonSearchParams } from '../types'
import type { PriceType } from '../lib/pricing'
import type { Database } from '@/shared/lib/database.types'

type SalonRow = Database['public']['Tables']['salones']['Row']
type SalonServiceRow = Database['public']['Tables']['salon_services']['Row']
type SalonRowWithServices = SalonRow & {
  salon_services?: Pick<SalonServiceRow, 'id' | 'name' | 'price'>[] | null
}

const SALON_SELECT = '*, salon_services(id, name, price)'

function buildFilteredSalonesQuery(params: SalonSearchParams) {
  let query = supabase.from('salones').select(SALON_SELECT, { count: 'exact' })

  if (params.name) {
    query = query.ilike('name', `%${params.name}%`)
  }
  if (params.location) {
    query = query.ilike('location', `%${params.location}%`)
  }
  if (params.locations?.length) {
    const orClause = params.locations.map((z) => `location.ilike.%${z}%`).join(',')
    query = query.or(orClause)
  }
  if (params.capacity) {
    query = query.gte('capacity', params.capacity)
  }
  if (params.minPrice != null) {
    query = query.gte('price_per_hour', params.minPrice)
  }
  if (params.maxPrice != null) {
    query = query.lte('price_per_hour', params.maxPrice)
  }
  if (params.availability) {
    query = query.eq('availability_status', params.availability)
  } else {
    // Los salones pausados por el host ('no disponible') no se muestran en el listado/mapa público
    query = query.neq('availability_status', 'no disponible')
  }
  if (params.eventTypes?.length) {
    query = query.overlaps('event_types', params.eventTypes)
  }
  if (params.amenities?.length) {
    query = query.overlaps('amenities', params.amenities)
  }

  return query
}

export function rowToSalon(row: SalonRowWithServices): Salon {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    images: row.images,
    priceType: row.price_type as PriceType,
    pricePerHour: row.price_per_hour,
    priceMin: row.price_min,
    priceMax: row.price_max,
    services: (row.salon_services ?? []).map((s) => ({ id: s.id, name: s.name, price: s.price })),
    rating:
      row.rating_value != null && row.rating_count != null
        ? { value: row.rating_value, count: row.rating_count }
        : null,
    capacity: row.capacity,
    location: row.location,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    isVerified: row.is_verified,
    rentTimeHours: row.rent_time_hours,
    isFavorite: false,
    amenities: row.amenities,
    availabilityStatus: row.availability_status as Salon['availabilityStatus'],
    eventTypes: row.event_types,
  }
}

export function useFeaturedSalones() {
  return useQuery({
    queryKey: ['salones', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salones')
        .select(SALON_SELECT)
        .eq('availability_status', 'disponible')
        .eq('is_verified', true)
        .order('rating_value', { ascending: false })
        .limit(6)
      if (error) throw error
      return (data ?? []).map(rowToSalon)
    },
  })
}

export function useSearchSalones(params: SalonSearchParams) {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 20
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  return useQuery({
    queryKey: ['salones', 'search', params],
    queryFn: async () => {
      let query = buildFilteredSalonesQuery(params)

      // Ordenamiento server-side
      if (params.sortBy === 'price_asc') {
        query = query.order('price_per_hour', { ascending: true })
      } else if (params.sortBy === 'price_desc') {
        query = query.order('price_per_hour', { ascending: false })
      } else if (params.sortBy === 'capacity') {
        query = query.order('capacity', { ascending: false })
      } else {
        // Default: relevancia (rating desc)
        query = query.order('rating_value', { ascending: false, nullsFirst: false })
      }

      // Paginación server-side
      query = query.range(from, to)

      const { data, error, count } = await query
      if (error) throw error

      const total = count ?? 0
      return {
        salones: (data ?? []).map(rowToSalon),
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      }
    },
  })
}


const MAP_MAX_RESULTS = 500

export function useSalonesMap(params: SalonSearchParams, enabled = true) {
  return useQuery({
    queryKey: ['salones', 'map', params],
    enabled,
    queryFn: async () => {
      const query = buildFilteredSalonesQuery(params)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order('rating_value', { ascending: false, nullsFirst: false })
        .range(0, MAP_MAX_RESULTS - 1)

      const { data, error } = await query
      if (error) throw error
      return (data ?? [])
        .map(rowToSalon)
        .filter((s): s is Salon & { latitude: number; longitude: number } =>
          s.latitude != null && s.longitude != null,
        )
    },
  })
}

export function useSalonBlockedDates(id: string) {
  return useQuery({
    queryKey: ['salon', id, 'blocks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salon_availability_blocks')
        .select('date')
        .eq('salon_id', id)
      if (error) throw error
      return (data ?? []).map((b) => b.date)
    },
    enabled: !!id,
  })
}

export function useSalon(id: string) {
  return useQuery({
    queryKey: ['salones', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salones')
        .select(SALON_SELECT)
        .eq('id', id)
        .single()
      if (error) throw error
      return rowToSalon(data)
    },
    enabled: !!id,
  })
}
