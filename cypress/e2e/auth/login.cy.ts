describe('Login', () => {
  it('should open auth modal', () => {
    cy.visit('/')
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="auth-modal"]').should('exist')
  })
})
