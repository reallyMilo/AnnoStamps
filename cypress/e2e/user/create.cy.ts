describe('Create stamp', () => {
  beforeEach(() => {
    cy.userSession()
    cy.visit('/user/create')
    cy.wait('@session')
  })

  it('upload image and preview', () => {
    cy.get('#image').selectFile('cypress/fixtures/cypress-test-image.png', {
      force: true,
    })
    cy.getBySel('image-upload').should('be.visible')
    cy.get('#imgSrc').should('exist')
  })
  it('upload stamp', () => {
    cy.get('#stamp').selectFile('cypress/fixtures/stamp', {
      force: true,
    })
    cy.get('#fileSrc').should('exist')
  })
  it('can select fields and type inputs', () => {
    cy.get('#category').select('general').should('have.value', 'general')
    cy.get('#region').select('arctic').should('have.value', 'arctic')
    cy.get('#modded').select('No').should('have.value', 'false')
    cy.get('#title')
      .type('cypress test title')
      .should('have.value', 'cypress test title')
    cy.get('#description')
      .type('cypress test description')
      .should('have.value', 'cypress test description')
  })
})
