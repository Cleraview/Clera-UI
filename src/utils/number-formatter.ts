export function formatCurrency(
  price: number,
  currency: string = 'usd'
): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(price)
}

export const shortenNumber = (num: number): string => {
  if (num === 0) return '0'

  const sign = Math.sign(num) < 0 ? '-' : ''
  const absNum = Math.abs(num)
  let formattedNum: string

  if (absNum >= 1_000_000_000) {
    formattedNum = (absNum / 1_000_000_000).toFixed(1) + 'B'
  } else if (absNum >= 1_000_000) {
    formattedNum = (absNum / 1_000_000).toFixed(1) + 'M'
  } else if (absNum >= 1_000) {
    formattedNum = (absNum / 1_000).toFixed(0) + 'K'
  } else {
    formattedNum = absNum.toString()
  }

  return sign + formattedNum
}
