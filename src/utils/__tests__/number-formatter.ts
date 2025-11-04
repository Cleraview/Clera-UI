import { formatCurrency, shortenNumber } from '../number-formatter'

describe('utils/number-formatter', () => {
  describe('formatCurrency', () => {
    it('should format USD (default) correctly without cents', () => {
      expect(formatCurrency(1234.56)).toBe('$1,235')
      expect(formatCurrency(1000)).toBe('$1,000')
      expect(formatCurrency(0)).toBe('$0')
    })

    it('should format other currencies correctly', () => {
      expect(formatCurrency(5000, 'EUR')).toContain('€')
      expect(formatCurrency(5000, 'EUR')).toMatch(/€5,000|5,000.€/)

      expect(formatCurrency(100000, 'JPY')).toContain('¥')
      expect(formatCurrency(100000, 'JPY')).toMatch(/¥100,000|100,000.¥/)
    })

    it('should handle large numbers with separators', () => {
      expect(formatCurrency(1234567890)).toBe('$1,234,567,890')
    })

    it('should handle negative numbers', () => {
      expect(formatCurrency(-500)).toBe('-$500')
    })
  })

  describe('shortenNumber', () => {
    it('should return numbers < 1000 as a string', () => {
      expect(shortenNumber(0)).toBe('0')
      expect(shortenNumber(999)).toBe('999')
      expect(shortenNumber(123)).toBe('123')
    })

    it('should format thousands (K) with no decimals', () => {
      expect(shortenNumber(1000)).toBe('1K')
      expect(shortenNumber(1500)).toBe('2K')
      expect(shortenNumber(12345)).toBe('12K')
      expect(shortenNumber(999999)).toBe('1000K')
    })

    it('should format millions (M) with one decimal', () => {
      expect(shortenNumber(1000000)).toBe('1.0M')
      expect(shortenNumber(1234567)).toBe('1.2M')
      expect(shortenNumber(999999999)).toBe('1000.0M')
    })

    it('should format billions (B) with one decimal', () => {
      expect(shortenNumber(1000000000)).toBe('1.0B')
      expect(shortenNumber(5432109876)).toBe('5.4B')
    })

    it('should handle negative numbers', () => {
      expect(shortenNumber(-1500)).toBe('-2K')
      expect(shortenNumber(-3400000)).toBe('-3.4M')
      expect(shortenNumber(-9876543210)).toBe('-9.9B')
    })
  })
})
