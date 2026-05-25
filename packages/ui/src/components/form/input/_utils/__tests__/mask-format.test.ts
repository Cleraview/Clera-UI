import {
  isToken,
  maskTokenCapacity,
  extractRawForMask,
  extractRawChars,
  formatWithMask,
  buildMaskIndexMap,
  stripToMaskChars,
  applyMask,
  unmaskToRaw,
  unmask,
} from '../mask-format'

describe('utils/mask-format', () => {
  describe('isToken', () => {
    it('should identify mask tokens', () => {
      expect(isToken('9')).toBe(true)
      expect(isToken('A')).toBe(true)
      expect(isToken('*')).toBe(true)
      expect(isToken('a')).toBe(false)
      expect(isToken('1')).toBe(false)
      expect(isToken('-')).toBe(false)
    })
  })

  describe('maskTokenCapacity', () => {
    it('should count tokens in a mask', () => {
      expect(maskTokenCapacity('99/99/9999')).toBe(8)
      expect(maskTokenCapacity('(999) AAA-****')).toBe(10)
      expect(maskTokenCapacity('No tokens')).toBe(0)
    })
  })

  describe('extractRawForMask', () => {
    const mask = '(99) AAA-**'
    it('should extract matching characters', () => {
      expect(extractRawForMask(mask, '(12) ABC-d3')).toBe('12ABCd3')
    })
    it('should ignore non-matching characters', () => {
      expect(extractRawForMask(mask, 'Hello 12 World ABC d3')).toBe('12World')
    })
    it('should stop when tokens run out', () => {
      expect(extractRawForMask(mask, '12ABCd3-extra')).toBe('12ABCd3')
    })
  })

  describe('extractRawChars', () => {
    it('should strip all non-alphanumeric characters', () => {
      expect(extractRawChars('(123) 456-7890!@#')).toBe('1234567890')
      expect(extractRawChars('Hello World!')).toBe('HelloWorld')
    })
  })

  describe('formatWithMask', () => {
    const mask = '(99) AAA-**'
    it('should format raw values into the mask', () => {
      expect(formatWithMask(mask, '12ABCd3')).toBe('(12) ABC-d3')
    })
    it('should handle partial raw values', () => {
      expect(formatWithMask(mask, '12A')).toBe('(12) A')
    })
    it('should skip characters that do not match tokens', () => {
      expect(formatWithMask('99', 'A1B2')).toBe('12')
    })
    it('should return raw if no mask', () => {
      expect(formatWithMask('', '123')).toBe('123')
    })
  })

  describe('buildMaskIndexMap', () => {
    it('should build correct maps for a mask', () => {
      const mask = '(99) AAA-**'
      const masked = '(12) ABC-d3'
      const { rawToMasked, maskedToRaw } = buildMaskIndexMap(mask, masked)

      expect(rawToMasked).toEqual([1, 2, 5, 6, 7, 9, 10])
      expect(maskedToRaw).toEqual([-1, 0, 1, -1, -1, 2, 3, 4, -1, 5, 6])
    })
  })

  describe('stripToMaskChars', () => {
    it('should strip non-alphanumeric chars', () => {
      expect(stripToMaskChars('(99)', ' (12) ')).toBe('12')
    })
  })

  describe('applyMask', () => {
    const mask = '99/AA-**'
    it('should apply mask to value', () => {
      expect(applyMask({ mask, value: '12XYz1' })).toBe('12/XY-z1')
    })
    it('should use placeholder for missing chars', () => {
      expect(applyMask({ mask, value: '12XY', placeholderChar: '_' })).toBe(
        '12/XY-__'
      )
    })
    it('should not use placeholder if not provided', () => {
      expect(applyMask({ mask, value: '12XY' })).toBe('12/XY-')
    })
    it('should handle full value with no placeholder', () => {
      expect(applyMask({ mask, value: '12XYz1' })).toBe('12/XY-z1')
    })
    it('should handle partial value with no placeholder', () => {
      expect(applyMask({ mask, value: '12X' })).toBe('12/X')
    })
  })

  describe('unmaskToRaw', () => {
    const mask = '(99) AAA-**'
    it('should unmask a value to its raw chars based on mask', () => {
      expect(unmaskToRaw(mask, '(12) ABC-d3')).toBe('12ABCd3')
    })
    it('should ignore extra chars not in mask', () => {
      expect(unmaskToRaw(mask, '(12) ABC-d3-extra')).toBe('12ABCd3')
    })
    it('should handle mismatched chars', () => {
      expect(unmaskToRaw(mask, '(AB) 123-d3')).toBe('d3')
    })
  })

  describe('unmask', () => {
    it('should strip all non-alphanumeric chars', () => {
      expect(unmask('(123) 456-7890!@#')).toBe('1234567890')
    })
  })
})
