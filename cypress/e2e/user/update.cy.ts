describe('Update stamp page', () => {
  it('renders stamp assets and defaults', () => {
    cy.intercept('GET', '/api/user', {
      fixture: 'userStamps.json',
    }).as('getUser')
    cy.intercept('GET', '/api/get-stamp', {
      fixture: 'test-stamp.zip',
    }).as('getStampZip')
    cy.usernameSession('/user/clll7fyxp002sem82uejwfey5')

    cy.wait(['@getUser', '@getStampZip'])

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

  it('displays alert to set username with link if username not set', () => {
    cy.newUserSession('/user/create')

    cy.findByRole('link', { name: 'Please set your username.' }).should(
      'have.attr',
      'href',
      '/user/account'
    )

    cy.findByLabelText('Add Images').should('not.exist')
  })
})
