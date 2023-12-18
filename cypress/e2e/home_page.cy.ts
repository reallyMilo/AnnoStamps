describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('liking stamp opens auth modal for unauthorized users', () => {
    cy.getBySel('auth-modal').should('not.exist')
    cy.get('article').first().findByRole('button').click()

    cy.getBySel('auth-modal').should('be.visible')
  })
})
