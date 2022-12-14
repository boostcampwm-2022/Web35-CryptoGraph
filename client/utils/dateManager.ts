import { ChartPeriod, DatePeriod } from '@/types/ChartTypes'

export function transDate(timestamp: number, period: ChartPeriod): string {
  const date = makeDate(timestamp, period)
  date.setHours(date.getHours() + 9)
  return date.toISOString().substring(0, 19)
}

export function makeDate(timestamp: number, period: ChartPeriod): Date {
  const date = new Date(timestamp - (timestamp % (DatePeriod[period] * 1000)))
  if (period === 'weeks') {
    const originalDate = new Date(timestamp)
    if (originalDate.getUTCDay() < 4) {
      date.setHours(105)
    } else {
      date.setHours(-63)
    }
  }
  return date
}
