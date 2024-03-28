const { _ } = Cypress
describe('Filtering stamps', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('user can filter and sort stamps', () => {
    cy.get('select#category')
      .select('production')
      .invoke('val')
      .should('eq', 'production')

    cy.url().should('include', '?category=production')

    cy.findAllByText('Production', { exact: false }).should(
      'have.length.greaterThan',
      10
    )

    cy.get('select#region')
      .select('enbesa')
      .invoke('val')
      .should('eq', 'enbesa')

    cy.url().should('include', '?category=production&region=enbesa')

    cy.findAllByText('enbesa').should('have.length.greaterThan', 2)

    cy.get('select#sort').select('newest').invoke('val').should('eq', 'newest')
    cy.url().should('include', 'category=production&region=enbesa&sort=newest')

    cy.wait(200)
    const toStrings = (cells$) => _.map(cells$, 'textContent')
    const toNumbers = (prices) => _.map(prices, Number)
    cy.getBySel('stamp-card-downloads')
      .then(toStrings)
      .then(toNumbers)
      .then((prices) => {
        const sorted = _.sortBy(prices)

        expect(prices).to.deep.equal(sorted)
      })
  })

  it('pagination reset on exceeding pages through search functionality', () => {
    cy.get('[value=13]').click()
    cy.url().should('include', 'page=13')

    cy.get('#search').type('Stamp-800{enter}')

    cy.url().should('include', 'page=1&search=Stamp-800')
    cy.getBySel('stamp-card-link').should('have.length', 1)
  })
})
