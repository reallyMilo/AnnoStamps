describe('Update stamp page', () => {
  beforeEach(() => {
    cy.userSession()
    cy.visit('/user/clll7fyxp002sem82uejwfey5')
    cy.wait('@session')
  })

  it('renders stamp assets and defaults', () => {
    cy.intercept('GET', '/api/user', {
      fixture: 'userStamps',
    })
    cy.intercept('GET', '/api/get-stamp', {
      fixture: 'test-stamp.zip',
    })

    cy.findByText('test-stamp-zip').should('exist')
    cy.get('#category').should('have.value', 'production')
    cy.get('#region').should('have.value', 'old world')
    cy.get('#modded').should('have.value', 'false')
    cy.get('#good').should('have.value', 'indigo dye')
    cy.get('#tradeUnion').should('have.value', 'false')
    cy.get('#title').should(
      'have.value',
      'Stamp-Agricultural Products-Indigo Dye-0'
    )
    cy.get('#description').should(
      'have.value',
      'Stamp-Agricultural Products-Indigo Dye-0'
    )
  })
})
