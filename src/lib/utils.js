'use client'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getQueryClient } from './get-query-client'

export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.trunc(Math.abs(amount)).toFixed().length
  }).format(amount)
}

export function Providers({ children }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export function converDateTime(dateTime) {
  const currentDate = new Date(dateTime).toLocaleDateString('id-ID')
  return currentDate
}

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
