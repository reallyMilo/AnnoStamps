describe('How To page', () => {
  it('renders', () => {
    cy.visit('/how-to')
    cy.findByText('How to use stamps in Anno 1800').should('exist')
  })
})
