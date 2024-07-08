describe('Delete stamp', () => {
  beforeEach(() => {
    cy.task('db:testUser', true)
    cy.setSessionCookie()
  })
  afterEach(() => {
    cy.task('db:removeTestUser')
  })

  it('user cannot see stamp commands nor delete other stamps', () => {
    cy.visit('/')
    cy.getBySel('stamp-card-username-link')
      .last()
      .then((link) => {
        // use text here to catch upper case
        cy.visit(`/${link.text()}`)
        cy.getBySel('delete-stamp').should('not.exist')
        cy.getBySel('stamp-card-link')
          .last()
          .invoke('attr', 'href')
          .should('be.a', 'string')
          .invoke('split', '/')
          .its(2)
          .should('have.length', 24)
          .then((id) => {
            cy.request({
              url: `/${link.text()}/delete/${id}`,
              method: 'DELETE',
              failOnStatusCode: false,
            }).then((response) => {
              expect(response.status).to.eq(404)
            })
          })
      })
  })

  it('user can delete own stamp', () => {
    cy.intercept('/testseeduser').as('deleteStamp')
    cy.visit('/testseeduser')
    //FIXME: Need to revalidate the path for [username]
    cy.getBySel('delete-stamp').first().click()
    cy.findByRole('button', { name: 'Yes, delete' })
      .should('be.visible')
      .click()
    cy.wait('@deleteStamp')

    cy.database(
      `SELECT * FROM "Stamp" WHERE title = 'cypress test title';`,
    ).then((stamps) => {
      cy.wrap(stamps).should('have.length', 0)
    })
    // cy.findByText('Test-Seed-User-Stamp').should('be.visible')
  })
})
