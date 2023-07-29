describe('User menu', () => {
  beforeEach(() => {
    cy.userSession()
    cy.visit('/')
    cy.wait('@session')
    cy.getBySel('user-menu').click()
  })
  it('user menu and dropdown are visible', () => {
    cy.getBySel('user-menu').should('be.visible')
    cy.getBySel('user-dropdown').should('be.visible')
    cy.get('#user-name').contains('cypress-tester')
    cy.get('#user-email').contains('cypress@tester.com')
    cy.getBySel('user-menu-item', { multiple: true }).should('have.length', 4)
  })
})
