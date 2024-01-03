import { buildFilterWhereClause } from '../singleton'

describe('buildFilterWhereClause', () => {
  it('returns only modded false as default when no filter properties are provided', () => {
    const filter = {}
    const result = buildFilterWhereClause(filter)
    expect(result).toEqual({})
  })

  it('builds a where clause with all filter properties', () => {
    const filter = {
      modded: 'true',
      capital: 'crown falls',
      region: 'new world',
      category: 'production',
      townhall: 'true',
      tradeUnion: 'false',
      search: 'Cool stamp',
    }
    const result = buildFilterWhereClause(filter)
    expect(result).toEqual({
      modded: true,
      capital: 'crown falls',
      region: 'new world',
      category: 'production',
      townhall: true,
      title: {
        search: 'Cool stamp',
      },
      description: {
        search: 'Cool stamp',
      },
    })
  })

  it('ignores undefined properties in the filter', () => {
    const filter = {
      modded: 'true',
      region: undefined,
      search: 'Test',
    }
    const result = buildFilterWhereClause(filter)
    expect(result).toEqual({
      modded: true,
      title: {
        search: 'Test',
      },
      description: {
        search: 'Test',
      },
    })
  })

  it('handles empty string values correctly', () => {
    const filter = {
      modded: 'true',
      region: '',
      search: '',
    }
    const result = buildFilterWhereClause(filter)
    expect(result).toEqual({
      modded: true,
    })
  })
})
