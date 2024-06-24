// const { _ } = Cypress
describe('Filtering stamps', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('/stamps')
  })
  it('user can filter and sort stamps', () => {
    cy.get('#production').click()
    cy.url().should('include', '?category=production')

    cy.findAllByText('Production', { exact: false }).should(
      'have.length.greaterThan',
      10
    )

    cy.get('#enbesa').click()

    cy.url().should('include', '?category=production&region=enbesa')

    cy.findAllByText('enbesa').should('have.length.greaterThan', 2)
    cy.findByLabelText('sort')
      .select('newest')
      .invoke('val')
      .should('eq', 'newest')
    cy.url().should('include', 'category=production&region=enbesa&sort=newest')

    // flakey
    // cy.get('#cosmetic').click()
    // cy.url().should(
    //   'include',
    //   'category=production&category=cosmetic&region=enbesa&sort=newest'
    // )
    // need to make own cypress seed to better control clock instead of using general prisma seed
    // cy.wait(200)
    // const toStrings = (cells$) => _.map(cells$, 'textContent')
    // const toNumbers = (prices) => _.map(prices, Number)
    // cy.getBySel('stamp-card-downloads')
    //   .then(toStrings)
    //   .then(toNumbers)
    //   .then((prices) => {
    //     const sorted = _.sortBy(prices)

    //     expect(prices).to.deep.equal(sorted)
    //   })
  })

  it('pagination reset on exceeding pages through search functionality', () => {
    cy.findByLabelText('Page 10').click()
    cy.url().should('include', 'page=10')

    cy.get('#search').type('Stamp-800{enter}')

    cy.url().should('include', 'page=1&search=Stamp-800')
    cy.getBySel('stamp-card-link').should('have.length', 1)
  })
})
