describe('Update stamp page', () => {
  beforeEach(() => {
    cy.usernameSession('/user/clll7fyxp002sem82uejwfey5')

    cy.intercept('GET', '/api/user', {
      fixture: 'userStamps.json',
    }).as('getUser')
    cy.intercept('GET', '/api/get-stamp', {
      fixture: 'test-stamp.zip',
    }).as('getStampZip')
    cy.wait(['@getUser', '@getStampZip'])
  })

  it('renders stamp assets and defaults', () => {
    cy.findByText('test-stamp-zip').should('exist')
    cy.get('#category').should('have.value', 'production')
    cy.get('#region').should('have.value', 'old world')
    cy.get('#modded').should('have.value', 'false')
    cy.get('#good').should('have.value', 'indigo dye')
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
