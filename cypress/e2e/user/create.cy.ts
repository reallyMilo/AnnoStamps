describe('Create stamp', () => {
  beforeEach(() => {
    cy.usernameSession('/user/create')
  })

  it('user can submit a stamp with all fields filled', () => {
    cy.findByLabelText('Add Images').selectFile(
      'cypress/fixtures/cypress-test-image.png',
      {
        force: true,
      }
    )
    cy.findByAltText('stamp image preview').should('exist')

    cy.findByText('Add Stamps').selectFile('cypress/fixtures/test-stamp', {
      force: true,
    })
    cy.findByText('test-stamp').should('exist')

    cy.get('#category').select('general').should('have.value', 'general')
    cy.get('#region').select('arctic').should('have.value', 'arctic')
    cy.get('#modded').select('No').should('have.value', 'false')
    cy.get('#title')
      .type('cypress test title')
      .should('have.value', 'cypress test title')
    cy.get('#description')
      .type('cypress test description')
      .should('have.value', 'cypress test description')

    cy.findByText('Submit Stamp').should('exist')
  })
})
