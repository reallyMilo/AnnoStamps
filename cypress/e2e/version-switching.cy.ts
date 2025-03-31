describe('Switch between game versions via navigation links and see corresponding data', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('user route should display default version stamps and switch to 1800 stamps', () => {
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

    cy.getBySel('1800-version-link').click()

    cy.title().should('contain', '1800')
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
})
