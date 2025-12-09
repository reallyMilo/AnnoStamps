import { buildFilterWhereClause } from '../singleton'

describe('buildFilterWhereClause', () => {
  it('handles capital, category, and region as strings', () => {
    const filter = {
      capital: 'crown falls',
      category: 'production',
      game: '1800',
      region: 'new world',
      search: 'Cool stamp',
    }
    expect(buildFilterWhereClause(filter)).toEqual({
      capital: 'crown falls',
      category: 'production',
      game: '1800',
      region: 'new world',
      title: {
        search: 'Cool|stamp',
      },
    })
  })
  it('handles a category array and region as string', () => {
    const filter = {
      category: ['production', 'cosmetic'],
      game: '1800',
      region: 'old world',
      search: 'Cool|stamp',
    }
    expect(buildFilterWhereClause(filter)).toEqual({
      game: '1800',
      OR: [{ category: 'production' }, { category: 'cosmetic' }],
      region: 'old world',
      title: {
        search: 'Cool|stamp',
      },
    })
  })
  it('handles capital, category and region as arrays', () => {
    const filter = {
      capital: ['manila', 'crown falls'],
      category: ['production', 'cosmetic'],
      game: '1800',
      region: ['old world', 'new world', 'enbesa'],
    }
    expect(buildFilterWhereClause(filter)).toEqual({
      AND: [
        {
          OR: [
            {
              category: 'production',
            },
            {
              category: 'cosmetic',
            },
          ],
        },
        {
          OR: [
            {
              region: 'old world',
            },
            {
              region: 'new world',
            },
            {
              region: 'enbesa',
            },
          ],
        },
        {
          OR: [
            {
              capital: 'manila',
            },
            {
              capital: 'crown falls',
            },
          ],
        },
      ],
      game: '1800',
    })
  })

  it('trims and parses extra whitespace in search query', () => {
    const result = buildFilterWhereClause({
      game: '117',
      search: '  red   panda  king   x    ',
    })
    expect(result).toEqual({
      game: '117',
      title: { search: 'red|panda|king|x' },
    })
  })
  it('ignores undefined and empty string properties in the filter', () => {
    const filter = {
      category: '',
      game: '117',
      region: undefined,
      search: 'Test',
    }
    expect(buildFilterWhereClause(filter)).toEqual({
      game: '117',
      title: {
        search: 'Test',
      },
    })
  })
})
