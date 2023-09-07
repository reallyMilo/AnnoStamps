describe('Home Page', () => {
  it('render home page', () => {
    cy.visit('/')
  })

  describe('Stamp Card', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('liking stamp opens auth modal for unauthorized users', () => {
      cy.getBySel('auth-modal').should('not.exist')
      cy.getBySel('stamp-card-like').first().click()
      cy.getBySel('auth-modal').should('be.visible')
    })
  })
})
