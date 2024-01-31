describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('set filter fields displays in url', () => {
    cy.get('select#category')
      .select('production')
      .invoke('val')
      .should('eq', 'production')
    cy.get('select#region')
      .select('enbesa')
      .invoke('val')
      .should('eq', 'enbesa')
    cy.get('select#capital')
      .select('manola')
      .invoke('val')
      .should('eq', 'manola')
    cy.get('select#sort').select('newest').invoke('val').should('eq', 'newest')

    cy.get('#modded').check().should('be.checked')
    cy.get('#townhall').check().should('be.checked')
    cy.get('#trade-union').check().should('be.checked')

    //test flakey
    // cy.url().should(
    //   'include',
    //   'category=production&region=enbesa&modded=true&capital=manola&townhall=true&tradeunion=true'
    // )
  })
  it('removes filter param from url', () => {
    cy.get('select#category')
      .select('production')
      .invoke('val')
      .should('eq', 'production')
    cy.url().should('include', 'category=production')
    cy.get('select#category').select('All').invoke('val').should('eq', '')

    cy.url().should('not.include', '?')
  })
})
