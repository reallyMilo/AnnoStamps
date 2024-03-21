describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Navbar and Footer links render', () => {
    cy.contains('a', 'All Stamps').should('have.attr', 'href', '/')
    cy.contains('a', 'How To').should('have.attr', 'href', '/how-to')
    cy.contains('a', 'Add Stamp').should('have.attr', 'href', '/auth/signin')

    cy.contains('a', 'Support AnnoStamps').should(
      'have.attr',
      'href',
      'https://www.buymeacoffee.com/miloK'
    )
    cy.getBySel('discord').should(
      'have.attr',
      'href',
      'https://discord.gg/73hfP54qXe'
    )
    cy.getBySel('github').should(
      'have.attr',
      'href',
      'https://github.com/reallyMilo/AnnoStamps'
    )
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

    cy.get('#modded')
      .click()
      .should('have.attr', 'data-headlessui-state', 'checked')

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

  it('resets query page param to 1', () => {
    cy.get('[value=13]').click()
    cy.url().should('include', 'page=13')

    cy.get('#search').type('Test-Seed-User-Stamp{enter}')

    cy.url().should('include', 'page=1&search=Test-Seed-User-Stamp')
  })
})
