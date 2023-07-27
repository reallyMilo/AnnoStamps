describe('Header', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('logo links to home page', () => {
    cy.get('[id="header-logo"]').should('have.attr', 'href', '/')
  })
  it('links to home page', () => {
    cy.contains('All Stamps').should('have.attr', 'href', '/')
  })
  it('links to how-to page', () => {
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
