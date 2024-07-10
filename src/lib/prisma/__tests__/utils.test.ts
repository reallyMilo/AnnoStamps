import { formatIntegerWithSuffix } from '../utils'

describe('formatIntegerWithSuffix', () => {
  it('returns input', () => {
    expect(formatIntegerWithSuffix(999)).eq('999')
  })
  it('adds suffix K for numbers greater or equal to 1000 with rounding and decimals', () => {
    expect(formatIntegerWithSuffix(1001)).eq('1K')
    expect(formatIntegerWithSuffix(1090)).eq('1.1K')
    expect(formatIntegerWithSuffix(11300)).eq('11.3K')
    expect(formatIntegerWithSuffix(115000)).eq('115K')
    expect(formatIntegerWithSuffix(998300)).eq('998K')
    expect(formatIntegerWithSuffix(999300)).eq('999K')
  })
})
