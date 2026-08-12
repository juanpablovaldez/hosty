export interface Review {
  id: string
  createdAt: string
  updatedAt: string | null
  rating: number
  comment: string | null
  hostReply: string | null
  hostRepliedAt: string | null
  userId: string
  authorName: string
}

export interface ReviewPayload {
  salonId: string
  bookingId: string
  userId: string
  rating: number
  comment: string
}
