import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export function useURL(startMarket: string): string {
  const router = useRouter()
  const [market, setMarket] = useState<string>(startMarket)
  useEffect(() => {
    const market = Array.isArray(router.query.market)
      ? router.query.market[0].toUpperCase()
      : router.query.market?.toUpperCase()
    if (!market) return
    setMarket(market)
    console.log(market, '이게 라우터야')
  }, [router.query.market])

  return market
}
