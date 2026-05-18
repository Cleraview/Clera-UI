export type CardBrand = 'visa' | 'mastercard' | 'amex' | undefined

export const isCardField = (maskPreset?: string, hardMaxRaw?: number) =>
  maskPreset === 'card16' || (hardMaxRaw !== undefined && hardMaxRaw >= 15)

export function detectCardBrand(raw: string): CardBrand {
  const r = String(raw ?? '').replace(/\D/g, '')
  if (!r) return undefined

  if (/^4/.test(r)) return 'visa'
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(r)) return 'mastercard'
  if (/^3[47]/.test(r)) return 'amex'

  return undefined
}
