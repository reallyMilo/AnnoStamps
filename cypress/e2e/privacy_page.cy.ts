describe('Privacy Page', () => {
  it('should display the privacy page', () => {
    cy.visit('/privacy')
    cy.get('h1').contains('Privacy Policy')
  })
})
