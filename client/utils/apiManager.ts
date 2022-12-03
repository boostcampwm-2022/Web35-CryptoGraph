export const getPriceInfo = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/market-price-info`
  )
  if (res.status !== 200) {
    return null
  }
  const priceInfo = await res.json()
  return priceInfo
}
