export interface BusySlot {
  eventDate: string
  startTime: string
  endTime: string
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

// El horario de fin es exclusivo: una reserva de 10:00 a 12:00 no choca con
// otra que arranca justo a las 12:00.
export function timesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string,
): boolean {
  return toMinutes(startA) < toMinutes(endB) && toMinutes(startB) < toMinutes(endA)
}

export function busySlotsForDate(busySlots: BusySlot[], eventDate: string): BusySlot[] {
  return busySlots
    .filter((slot) => slot.eventDate === eventDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}

export function findBookingConflict(
  candidate: BusySlot,
  busySlots: BusySlot[],
): BusySlot | null {
  if (!candidate.eventDate || !candidate.startTime || !candidate.endTime) return null

  return (
    busySlotsForDate(busySlots, candidate.eventDate).find((slot) =>
      timesOverlap(candidate.startTime, candidate.endTime, slot.startTime, slot.endTime),
    ) ?? null
  )
}

export function formatSlotRange(slot: BusySlot): string {
  return `${slot.startTime.slice(0, 5)} a ${slot.endTime.slice(0, 5)}`
}
