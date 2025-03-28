import { buildFilterWhereClause } from '../singleton'

describe('buildFilterWhereClause', () => {
  it('returns empty where clause when filter is empty', () => {
    const filter = {}
    const result = buildFilterWhereClause(filter)
    expect(result).toEqual({ game: '117' })
  })

  it('builds a where clause with all single string filter properties', () => {
    const filter = {
      capital: 'crown falls',
      category: 'production',
      game: '1800',
      region: 'new world',
      search: 'Cool stamp',
    }
    const result = buildFilterWhereClause(filter)
    expect(result).toEqual({
      capital: 'crown falls',
      category: 'production',
      game: '1800',
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
      game: '117',
      title: {
        search: 'Test',
      },
    })
  })

  it('builds a where clause with OR filter array', () => {
    const filter = {
      category: ['production', 'cosmetic'],
      game: '1800',
    }
    const result = buildFilterWhereClause(filter)
    expect(result).toEqual({
      game: '1800',
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
