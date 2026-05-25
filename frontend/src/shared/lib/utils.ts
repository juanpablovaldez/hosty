import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formError(error: unknown): string | undefined {
  if (!error) return undefined
  if (typeof error === 'string') return error || undefined
  if (typeof error === 'object' && 'message' in error) return String((error as { message: unknown }).message)
  return undefined
}
