describe('Switch between game versions via navigation links and see corresponding data', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('user route should display default version stamps and switch to 1800 stamps', () => {
    cy.getBySel('default-version-link').should(
      'have.css',
      'background-color',
      'rgb(246, 174, 45)',
    )
    cy.getBySel('stamp-card-username-link')
      .last()
      .then((link) => {
        cy.visit(link.attr('href'))

        cy.getBySel('1800-version-link').should(
          'have.attr',
          'href',
          `${link.attr('href')}/1800`,
        )
      })

    cy.title().should('contain', '117')

    cy.getBySel('1800-version-link')
      .click()
      .then(() => {
        cy.title().should('contain', '1800')
        cy.getBySel('1800-version-link').should(
          'have.css',
          'background-color',
          'rgb(246, 174, 45)',
        )
      })
  })

  it('authenticated user viewing his homepage should be able to switch between his stamps', () => {
    cy.task('db:testUser', true)
    cy.setSessionCookie()
    cy.visit('/testSeedUser/1800')

    cy.findByText('New Stamp').should('exist')
    cy.title().should('contain', '1800')

    cy.getBySel('default-version-link').click()

    cy.findByText('New Stamp').should('exist')

    cy.task('db:removeTestUser')
  })
  it('authenticated user can view stamp create and 1800/stamp/create with version specific fields', () => {
    cy.task('db:testUser', true)
    cy.setSessionCookie()
    cy.visit('/stamp/create')

    cy.findByText('Upload 117 Stamp').should('exist')

    cy.getBySel('1800-version-link').click()

    cy.findByText('Upload 1800 Stamp').should('exist')
    cy.title().should('contain', '1800')
    cy.findByLabelText('Region').should('exist')

    cy.task('db:removeTestUser')
  })
})
