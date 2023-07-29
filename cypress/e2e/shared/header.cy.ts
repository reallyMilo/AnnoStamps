describe('Header', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('navbar links', () => {
    cy.get('[id="header-logo"]').should('have.attr', 'href', '/')
    cy.contains('All Stamps').should('have.attr', 'href', '/')
    cy.get('[href="/how-to"]').should('have.attr', 'href', '/how-to')
  })
  it('search bar is displayed', () => {
    cy.get('#search').should('be.visible')
  })
  it('opens auth modal', () => {
    cy.getBySel('login-button').click()
    cy.getBySel('auth-modal').should('be.visible')
  })
})
