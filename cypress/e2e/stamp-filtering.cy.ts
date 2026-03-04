/*eslint @eslint-community/eslint-comments/disable-enable-pair: [error, {allowWholeFile: true}] */
/* eslint-disable cypress/unsafe-to-chain-command */
//FIXME: unsafe chain
const expectSearchParams = (assertions: (params: URLSearchParams) => void) => {
  cy.location('search').should((search) => {
    assertions(new URLSearchParams(search))
  })
}

describe('Filtering 117 Stamps', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('/stamps')
  })

  it('user can filter and sort stamps', () => {
    cy.findByText('117 Stamps').should('exist')

    cy.findByRole('checkbox', { name: /^Production$/i }).click()
    expectSearchParams((params) => {
      expect(params.get('category')).to.eq('production')
    })

    cy.findAllByText('Production', { exact: false }).should(
      'have.length.greaterThan',
      10,
    )
  })

  it('pagination reset on exceeding pages through search functionality', () => {
    cy.findByLabelText('Page 3').click()
    expectSearchParams((params) => {
      expect(params.get('page')).to.eq('3')
    })

    cy.getBySel('stamp-card-link')
      .first()
      .invoke('text')
      .then((text) => {
        const match = text.match(/Stamp-\d+-(\S*)/)
        expect(match).to.not.be.null
        const result = match![0] // e.g. "Stamp-460-" or "Stamp-460-strenuus"
        cy.findByLabelText('Search').type(`${result}{enter}`)
        expectSearchParams((params) => {
          expect(params.get('search')).to.eq(result)
          expect(params.get('page')).to.eq('1')
        })
      })

    cy.getBySel('stamp-card-link').should('have.length', 1)
  })

  it('preselects checkboxes based on category query params', () => {
    cy.visit('/stamps?category=production&category=general')

    cy.findByRole('checkbox', { name: /^Production$/i })
      .should('have.attr', 'aria-checked', 'true')
      .and('have.attr', 'data-headlessui-state', 'checked')
    cy.findByRole('checkbox', { name: /^General$/i })
      .should('have.attr', 'aria-checked', 'true')
      .and('have.attr', 'data-headlessui-state', 'checked')
  })
})

describe('Filtering 1800 stamps', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('/1800/stamps')
  })
  it('user can filter and sort stamps', () => {
    cy.findByText('1800 Stamps').should('exist')

    cy.findByRole('checkbox', { name: /^Production$/i }).click()
    expectSearchParams((params) => {
      expect(params.get('category')).to.eq('production')
    })

    cy.findAllByText('Production', { exact: false }).should(
      'have.length.greaterThan',
      10,
    )

    cy.findByRole('checkbox', { name: /^enbesa$/i }).click()

    expectSearchParams((params) => {
      expect(params.get('category')).to.eq('production')
      expect(params.get('region')).to.eq('enbesa')
    })

    cy.findAllByText('enbesa').should('have.length.greaterThan', 2)
    cy.findByLabelText('Sort')
      .select('newest')
      .invoke('val')
      .should('eq', 'newest')
    expectSearchParams((params) => {
      expect(params.get('category')).to.eq('production')
      expect(params.get('region')).to.eq('enbesa')
      expect(params.get('sort')).to.eq('newest')
      expect(params.get('page')).to.eq('1')
    })
  })
  it('preselects checkboxes based on category query params', () => {
    cy.visit('/1800/stamps?region=old%20world')

    cy.findByRole('checkbox', { name: /^old world$/i })
      .should('have.attr', 'aria-checked', 'true')
      .and('have.attr', 'data-headlessui-state', 'checked')
  })
})

describe('Filtering on User page Stamps', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('/filterseeduser')
  })

  it('displays 117 stamps as default', () => {
    cy.findByText('117 Stamps').should('exist')
    cy.findByRole('checkbox', { name: /^old world$/i }).should('not.exist')
    cy.getBySel('stamp-card-link').should('have.length', 20)

    cy.findByRole('checkbox', { name: /^Production$/i }).click()

    expectSearchParams((params) => {
      expect(params.get('category')).to.eq('production')
      expect(params.get('page')).to.eq('1')
    })

    cy.getBySel('stamp-card-link').should('have.length', 15)
  })

  it('displays no stamps', () => {
    cy.findByRole('checkbox', { name: /^General$/i }).click()
    cy.findByText('No stamps found.').should('exist')
  })

  it('displays 1800 stamps', () => {
    cy.visit('/filterseeduser/1800')
    cy.findByText('1800 Stamps').should('exist')
    cy.findByRole('checkbox', { name: /^old world$/i }).should('exist')
  })

  it('pagination resets to page 1', () => {
    cy.get('[aria-label="Page 2"]').click()
    cy.findByText('21 to 30 of 30').should('exist')
    expectSearchParams((params) => {
      expect(params.get('page')).to.eq('2')
    })
    cy.findByRole('checkbox', { name: /^Production$/i }).click()

    cy.findByText('1 to 15 of 15').should('exist')
    expectSearchParams((params) => {
      expect(params.get('category')).to.eq('production')
      expect(params.get('page')).to.eq('1')
    })
    cy.get('[aria-label="Page 2"]').should('not.exist')
  })
})
