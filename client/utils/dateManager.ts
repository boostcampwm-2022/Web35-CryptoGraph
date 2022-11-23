import { ChartPeriod, DatePeriod } from '@/types/ChartTypes'

export function transDate(timestamp: number, period: ChartPeriod): string {
  const date = new Date(timestamp - (timestamp % (DatePeriod[period] * 1000)))
  date.setHours(date.getHours() + 9)
  return date.toISOString().substring(0, 19)
}

export function makeDate(timestamp: number, period: number): Date {
  return new Date(timestamp - (timestamp % (period * 1000)))
}
