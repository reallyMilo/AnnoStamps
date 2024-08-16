import { buildFilterWhereClause } from '../singleton'

describe('buildFilterWhereClause', () => {
  it('returns empty where clause when filter is empty', () => {
    const filter = {}
    const result = buildFilterWhereClause(filter)
    expect(result).toEqual({})
  })

  it('builds a where clause with all single string filter properties', () => {
    const filter = {
      capital: 'crown falls',
      category: 'production',
      region: 'new world',
      search: 'Cool stamp',
    }
    const result = buildFilterWhereClause(filter)
    expect(result).toEqual({
      capital: 'crown falls',
      category: 'production',
      region: 'new world',
      title: {
        search: 'Cool | stamp',
      },
    })
  })

  it('ignores undefined and empty string properties in the filter', () => {
    const filter = {
      category: '',
      region: undefined,
      search: 'Test',
    }
    const result = buildFilterWhereClause(filter)
    expect(result).toEqual({
      title: {
        search: 'Test',
      },
    })
  })

  it('builds a where clause with OR filter array', () => {
    const filter = {
      category: ['production', 'cosmetic'],
    }
    const result = buildFilterWhereClause(filter)
    expect(result).toEqual({
      OR: [
        {
          category: 'production',
        },
        {
          category: 'cosmetic',
        },
      ],
    })
  })
})
